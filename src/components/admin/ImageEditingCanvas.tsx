"use client";

import { useEffect, useRef, useState } from "react";
import { useField } from "@payloadcms/ui";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type MediaData = {
  id?: string | number;
  url?: string;
  mimeType?: string;
  alt?: string;
  focalX?: number | null;
  focalY?: number | null;
  isDerived?: boolean | null;
  parentMedia?: string | number | {
    id?: string | number;
    url?: string;
    focalX?: number | null;
    focalY?: number | null;
  } | null;
};
type MediaValue = string | number | MediaData | null | undefined;
type Props = { data?: MediaData; path?: string };
type CanvasToast = {
  message: string;
  derivedId?: string | number;
  tone: "success" | "error";
};

export function ImageEditingCanvas({ data, path }: Props) {
  const mediaField = useField<MediaValue>({ path: path ?? "media" });
  const aspectRatioField = useField<string | undefined>({ path: "imagePresentation.aspectRatio" });
  const aspectRatio = aspectRatioField.value ?? "original";
  const [media, setMedia] = useState<MediaData | undefined>(data);
  const [rotate, setRotate] = useState<0 | 90 | 180 | 270>(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const justCroppedRef = useRef(false);
  const [width, setWidth] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState<Crop>({ unit: "%", x: 0, y: 0, width: 100, height: 100 });
  const [focalPoint, setFocalPoint] = useState({ x: data?.focalX ?? 50, y: data?.focalY ?? 50 });
  const [draggingFocalPoint, setDraggingFocalPoint] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<CanvasToast | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(data?.url);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 7000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const fieldValue = mediaField.value;
    const selectedMedia = typeof fieldValue === "object" && fieldValue !== null ? fieldValue : undefined;
    const selectedId = typeof fieldValue === "string" || typeof fieldValue === "number"
      ? fieldValue
      : selectedMedia?.id;

    if (!selectedId) {
      setMedia(undefined);
      setPreviewUrl(undefined);
      return;
    }

    if (selectedMedia?.url) {
      setMedia(selectedMedia);
      setFocalPoint({ x: selectedMedia.focalX ?? 50, y: selectedMedia.focalY ?? 50 });
      return;
    }

    if (media?.id && String(media.id) === String(selectedId)) return;

    const controller = new AbortController();
    setMedia(undefined);
    setPreviewUrl(undefined);
    fetch(`/api/media/${encodeURIComponent(String(selectedId))}?depth=0`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return undefined;
        return (await response.json()) as MediaData;
      })
      .then((resolvedMedia) => {
        if (resolvedMedia) {
          setMedia(resolvedMedia);
          setFocalPoint({ x: resolvedMedia.focalX ?? 50, y: resolvedMedia.focalY ?? 50 });
        }
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [mediaField.value, media?.id]);

  const getCropPixelDimensions = (nextCrop: Crop = crop) => ({
    width: Math.max(1, Math.round((Number(nextCrop.width ?? 0) / 100) * previewDimensions.width)),
    height: Math.max(1, Math.round((Number(nextCrop.height ?? 0) / 100) * previewDimensions.height)),
  });

  const getCropAspect = (nextCrop: Crop = crop) => {
    const dimensions = getCropPixelDimensions(nextCrop);
    return dimensions.width / dimensions.height;
  };

  const editAspectRatio = aspectRatio === "original" ? undefined :
    aspectRatio === "1:1" ? 1 :
    aspectRatio === "4:3" ? 4 / 3 :
    aspectRatio === "16:9" ? 16 / 9 :
    aspectRatio === "portrait" ? 3 / 4 : undefined;

  const updateFocalPointFromPointer = (clientX: number, clientY: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    setFocalPoint({
      x: Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))),
      y: Math.round(Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))),
    });
  };

  const rotateFocalPoint = (direction: "cw" | "ccw") => {
    setFocalPoint((point) => direction === "cw"
      ? { x: 100 - point.y, y: point.x }
      : { x: point.y, y: 100 - point.x });
  };

  const centerFocalPointOnCrop = () => {
    const toPercent = (value: number, total: number) =>
      crop.unit === "%" ? value : (value / total) * 100;
    setFocalPoint({
      x: Math.round(Math.max(0, Math.min(100, toPercent(Number(crop.x ?? 0), previewDimensions.width) + toPercent(Number(crop.width ?? 0), previewDimensions.width) / 2))),
      y: Math.round(Math.max(0, Math.min(100, toPercent(Number(crop.y ?? 0), previewDimensions.height) + toPercent(Number(crop.height ?? 0), previewDimensions.height) / 2))),
    });
  };

  const undoCrop = () => {
    if (!previewDimensions.width || !previewDimensions.height) return;
    const parentMedia = media?.parentMedia;
    const parentMediaId = typeof parentMedia === "object" && parentMedia !== null
      ? parentMedia.id
      : parentMedia;

    if (media?.isDerived) {
      if (!parentMediaId) {
        setToast({ message: "Não foi possível localizar a mídia original desta edição.", tone: "error" });
        return;
      }

      mediaField.setValue(parentMediaId);
      setCrop({ unit: "%", x: 0, y: 0, width: 100, height: 100 });
      setRotate(0);
      setWidth(undefined);
      setHeight(undefined);
      setPreviewDimensions({ width: 0, height: 0 });
      if (typeof parentMedia === "object" && parentMedia?.url) {
        setMedia(parentMedia);
        setPreviewUrl(parentMedia.url);
        setFocalPoint({ x: parentMedia.focalX ?? 50, y: parentMedia.focalY ?? 50 });
      } else {
        setMedia(undefined);
        setPreviewUrl(undefined);
        setFocalPoint({ x: 50, y: 50 });
      }
      setToast({ message: "Edição desfeita. A mídia original foi restaurada neste bloco.", tone: "success" });
      return;
    }

    setCrop({ unit: "%", x: 0, y: 0, width: 100, height: 100 });
    setRotate(0);
    setFocalPoint({ x: media?.focalX ?? 50, y: media?.focalY ?? 50 });
    const isQuarterTurn = rotate === 90 || rotate === 270;
    setWidth(isQuarterTurn ? previewDimensions.height : previewDimensions.width);
    setHeight(isQuarterTurn ? previewDimensions.width : previewDimensions.height);
  };

  const setCropForDimensions = (nextWidth: number, nextHeight: number) => {
    if (!previewDimensions.width || !previewDimensions.height) return;
    const cropWidth = Math.min(100, (nextWidth / previewDimensions.width) * 100);
    const cropHeight = Math.min(100, (nextHeight / previewDimensions.height) * 100);
    const nextCrop: Crop = {
      unit: "%",
      x: Math.max(0, Math.min(100 - cropWidth, Number(crop.x ?? 0) + (Number(crop.width ?? 0) - cropWidth) / 2)),
      y: Math.max(0, Math.min(100 - cropHeight, Number(crop.y ?? 0) + (Number(crop.height ?? 0) - cropHeight) / 2)),
      width: cropWidth,
      height: cropHeight,
    };
    setCrop(nextCrop);
  };

  const syncHeightFromWidth = (nextWidth: number | undefined, nextCrop: Crop = crop) => {
    const boundedWidth = nextWidth && previewDimensions.width
      ? Math.min(nextWidth, previewDimensions.width)
      : nextWidth;
    setWidth(boundedWidth);
    if (boundedWidth) {
      const nextHeight = Math.min(
        previewDimensions.height || Number.MAX_SAFE_INTEGER,
        Math.max(1, Math.round(boundedWidth / getCropAspect(nextCrop))),
      );
      setHeight(nextHeight);
      setCropForDimensions(boundedWidth, nextHeight);
    }
  };

  const syncWidthFromHeight = (nextHeight: number | undefined, nextCrop: Crop = crop) => {
    const boundedHeight = nextHeight && previewDimensions.height
      ? Math.min(nextHeight, previewDimensions.height)
      : nextHeight;
    setHeight(boundedHeight);
    if (boundedHeight) {
      const nextWidth = Math.min(
        previewDimensions.width || Number.MAX_SAFE_INTEGER,
        Math.max(1, Math.round(boundedHeight * getCropAspect(nextCrop))),
      );
      setWidth(nextWidth);
      setCropForDimensions(nextWidth, boundedHeight);
    }
  };

  useEffect(() => {
    if (previewDimensions.width && previewDimensions.height) {
      const dimensions = getCropPixelDimensions();
      setWidth(dimensions.width);
      setHeight(dimensions.height);
    }
  }, [previewDimensions.width, previewDimensions.height]);

  useEffect(() => {
    if (!media?.url) return;

    const image = new Image();
    image.onload = () => {
      const quarterTurns = rotate / 90;
      const swapDimensions = quarterTurns % 2 === 1;
      const canvas = document.createElement("canvas");
      canvas.width = swapDimensions ? image.naturalHeight : image.naturalWidth;
      canvas.height = swapDimensions ? image.naturalWidth : image.naturalHeight;
      setPreviewDimensions({ width: canvas.width, height: canvas.height });
      setWidth(Math.max(1, Math.round((Number(crop.width ?? 100) / 100) * canvas.width)));
      setHeight(Math.max(1, Math.round((Number(crop.height ?? 100) / 100) * canvas.height)));
      const context = canvas.getContext("2d");
      if (!context) return;
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate((rotate * Math.PI) / 180);
      context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
      setPreviewUrl(canvas.toDataURL("image/png"));
    };
    image.src = media.url;
  }, [media?.url, rotate]);

  if (media?.mimeType && !media.mimeType.startsWith("image/")) return null;

  async function saveCurrentAsset() {
    setToast(null);
    if (!media?.id || !crop.width || !crop.height) {
      setToast({ message: "Selecione uma área válida para editar a imagem.", tone: "error" });
      return;
    }
    setBusy(true);
    const nextAltText = (media?.alt ?? "").trim();
    try {
      const response = await fetch("/api/media/edit-canvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalMediaId: String(media.id), rotate, resize: { width, height }, aspectRatio: aspectRatio === "original" ? undefined : aspectRatio, crop, focalPoint, altText: nextAltText }),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string; doc?: MediaData };
      if (!response.ok || !result.doc?.id) {
        setToast({ message: result.message ?? "Falha ao gerar a imagem derivada.", tone: "error" });
        return;
      }
      mediaField.setValue(result.doc.id);
      setMedia(result.doc);
      if (result.doc.url) setPreviewUrl(result.doc.url);
      setToast({ message: "Imagem derivada criada e vinculada a esta página.", derivedId: result.doc.id, tone: "success" });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "Falha ao gerar a imagem derivada.", tone: "error" });
    } finally {
      setBusy(false);
    }
  }

  return <section className="image-editing-canvas">
    <h2>Editar no Canvas</h2>
    {previewUrl && isMounted ? <div className="image-editing-canvas__stage">
      <div className="image-editing-canvas__frame" ref={frameRef} onPointerMove={(event) => {
        if (draggingFocalPoint) updateFocalPointFromPointer(event.clientX, event.clientY);
      }} onPointerUp={() => setDraggingFocalPoint(false)} onPointerLeave={() => setDraggingFocalPoint(false)}>
        <ReactCrop crop={crop} aspect={editAspectRatio} onChange={(_, percentCrop) => { setCrop(percentCrop); const dimensions = getCropPixelDimensions(percentCrop); setWidth(dimensions.width); setHeight(dimensions.height); }} onDragEnd={() => {
          justCroppedRef.current = true;
          window.setTimeout(() => { justCroppedRef.current = false; }, 0);
        }}>
          <img alt="Pré-visualização da imagem original" src={previewUrl} onClick={(event) => {
            if (justCroppedRef.current) return;
            event.stopPropagation();
            updateFocalPointFromPointer(event.clientX, event.clientY);
          }} />
        </ReactCrop>
        <span className="image-editing-canvas__focal-point" role="button" tabIndex={0} aria-label={`Ponto focal: ${focalPoint.x}% horizontal, ${focalPoint.y}% vertical`} title="Arraste ou clique na imagem para mover o ponto focal" style={{ left: `${focalPoint.x}%`, top: `${focalPoint.y}%` }} onPointerDown={(event) => { event.preventDefault(); event.stopPropagation(); setDraggingFocalPoint(true); event.currentTarget.setPointerCapture(event.pointerId); }} onKeyDown={(event) => { const step = event.shiftKey ? 10 : 1; if (event.key === "ArrowLeft") setFocalPoint((point) => ({ ...point, x: Math.max(0, point.x - step) })); if (event.key === "ArrowRight") setFocalPoint((point) => ({ ...point, x: Math.min(100, point.x + step) })); if (event.key === "ArrowUp") setFocalPoint((point) => ({ ...point, y: Math.max(0, point.y - step) })); if (event.key === "ArrowDown") setFocalPoint((point) => ({ ...point, y: Math.min(100, point.y + step) })); }} />
      </div>
    </div> : null}
    <div className="image-editing-canvas__toolbar">
      <label>Largura<input type="number" min={1} max={previewDimensions.width || undefined} value={width ?? ""} onChange={(event) => syncHeightFromWidth(event.target.value ? Number(event.target.value) : undefined)} /></label>
      <label>Altura<input type="number" min={1} max={previewDimensions.height || undefined} value={height ?? ""} onChange={(event) => syncWidthFromHeight(event.target.value ? Number(event.target.value) : undefined)} /></label>
      <button className="image-editing-canvas__center-focus" type="button" onClick={undoCrop} disabled={!previewDimensions.width || !previewDimensions.height}>Desfazer edição</button>
      <button className="image-editing-canvas__center-focus" type="button" onClick={centerFocalPointOnCrop} disabled={!previewDimensions.width || !previewDimensions.height}>Centralizar ponto focal no corte</button>
      <div className="image-editing-canvas__rotation"><button type="button" onClick={() => { rotateFocalPoint("ccw"); setRotate((rotate + 270) % 360 as 0 | 90 | 180 | 270); }} aria-label="Girar para a esquerda">↶</button><button type="button" onClick={() => { rotateFocalPoint("cw"); setRotate((rotate + 90) % 360 as 0 | 90 | 180 | 270); }} aria-label="Girar para a direita">↷</button></div>
      <button className="image-editing-canvas__save" type="button" onClick={saveCurrentAsset} disabled={busy}>{busy ? "Salvando..." : "Salvar imagem editada"}</button>
    </div>
    {toast ? <div className={`image-editing-canvas__toast image-editing-canvas__toast--${toast.tone}`} role={toast.tone === "error" ? "alert" : "status"}>
      <span>{toast.message}</span>
      {toast.derivedId ? <a href={`/admin/collections/media/${encodeURIComponent(String(toast.derivedId))}`}>Abrir mídia</a> : null}
      <button type="button" aria-label="Fechar aviso" onClick={() => setToast(null)}>×</button>
    </div> : null}
  </section>;
}
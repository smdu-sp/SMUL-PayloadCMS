"use client";

import { useEffect, useState } from "react";
import { useDocumentInfo, useField } from "@payloadcms/ui";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type Props = { data?: { id?: string | number; url?: string; mimeType?: string; alt?: string } };
type CanvasToast = {
  message: string;
  derivedId?: string | number;
  tone: "success" | "error";
};

export function ImageEditingCanvas({ data }: Props) {
  const { id, data: documentData } = useDocumentInfo();
  const media = data ?? (documentData as Props["data"] | undefined);
  const aspectRatioField = useField<string | undefined>({ path: "imagePresentation.aspectRatio" });
  const aspectRatio = aspectRatioField.value ?? "original";
  const [rotate, setRotate] = useState<0 | 90 | 180 | 270>(0);
  const [width, setWidth] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState<Crop>({ unit: "%", x: 0, y: 0, width: 100, height: 100 });
  const [focalPoint, setFocalPoint] = useState({ x: 50, y: 50 });
  const [draggingFocalPoint, setDraggingFocalPoint] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<CanvasToast | null>(null);
  const [previewUrl, setPreviewUrl] = useState(media?.url);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 7000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

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

  const updateFocalPointFromPointer = (clientX: number, clientY: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setFocalPoint({
      x: Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))),
      y: Math.round(Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))),
    });
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
    setCrop({ unit: "%", x: 0, y: 0, width: 100, height: 100 });
    setFocalPoint({ x: 50, y: 50 });
  }, [aspectRatio]);

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
      setCrop({ unit: "%", x: 0, y: 0, width: 100, height: 100 });
      setWidth(canvas.width);
      setHeight(canvas.height);
      setFocalPoint({ x: 50, y: 50 });
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
    if (!id || !crop.width || !crop.height) {
      setToast({ message: "Selecione uma área válida para editar a imagem.", tone: "error" });
      return;
    }
    setBusy(true);
    const nextAltText = (media?.alt ?? "").trim();
    const response = await fetch("/api/media/edit-canvas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalMediaId: String(id), rotate, resize: { width, height }, aspectRatio: aspectRatio === "original" ? undefined : aspectRatio, crop, focalPoint, altText: nextAltText }),
    });
    const result = (await response.json()) as { message?: string; doc?: { id?: string | number } };
    setToast(response.ok && result.doc?.id
      ? { message: "Imagem atualizada com sucesso.", derivedId: result.doc.id, tone: "success" }
      : { message: result.message ?? "Falha ao atualizar a imagem.", tone: "error" });
    setBusy(false);
  }

  return <section className="image-editing-canvas">
    <h2>Editar no Canvas</h2>
    {previewUrl && isMounted ? <div className="image-editing-canvas__stage" onPointerMove={(event) => {
      if (draggingFocalPoint) updateFocalPointFromPointer(event.clientX, event.clientY, event.currentTarget);
    }} onPointerUp={() => setDraggingFocalPoint(false)} onPointerLeave={() => setDraggingFocalPoint(false)}>
      <ReactCrop crop={crop} aspect={editAspectRatio} onChange={(_, percentCrop) => { setCrop(percentCrop); const dimensions = getCropPixelDimensions(percentCrop); setWidth(dimensions.width); setHeight(dimensions.height); }}>
        <img alt="Pré-visualização da imagem original" src={previewUrl} onClick={(event) => { event.stopPropagation(); updateFocalPointFromPointer(event.clientX, event.clientY, event.currentTarget); }} />
      </ReactCrop>
      <span className="image-editing-canvas__focal-point" role="button" tabIndex={0} aria-label={`Ponto focal: ${focalPoint.x}% horizontal, ${focalPoint.y}% vertical`} title="Arraste ou clique na imagem para mover o ponto focal" style={{ left: `${focalPoint.x}%`, top: `${focalPoint.y}%` }} onPointerDown={(event) => { event.preventDefault(); event.stopPropagation(); setDraggingFocalPoint(true); event.currentTarget.setPointerCapture(event.pointerId); }} onKeyDown={(event) => { const step = event.shiftKey ? 10 : 1; if (event.key === "ArrowLeft") setFocalPoint((point) => ({ ...point, x: Math.max(0, point.x - step) })); if (event.key === "ArrowRight") setFocalPoint((point) => ({ ...point, x: Math.min(100, point.x + step) })); if (event.key === "ArrowUp") setFocalPoint((point) => ({ ...point, y: Math.max(0, point.y - step) })); if (event.key === "ArrowDown") setFocalPoint((point) => ({ ...point, y: Math.min(100, point.y + step) })); }} />
    </div> : null}
    <div className="image-editing-canvas__toolbar">
      <label>Largura<input type="number" min={1} max={previewDimensions.width || undefined} value={width ?? ""} onChange={(event) => syncHeightFromWidth(event.target.value ? Number(event.target.value) : undefined)} /></label>
      <label>Altura<input type="number" min={1} max={previewDimensions.height || undefined} value={height ?? ""} onChange={(event) => syncWidthFromHeight(event.target.value ? Number(event.target.value) : undefined)} /></label>
      <div className="image-editing-canvas__rotation"><button type="button" onClick={() => setRotate((rotate + 270) % 360 as 0 | 90 | 180 | 270)} aria-label="Girar para a esquerda">↶</button><button type="button" onClick={() => setRotate((rotate + 90) % 360 as 0 | 90 | 180 | 270)} aria-label="Girar para a direita">↷</button></div>
      <button className="image-editing-canvas__save" type="button" onClick={saveCurrentAsset} disabled={busy}>{busy ? "Salvando..." : "Salvar imagem editada"}</button>
    </div>
    {toast ? <div className={`image-editing-canvas__toast image-editing-canvas__toast--${toast.tone}`} role={toast.tone === "error" ? "alert" : "status"}>
      <span>{toast.message}</span>
      {toast.derivedId ? <a href={`/admin/collections/media/${encodeURIComponent(String(toast.derivedId))}`}>Abrir mídia</a> : null}
      <button type="button" aria-label="Fechar aviso" onClick={() => setToast(null)}>×</button>
    </div> : null}
  </section>;
}
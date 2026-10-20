"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useField } from "@payloadcms/ui";
import ReactCrop, { centerCrop, makeAspectCrop, type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  DEFAULT_IMAGE_CANVAS,
  getCropCenter,
  normalizeImageCanvasValue,
  rotateImageCanvasValue,
  type ImageCanvasCrop,
  type ImageCanvasValue,
} from "../../domain/image-presentation";

type MediaData = {
  focalX?: number | null;
  focalY?: number | null;
  id?: number | string;
  mimeType?: string;
  url?: string;
};

type MediaValue = MediaData | number | string | null | undefined;

type ImageEditingCanvasProps = {
  mediaFieldName: string;
  path: string;
};

const aspectRatioValue = (value: string | null | undefined): number | undefined => {
  if (value === "1:1") return 1;
  if (value === "4:3") return 4 / 3;
  if (value === "16:9") return 16 / 9;
  if (value === "portrait") return 3 / 4;
  return undefined;
};

const cropsEqual = (left: ImageCanvasCrop, right: ImageCanvasCrop): boolean =>
  ["x", "y", "width", "height"].every((key) =>
    Math.abs(left[key as keyof ImageCanvasCrop] - right[key as keyof ImageCanvasCrop]) < 0.05,
  );

export function ImageEditingCanvas({ mediaFieldName, path }: ImageEditingCanvasProps) {
  const presentationPath = path.replace(/\.canvas$/, "");
  const parentPath = presentationPath.includes(".")
    ? presentationPath.slice(0, presentationPath.lastIndexOf("."))
    : "";
  const mediaPath = parentPath ? `${parentPath}.${mediaFieldName}` : mediaFieldName;
  const aspectPath = `${presentationPath}.aspectRatio`;
  const canvasField = useField<ImageCanvasValue | null>({ path });
  const mediaField = useField<MediaValue>({ path: mediaPath });
  const aspectField = useField<string | null>({ path: aspectPath });
  const selectedMedia = typeof mediaField.value === "object" && mediaField.value !== null
    ? mediaField.value
    : undefined;
  const selectedId = typeof mediaField.value === "string" || typeof mediaField.value === "number"
    ? mediaField.value
    : selectedMedia?.id;
  const [resolvedMedia, setResolvedMedia] = useState<MediaData>();
  const [preview, setPreview] = useState<{
    error?: string;
    height: number;
    key: string;
    url?: string;
    width: number;
  }>();
  const [draggingFocalPoint, setDraggingFocalPoint] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const justCroppedRef = useRef(false);
  const media = selectedMedia?.url
    ? selectedMedia
    : resolvedMedia?.id && String(resolvedMedia.id) === String(selectedId)
      ? resolvedMedia
      : undefined;
  const fallbackFocalPoint = useMemo(() => ({
    x: media?.focalX ?? 50,
    y: media?.focalY ?? 50,
  }), [media?.focalX, media?.focalY]);
  const canvas = normalizeImageCanvasValue(canvasField.value, fallbackFocalPoint);
  const crop: Crop = { unit: "%", ...canvas.crop };
  const cropAspect = aspectRatioValue(aspectField.value);
  const previewKey = media?.url ? `${media.url}:${canvas.rotation}` : undefined;
  const currentPreview = previewKey && preview?.key === previewKey ? preview : undefined;
  const previewDimensions = {
    height: currentPreview?.height ?? 0,
    width: currentPreview?.width ?? 0,
  };
  const previewError = currentPreview?.error;
  const previewUrl = currentPreview?.url;

  const setCanvas = (value: ImageCanvasValue) => {
    canvasField.setValue(normalizeImageCanvasValue(value, fallbackFocalPoint));
  };

  useEffect(() => {
    if (!selectedId || selectedMedia?.url) return;
    if (resolvedMedia?.id && String(resolvedMedia.id) === String(selectedId)) return;

    const controller = new AbortController();
    fetch(`/api/media/${encodeURIComponent(String(selectedId))}?depth=0`, {
      signal: controller.signal,
    })
      .then(async (response) => response.ok ? await response.json() as MediaData : undefined)
      .then((value) => {
        if (value) setResolvedMedia(value);
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [resolvedMedia?.id, selectedId, selectedMedia?.url]);

  useEffect(() => {
    if (!media?.url) return;

    let active = true;
    const key = `${media.url}:${canvas.rotation}`;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      if (!active) return;
      const quarterTurn = canvas.rotation === 90 || canvas.rotation === 270;
      const width = quarterTurn ? image.naturalHeight : image.naturalWidth;
      const height = quarterTurn ? image.naturalWidth : image.naturalHeight;
      const preview = document.createElement("canvas");
      preview.width = width;
      preview.height = height;
      const context = preview.getContext("2d");
      if (!context) return;
      context.translate(width / 2, height / 2);
      context.rotate((canvas.rotation * Math.PI) / 180);
      context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

      try {
        setPreview({ height, key, url: preview.toDataURL("image/png"), width });
      } catch {
        setPreview({
          error: "A origem da imagem nao permite gerar a pre-visualizacao girada.",
          height,
          key,
          url: media.url,
          width,
        });
      }
    };
    image.onerror = () => {
      if (active) {
        setPreview({
          error: "Nao foi possivel carregar a imagem para edicao visual.",
          height: 0,
          key,
          width: 0,
        });
      }
    };
    image.src = media.url;

    return () => {
      active = false;
    };
  }, [canvas.rotation, media?.url]);

  useEffect(() => {
    if (!cropAspect || !previewDimensions.width || !previewDimensions.height) return;
    const currentAspect = (
      canvas.crop.width * previewDimensions.width
    ) / (
      canvas.crop.height * previewDimensions.height
    );
    if (Math.abs(currentAspect - cropAspect) < 0.01) return;

    const nextCrop = centerCrop(
      makeAspectCrop(
        { unit: "%", width: Math.min(canvas.crop.width, 100) },
        cropAspect,
        previewDimensions.width,
        previewDimensions.height,
      ),
      previewDimensions.width,
      previewDimensions.height,
    );
    const normalized = normalizeImageCanvasValue({
      ...canvas,
      crop: nextCrop,
      focalPoint: getCropCenter(nextCrop as ImageCanvasCrop),
    }, fallbackFocalPoint);
    if (!cropsEqual(normalized.crop, canvas.crop)) canvasField.setValue(normalized);
  }, [
    canvas,
    canvasField,
    cropAspect,
    fallbackFocalPoint,
    previewDimensions.height,
    previewDimensions.width,
  ]);

  const updateFocalPointFromPointer = (clientX: number, clientY: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    setCanvas({
      ...canvas,
      focalPoint: {
        x: Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))),
        y: Math.round(Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))),
      },
    });
  };

  const resetCanvas = () => setCanvas({
    ...DEFAULT_IMAGE_CANVAS,
    focalPoint: fallbackFocalPoint,
  });

  if (media?.mimeType && !media.mimeType.startsWith("image/")) return null;

  return (
    <section className="image-editing-canvas">
      <h3>Editar apresentacao desta imagem</h3>
      <p className="image-editing-canvas__description">
        O corte, o foco e a rotacao valem somente para este bloco. O arquivo da biblioteca permanece intacto.
      </p>
      {!media ? (
        <p className="image-editing-canvas__empty">Selecione uma imagem para abrir o Canvas.</p>
      ) : null}
      {media && previewUrl ? (
        <div className="image-editing-canvas__stage">
          <div
            className="image-editing-canvas__frame"
            ref={frameRef}
            onPointerLeave={() => setDraggingFocalPoint(false)}
            onPointerMove={(event) => {
              if (draggingFocalPoint) updateFocalPointFromPointer(event.clientX, event.clientY);
            }}
            onPointerUp={() => setDraggingFocalPoint(false)}
          >
            <ReactCrop
              aspect={cropAspect}
              crop={crop}
              minHeight={5}
              minWidth={5}
              onChange={(_, percentCrop) => {
                const normalizedCrop = normalizeImageCanvasValue({
                  ...canvas,
                  crop: percentCrop,
                }, fallbackFocalPoint).crop;
                setCanvas({
                  ...canvas,
                  crop: normalizedCrop,
                  focalPoint: getCropCenter(normalizedCrop),
                });
              }}
              onDragEnd={() => {
                justCroppedRef.current = true;
                window.setTimeout(() => {
                  justCroppedRef.current = false;
                }, 0);
              }}
            >
              {/* The editor needs the browser's natural image dimensions and a data-URL canvas source. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Pre-visualizacao da apresentacao da imagem"
                src={previewUrl}
                onClick={(event) => {
                  if (justCroppedRef.current) return;
                  updateFocalPointFromPointer(event.clientX, event.clientY);
                }}
              />
            </ReactCrop>
            <span
              aria-label={`Ponto focal: ${Math.round(canvas.focalPoint.x)}% horizontal, ${Math.round(canvas.focalPoint.y)}% vertical`}
              className="image-editing-canvas__focal-point"
              role="button"
              style={{ left: `${canvas.focalPoint.x}%`, top: `${canvas.focalPoint.y}%` }}
              tabIndex={0}
              title="Arraste, clique ou use as setas para mover o ponto focal"
              onKeyDown={(event) => {
                const step = event.shiftKey ? 10 : 1;
                const next = { ...canvas.focalPoint };
                if (event.key === "ArrowLeft") next.x -= step;
                else if (event.key === "ArrowRight") next.x += step;
                else if (event.key === "ArrowUp") next.y -= step;
                else if (event.key === "ArrowDown") next.y += step;
                else return;
                event.preventDefault();
                setCanvas({ ...canvas, focalPoint: next });
              }}
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setDraggingFocalPoint(true);
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
            />
          </div>
        </div>
      ) : null}
      <div className="image-editing-canvas__toolbar">
        <button
          className="image-editing-canvas__center-focus"
          disabled={!media}
          type="button"
          onClick={() => setCanvas({ ...canvas, focalPoint: getCropCenter(canvas.crop) })}
        >
          Centralizar foco no corte
        </button>
        <div className="image-editing-canvas__rotation">
          <button
            aria-label="Girar para a esquerda"
            disabled={!media}
            type="button"
            onClick={() => setCanvas(rotateImageCanvasValue(canvas, "counterclockwise"))}
          >
            ↶
          </button>
          <button
            aria-label="Girar para a direita"
            disabled={!media}
            type="button"
            onClick={() => setCanvas(rotateImageCanvasValue(canvas, "clockwise"))}
          >
            ↷
          </button>
        </div>
        <button
          className="image-editing-canvas__center-focus"
          disabled={!media}
          type="button"
          onClick={resetCanvas}
        >
          Restaurar apresentacao
        </button>
      </div>
      {previewError ? <p className="image-editing-canvas__error" role="alert">{previewError}</p> : null}
      <p className="image-editing-canvas__status" role="status">
        Rotacao: {canvas.rotation}° · foco: {Math.round(canvas.focalPoint.x)}%, {Math.round(canvas.focalPoint.y)}%. Salve a pagina para persistir.
      </p>
    </section>
  );
}

import type { CSSProperties } from "react";
import {
  getImageCanvasZoom,
  normalizeImageCanvasValue,
} from "../../domain/image-presentation";
import type {
  ImagePresentationAspectRatio,
  ImagePresentationFit,
  ImagePresentationSize,
} from "../../fields/image-presentation";

export type ImagePresentation = {
  size?: ImagePresentationSize | null;
  aspectRatio?: ImagePresentationAspectRatio | null;
  canvas?: unknown;
  fit?: ImagePresentationFit | null;
} | null | undefined;

type ImagePresentationClassNameOptions = {
  sizeClassNames?: Partial<Record<ImagePresentationSize, string>>;
};

const SIZE_CLASSNAMES: Record<ImagePresentationSize, string> = {
  small: "w-full lg:max-w-xs lg:mx-auto",
  medium: "w-full lg:max-w-md lg:mx-auto",
  large: "w-full lg:max-w-2xl lg:mx-auto",
  full: "w-full",
};

const ASPECT_CLASSNAMES: Record<ImagePresentationAspectRatio, string> = {
  original: "",
  "1:1": "aspect-square",
  "4:3": "aspect-[4/3]",
  "16:9": "aspect-video",
  portrait: "aspect-[3/4]",
};

const FIT_CLASSNAMES: Record<ImagePresentationFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
};

export function getImagePresentationClassName(
  presentation: ImagePresentation,
  options?: ImagePresentationClassNameOptions,
): string {
  const aspectRatio = presentation?.aspectRatio ?? "16:9";
  const fit = aspectRatio === "original" ? null : presentation?.fit ?? "cover";

  return [
    getImagePresentationSizeClassName(presentation, options),
    ASPECT_CLASSNAMES[aspectRatio],
    fit ? FIT_CLASSNAMES[fit] : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function getImagePresentationSizeClassName(
  presentation: ImagePresentation,
  options?: ImagePresentationClassNameOptions,
): string {
  const size = presentation?.size ?? "full";
  const sizeClassNames = {
    ...SIZE_CLASSNAMES,
    ...options?.sizeClassNames,
  };
  return sizeClassNames[size];
}

export function getImagePresentationFitClassName(
  presentation: ImagePresentation,
): string {
  const aspectRatio = presentation?.aspectRatio ?? "16:9";
  if (aspectRatio === "original") return "";

  const fit = presentation?.fit ?? "cover";
  return FIT_CLASSNAMES[fit];
}

export function getFocalPointStyle(
  media: {
    focalX?: number | null;
    focalY?: number | null;
    height?: number | null;
    width?: number | null;
  } | null | undefined,
  presentation: ImagePresentation,
): CSSProperties {
  const aspectRatio = presentation?.aspectRatio ?? "16:9";
  const fit = aspectRatio === "original" ? null : presentation?.fit ?? "cover";
  const canvasValue = presentation?.canvas;

  if (canvasValue) {
    const canvas = normalizeImageCanvasValue(canvasValue, {
      x: media?.focalX ?? 50,
      y: media?.focalY ?? 50,
    });
    const zoom = getImageCanvasZoom(canvas);
    const frameAspectRatio = getImagePresentationAspectRatio(presentation, media);
    const rotationScale = canvas.rotation === 90 || canvas.rotation === 270
      ? Math.max(frameAspectRatio, 1 / frameAspectRatio)
      : 1;
    const scale = Math.min(6, zoom * rotationScale);

    return {
      objectPosition: `${canvas.focalPoint.x}% ${canvas.focalPoint.y}%`,
      transform: canvas.rotation || scale !== 1
        ? `rotate(${canvas.rotation}deg) scale(${scale})`
        : undefined,
      transformOrigin: `${canvas.focalPoint.x}% ${canvas.focalPoint.y}%`,
    };
  }

  if (fit !== "cover") return {};
  if (typeof media?.focalX !== "number" || typeof media?.focalY !== "number") {
    return {};
  }

  return { objectPosition: `${media.focalX}% ${media.focalY}%` };
}

export function getImagePresentationAspectRatio(
  presentation: ImagePresentation,
  media?: { height?: number | null; width?: number | null } | null,
): number {
  const aspectRatio = presentation?.aspectRatio ?? "16:9";
  if (aspectRatio === "1:1") return 1;
  if (aspectRatio === "4:3") return 4 / 3;
  if (aspectRatio === "16:9") return 16 / 9;
  if (aspectRatio === "portrait") return 3 / 4;

  const width = typeof media?.width === "number" && media.width > 0 ? media.width : 16;
  const height = typeof media?.height === "number" && media.height > 0 ? media.height : 9;
  const canvas = presentation?.canvas
    ? normalizeImageCanvasValue(presentation.canvas)
    : undefined;
  const mediaAspectRatio = canvas?.rotation === 90 || canvas?.rotation === 270
    ? height / width
    : width / height;

  return canvas
    ? mediaAspectRatio * (canvas.crop.width / canvas.crop.height)
    : mediaAspectRatio;
}

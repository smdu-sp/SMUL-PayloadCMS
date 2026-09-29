import path from "node:path";
import sharp from "sharp";

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: "px" | "%";
}

export interface ResizeDimensions {
  width?: number;
  height?: number;
}

export type RotationAngle = 0 | 90 | 180 | 270;

export interface FocalPointCoordinates {
  x: number;
  y: number;
}

export type AspectRatioPreset = "16:9" | "4:3" | "1:1" | "free";

export interface CanvasTransformPayload {
  originalMediaId: string;
  crop: CropArea;
  resize: ResizeDimensions;
  rotate: RotationAngle;
  focalPoint: FocalPointCoordinates;
  aspectRatio?: string;
  altText?: string;
}

export interface ImageTransformMetrics {
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface ProcessedImageTransform {
  buffer: Buffer;
  metrics: ImageTransformMetrics;
  focalPoint: FocalPointCoordinates;
}

export const MAX_IMAGE_DIMENSION = 4096;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export function normalizeAltText(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export function validateCanvasTransformPayload(
  payload: unknown,
): CanvasTransformPayload {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Payload do Canvas invalido.");
  }

  const value = payload as Record<string, unknown>;
  const crop = value.crop as Record<string, unknown> | undefined;
  const resize = value.resize as Record<string, unknown> | undefined;
  const focalPoint = value.focalPoint as Record<string, unknown> | undefined;
  const cropX = crop?.x;
  const cropY = crop?.y;
  const cropWidth = crop?.width;
  const cropHeight = crop?.height;
  const resizeWidth = resize?.width;
  const resizeHeight = resize?.height;
  const focalX = focalPoint?.x;
  const focalY = focalPoint?.y;
  const altText = typeof value.altText === "string" ? value.altText.trim() : "";
  if (
    typeof value.originalMediaId !== "string" ||
    !value.originalMediaId.trim() ||
    value.originalMediaId.length > 100 ||
    !crop ||
    !resize ||
    !focalPoint ||
    ![cropX, cropY, cropWidth, cropHeight].every(isFiniteNumber) ||
    ![focalX, focalY].every(isFiniteNumber) ||
    ![resizeWidth, resizeHeight].every((item) => item === undefined || isFiniteNumber(item)) ||
    ![0, 90, 180, 270].includes(value.rotate as number) ||
    !["px", "%"].includes(String(crop.unit)) ||
    !isFiniteNumber(cropX) || !isFiniteNumber(cropY) || !isFiniteNumber(cropWidth) || !isFiniteNumber(cropHeight) ||
    cropX < 0 || cropY < 0 || cropWidth <= 0 || cropHeight <= 0 ||
    (crop.unit === "%" && (cropX >= 100 || cropY >= 100 || cropWidth > 100 || cropHeight > 100)) ||
    (resizeWidth !== undefined && (!isFiniteNumber(resizeWidth) || resizeWidth <= 0 || resizeWidth > MAX_IMAGE_DIMENSION)) ||
    (resizeHeight !== undefined && (!isFiniteNumber(resizeHeight) || resizeHeight <= 0 || resizeHeight > MAX_IMAGE_DIMENSION)) ||
    !isFiniteNumber(focalX) || !isFiniteNumber(focalY) ||
    focalX < 0 || focalX > 100 || focalY < 0 || focalY > 100
  ) {
    throw new Error("Payload do Canvas invalido.");
  }

  return {
    originalMediaId: value.originalMediaId.trim(),
    crop: {
      x: cropX as number,
      y: cropY as number,
      width: cropWidth as number,
      height: cropHeight as number,
      unit: crop.unit as CropArea["unit"],
    },
    resize: {
      ...(resizeWidth === undefined ? {} : { width: resizeWidth as number }),
      ...(resizeHeight === undefined ? {} : { height: resizeHeight as number }),
    },
    rotate: value.rotate as RotationAngle,
    focalPoint: { x: focalX as number, y: focalY as number },
    ...(typeof value.aspectRatio === "string" ? { aspectRatio: value.aspectRatio.slice(0, 32) } : {}),
    altText: altText.slice(0, 500),
  };
}

export function cropToPixels(
  crop: CropArea,
  width: number,
  height: number,
): { left: number; top: number; width: number; height: number } {
  const toPixels = (value: number, total: number) =>
    crop.unit === "%" ? Math.floor((value / 100) * total) : Math.floor(value);
  const x = toPixels(crop.x, width);
  const y = toPixels(crop.y, height);
  const requestedWidth = toPixels(crop.width, width);
  const requestedHeight = toPixels(crop.height, height);
  if (x < 0 || y < 0 || x >= width || y >= height || requestedWidth < 1 || requestedHeight < 1) {
    throw new Error("Area de corte fora dos limites da imagem.");
  }
  return {
    left: x,
    top: y,
    width: Math.min(requestedWidth, width - x),
    height: Math.min(requestedHeight, height - y),
  };
}

export async function processImageTransform(
  inputBuffer: Buffer,
  payload: CanvasTransformPayload,
): Promise<ProcessedImageTransform> {
  const validatedPayload = validateCanvasTransformPayload(payload);
  const sourceImage = sharp(inputBuffer, {
    failOn: "error",
    limitInputPixels: MAX_IMAGE_DIMENSION * MAX_IMAGE_DIMENSION,
  });
  const sourceMetadata = await sourceImage.metadata();
  if (!sourceMetadata.width || !sourceMetadata.height) {
    throw new Error("Nao foi possivel obter as dimensoes da imagem.");
  }
  if (sourceMetadata.width > MAX_IMAGE_DIMENSION || sourceMetadata.height > MAX_IMAGE_DIMENSION) {
    throw new Error(`A imagem original nao pode exceder ${MAX_IMAGE_DIMENSION}px por lado.`);
  }
  const swapsDimensions = validatedPayload.rotate === 90 || validatedPayload.rotate === 270;
  const rotatedWidth = swapsDimensions ? sourceMetadata.height : sourceMetadata.width;
  const rotatedHeight = swapsDimensions ? sourceMetadata.width : sourceMetadata.height;
  const rotatedImage = sourceImage.rotate(validatedPayload.rotate);

  const pixelCrop = cropToPixels(validatedPayload.crop, rotatedWidth, rotatedHeight);
  const focalPixelX = (validatedPayload.focalPoint.x / 100) * rotatedWidth;
  const focalPixelY = (validatedPayload.focalPoint.y / 100) * rotatedHeight;
  const focalPoint = {
    x: Math.max(0, Math.min(100, ((focalPixelX - pixelCrop.left) / pixelCrop.width) * 100)),
    y: Math.max(0, Math.min(100, ((focalPixelY - pixelCrop.top) / pixelCrop.height) * 100)),
  };
  let image = rotatedImage.extract(pixelCrop);
  if (validatedPayload.resize.width || validatedPayload.resize.height) {
    image = image.resize({
      width: validatedPayload.resize.width,
      height: validatedPayload.resize.height,
    });
  }

  const result = await image.webp({ quality: 85 }).toBuffer({ resolveWithObject: true });
  return {
    buffer: result.data,
    focalPoint,
    metrics: {
      width: result.info.width,
      height: result.info.height,
      format: result.info.format,
      size: result.data.byteLength,
    },
  };
}

export function resolveMediaPath(filename: string): string {
  return path.resolve(process.cwd(), "media", path.basename(filename));
}
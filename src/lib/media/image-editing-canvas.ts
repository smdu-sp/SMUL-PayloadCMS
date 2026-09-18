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
}

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
  if (!payload || typeof payload !== "object") {
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
    (resizeWidth !== undefined && (!isFiniteNumber(resizeWidth) || resizeWidth <= 0)) ||
    (resizeHeight !== undefined && (!isFiniteNumber(resizeHeight) || resizeHeight <= 0)) ||
    !isFiniteNumber(focalX) || !isFiniteNumber(focalY) ||
    focalX < 0 || focalX > 100 || focalY < 0 || focalY > 100
  ) {
    throw new Error("Payload do Canvas invalido.");
  }

  return { ...value, altText } as unknown as CanvasTransformPayload;
}

export function cropToPixels(
  crop: CropArea,
  width: number,
  height: number,
): { left: number; top: number; width: number; height: number } {
  const toPixels = (value: number, total: number) =>
    crop.unit === "%" ? Math.round((value / 100) * total) : Math.round(value);
  const x = toPixels(crop.x, width);
  const y = toPixels(crop.y, height);
  const cropWidth = toPixels(crop.width, width);
  const cropHeight = toPixels(crop.height, height);
  if (x < 0 || y < 0 || cropWidth < 1 || cropHeight < 1 || x + cropWidth > width || y + cropHeight > height) {
    throw new Error("Area de corte fora dos limites da imagem.");
  }
  return { left: x, top: y, width: cropWidth, height: cropHeight };
}

export async function processImageTransform(
  inputBuffer: Buffer,
  payload: CanvasTransformPayload,
): Promise<ProcessedImageTransform> {
  const validatedPayload = validateCanvasTransformPayload(payload);
  const sourceImage = sharp(inputBuffer, { failOn: "error" });
  const sourceMetadata = await sourceImage.metadata();
  if (!sourceMetadata.width || !sourceMetadata.height) {
    throw new Error("Nao foi possivel obter as dimensoes da imagem.");
  }
  const swapsDimensions = validatedPayload.rotate === 90 || validatedPayload.rotate === 270;
  const rotatedWidth = swapsDimensions ? sourceMetadata.height : sourceMetadata.width;
  const rotatedHeight = swapsDimensions ? sourceMetadata.width : sourceMetadata.height;
  const rotatedImage = sourceImage.rotate(validatedPayload.rotate);

  let image = rotatedImage.extract(
    cropToPixels(validatedPayload.crop, rotatedWidth, rotatedHeight),
  );
  if (validatedPayload.resize.width || validatedPayload.resize.height) {
    image = image.resize({
      width: validatedPayload.resize.width,
      height: validatedPayload.resize.height,
    });
  }

  const result = await image.toBuffer({ resolveWithObject: true });
  return {
    buffer: result.data,
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
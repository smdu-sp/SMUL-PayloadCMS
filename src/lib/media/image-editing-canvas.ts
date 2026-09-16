import path from "node:path";
import sharp from "sharp";

export const imageCanvasRotations = [0, 90, 180, 270] as const;
export type ImageCanvasRotation = (typeof imageCanvasRotations)[number];

export type ImageCanvasCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ImageCanvasOperations = {
  crop?: ImageCanvasCrop;
  resize?: { width: number; height?: number };
  rotate?: ImageCanvasRotation;
  aspectRatio?: "original" | "1:1" | "4:3" | "16:9" | "portrait" | "free";
  focalPoint?: { x: number; y: number };
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export function validateImageCanvasOperations(
  operations: unknown,
): ImageCanvasOperations {
  if (!operations || typeof operations !== "object") {
    throw new Error("Operacoes do Canvas invalidas.");
  }

  const value = operations as Record<string, unknown>;
  const result: ImageCanvasOperations = {};
  if (value.rotate !== undefined) {
    if (!imageCanvasRotations.includes(value.rotate as ImageCanvasRotation)) {
      throw new Error("Rotacao invalida.");
    }
    result.rotate = value.rotate as ImageCanvasRotation;
  }
  if (value.crop !== undefined) {
    const crop = value.crop as Record<string, unknown>;
    if (![crop.x, crop.y, crop.width, crop.height].every(isFiniteNumber) ||
        crop.x < 0 || crop.y < 0 || crop.width <= 0 || crop.height <= 0) {
      throw new Error("Corte invalido.");
    }
    result.crop = crop as unknown as ImageCanvasCrop;
  }
  if (value.resize !== undefined) {
    const resize = value.resize as Record<string, unknown>;
    if (!isFiniteNumber(resize.width) || resize.width <= 0 || resize.width > 10000 ||
        (resize.height !== undefined && (!isFiniteNumber(resize.height) || resize.height <= 0))) {
      throw new Error("Redimensionamento invalido.");
    }
    result.resize = resize as unknown as { width: number; height?: number };
  }
  if (value.aspectRatio !== undefined &&
      !["original", "1:1", "4:3", "16:9", "portrait", "free"].includes(String(value.aspectRatio))) {
    throw new Error("Proporcao invalida.");
  }
  if (value.aspectRatio !== undefined) result.aspectRatio = value.aspectRatio as ImageCanvasOperations["aspectRatio"];
  if (value.focalPoint !== undefined) {
    const focal = value.focalPoint as Record<string, unknown>;
    if (![focal.x, focal.y].every(isFiniteNumber) || focal.x < 0 || focal.x > 100 || focal.y < 0 || focal.y > 100) {
      throw new Error("Ponto focal invalido.");
    }
    result.focalPoint = focal as unknown as { x: number; y: number };
  }
  return result;
}

export function applyImageCanvasOperations(
  sourcePath: string,
  operations: ImageCanvasOperations,
) {
  let image = sharp(sourcePath, { failOn: "error" });
  if (operations.crop) image = image.extract(operations.crop);
  if (operations.rotate) image = image.rotate(operations.rotate);
  if (operations.resize) image = image.resize(operations.resize.width, operations.resize.height);
  return image.webp({ quality: 88 }).toBuffer({ resolveWithObject: true });
}

export function resolveMediaPath(filename: string): string {
  return path.resolve(process.cwd(), "media", filename);
}
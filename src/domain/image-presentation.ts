export const IMAGE_CANVAS_ROTATIONS = [0, 90, 180, 270] as const;

export type ImageCanvasRotation = (typeof IMAGE_CANVAS_ROTATIONS)[number];

export type ImageCanvasCrop = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export type ImageCanvasFocalPoint = {
  x: number;
  y: number;
};

export type ImageCanvasValue = {
  crop: ImageCanvasCrop;
  focalPoint: ImageCanvasFocalPoint;
  rotation: ImageCanvasRotation;
};

export const DEFAULT_IMAGE_CANVAS: ImageCanvasValue = {
  crop: { x: 0, y: 0, width: 100, height: 100 },
  focalPoint: { x: 50, y: 50 },
  rotation: 0,
};

const MIN_CROP_PERCENT = 5;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const finiteNumber = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(Math.max(value, minimum), maximum);

export function normalizeImageCanvasValue(
  value: unknown,
  fallbackFocalPoint: ImageCanvasFocalPoint = DEFAULT_IMAGE_CANVAS.focalPoint,
): ImageCanvasValue {
  const record = isRecord(value) ? value : {};
  const cropValue = isRecord(record.crop) ? record.crop : {};
  const focalValue = isRecord(record.focalPoint) ? record.focalPoint : {};
  const rotationValue = finiteNumber(record.rotation, 0);
  const rotation = IMAGE_CANVAS_ROTATIONS.includes(rotationValue as ImageCanvasRotation)
    ? rotationValue as ImageCanvasRotation
    : 0;
  const x = clamp(finiteNumber(cropValue.x, 0), 0, 95);
  const y = clamp(finiteNumber(cropValue.y, 0), 0, 95);
  const width = clamp(finiteNumber(cropValue.width, 100), MIN_CROP_PERCENT, 100 - x);
  const height = clamp(finiteNumber(cropValue.height, 100), MIN_CROP_PERCENT, 100 - y);

  return {
    crop: { x, y, width, height },
    focalPoint: {
      x: clamp(finiteNumber(focalValue.x, fallbackFocalPoint.x), 0, 100),
      y: clamp(finiteNumber(focalValue.y, fallbackFocalPoint.y), 0, 100),
    },
    rotation,
  };
}

export function validateImageCanvasValue(value: unknown): true | string {
  if (value === null || value === undefined) return true;
  if (!isRecord(value) || !isRecord(value.crop) || !isRecord(value.focalPoint)) {
    return "A configuracao visual da imagem e invalida.";
  }

  const { crop, focalPoint } = normalizeImageCanvasValue(value);
  const rawCrop = value.crop;
  const rawFocalPoint = value.focalPoint;
  const numbers = [
    rawCrop.x,
    rawCrop.y,
    rawCrop.width,
    rawCrop.height,
    rawFocalPoint.x,
    rawFocalPoint.y,
  ];

  if (!numbers.every((item) => typeof item === "number" && Number.isFinite(item))) {
    return "A configuracao visual da imagem deve usar apenas numeros validos.";
  }
  if (!IMAGE_CANVAS_ROTATIONS.includes(value.rotation as ImageCanvasRotation)) {
    return "Escolha uma rotacao aprovada.";
  }
  if (
    crop.x !== rawCrop.x ||
    crop.y !== rawCrop.y ||
    crop.width !== rawCrop.width ||
    crop.height !== rawCrop.height
  ) {
    return "A area de corte deve permanecer dentro da imagem e ter ao menos 5% por lado.";
  }
  if (
    focalPoint.x !== rawFocalPoint.x ||
    focalPoint.y !== rawFocalPoint.y
  ) {
    return "O ponto focal deve permanecer entre 0 e 100%.";
  }

  return true;
}

export function getCropCenter(crop: ImageCanvasCrop): ImageCanvasFocalPoint {
  return {
    x: clamp(crop.x + crop.width / 2, 0, 100),
    y: clamp(crop.y + crop.height / 2, 0, 100),
  };
}

export function rotateImageCanvasValue(
  value: ImageCanvasValue,
  direction: "clockwise" | "counterclockwise",
): ImageCanvasValue {
  const clockwise = direction === "clockwise";
  const nextRotation = (
    value.rotation + (clockwise ? 90 : 270)
  ) % 360 as ImageCanvasRotation;
  const crop = clockwise
    ? {
        x: 100 - value.crop.y - value.crop.height,
        y: value.crop.x,
        width: value.crop.height,
        height: value.crop.width,
      }
    : {
        x: value.crop.y,
        y: 100 - value.crop.x - value.crop.width,
        width: value.crop.height,
        height: value.crop.width,
      };
  const focalPoint = clockwise
    ? { x: 100 - value.focalPoint.y, y: value.focalPoint.x }
    : { x: value.focalPoint.y, y: 100 - value.focalPoint.x };

  return normalizeImageCanvasValue({ crop, focalPoint, rotation: nextRotation });
}

export function getImageCanvasZoom(value: ImageCanvasValue): number {
  return Math.max(1, Math.min(4, 100 / Math.max(value.crop.width, value.crop.height)));
}

import type { TextFieldValidation } from "payload";

const hexColorPattern = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && hexColorPattern.test(value.trim());
}

export function normalizeHexColor(value: unknown): string | null {
  if (!isHexColor(value)) {
    return null;
  }

  return value.trim().toLowerCase();
}

export const validateOptionalHexColor = ((value) => {
  if (!value) {
    return true;
  }

  return isHexColor(value)
    ? true
    : "Informe uma cor hexadecimal valida, como #007a73.";
}) satisfies TextFieldValidation;

function expandHexColor(hex: string): string {
  const normalized = normalizeHexColor(hex);
  if (!normalized) return "";

  if (normalized.length === 4) {
    return `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
  }

  return normalized;
}

function channelToLinear(value: number): number {
  const channel = value / 255;
  return channel <= 0.03928
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

export function getRelativeLuminance(hex: string): number | null {
  const expanded = expandHexColor(hex);
  if (!expanded) return null;

  const red = Number.parseInt(expanded.slice(1, 3), 16);
  const green = Number.parseInt(expanded.slice(3, 5), 16);
  const blue = Number.parseInt(expanded.slice(5, 7), 16);

  return (
    0.2126 * channelToLinear(red) +
    0.7152 * channelToLinear(green) +
    0.0722 * channelToLinear(blue)
  );
}

export function getContrastRatio(foreground: string, background: string): number | null {
  const foregroundLuminance = getRelativeLuminance(foreground);
  const backgroundLuminance = getRelativeLuminance(background);

  if (foregroundLuminance === null || backgroundLuminance === null) return null;

  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

export function hasMinimumContrast(
  foreground: string,
  background: string,
  minimumRatio = 4.5,
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio !== null && ratio >= minimumRatio;
}

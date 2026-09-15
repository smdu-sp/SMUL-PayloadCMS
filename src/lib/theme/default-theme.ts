import { normalizeHexColor } from "./colors";

/** SMUL defaults. Keep the CSS fallback in styles/tokens.css aligned. */
export const DEFAULT_THEME = Object.freeze({
  primaryColor: "#0a3299",
  secondaryColor: "#0a3299",
  accentColor: "#5cd6c9",
});

export type ThemeColors = Record<keyof typeof DEFAULT_THEME, string>;

export function resolveThemeColors(
  overrides?: Partial<Record<keyof ThemeColors, unknown>> | null,
): ThemeColors {
  return {
    primaryColor: normalizeHexColor(overrides?.primaryColor) ?? DEFAULT_THEME.primaryColor,
    secondaryColor: normalizeHexColor(overrides?.secondaryColor) ?? DEFAULT_THEME.secondaryColor,
    accentColor: normalizeHexColor(overrides?.accentColor) ?? DEFAULT_THEME.accentColor,
  };
}

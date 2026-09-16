import { normalizeHexColor } from "./colors";

/** SMUL defaults. Keep the CSS fallback in styles/tokens.css aligned. */
export const DEFAULT_THEME = Object.freeze({
  backgroundColor: "#ffffff",
  paragraphColor: "#1e293b",
  primaryColor: "#0a3299",
  secondaryColor: "#0a3299",
  accentColor: "#5cd6c9",
  headlineColor: "#0a3299",
  buttonColor: "#0a3299",
  buttonTextColor: "#ffffff",
  strokeColor: "#000000",
  mainColor: "#ffffff",
  secondaryIllustrationColor: "#0a3299",
  tertiaryColor: "#f94668",
  actionColor: "#0a3299",
  actionForegroundColor: "#ffffff",
  linkColor: "#0a3299",
  highlightColor: "#5cd6c9",
  secondaryAccentColor: "#0a3299",
  tertiaryAccentColor: "#f94668",
});

export type ThemeColors = Record<keyof typeof DEFAULT_THEME, string>;

export function resolveThemeColors(
  overrides?: Partial<Record<keyof ThemeColors, unknown>> | null,
): ThemeColors {
  const buttonColor =
    normalizeHexColor(overrides?.buttonColor) ?? DEFAULT_THEME.buttonColor;
  const buttonTextColor =
    normalizeHexColor(overrides?.buttonTextColor) ?? DEFAULT_THEME.buttonTextColor;
  const headlineColor =
    normalizeHexColor(overrides?.headlineColor) ?? DEFAULT_THEME.headlineColor;
  const highlightColor =
    normalizeHexColor(overrides?.highlightColor) ?? DEFAULT_THEME.highlightColor;
  const secondaryIllustrationColor =
    normalizeHexColor(overrides?.secondaryIllustrationColor) ??
    DEFAULT_THEME.secondaryIllustrationColor;
  const tertiaryColor =
    normalizeHexColor(overrides?.tertiaryColor) ?? DEFAULT_THEME.tertiaryColor;

  return {
    backgroundColor:
      normalizeHexColor(overrides?.backgroundColor) ?? DEFAULT_THEME.backgroundColor,
    paragraphColor:
      normalizeHexColor(overrides?.paragraphColor) ?? DEFAULT_THEME.paragraphColor,
    // Legacy aliases are derived from the visible Happy Hues fields. Persisted
    // values from the previous model must not override the current palette.
    primaryColor: buttonColor,
    secondaryColor: secondaryIllustrationColor,
    accentColor: highlightColor,
    buttonColor,
    buttonTextColor,
    strokeColor: normalizeHexColor(overrides?.strokeColor) ?? DEFAULT_THEME.strokeColor,
    mainColor: normalizeHexColor(overrides?.mainColor) ?? DEFAULT_THEME.mainColor,
    secondaryIllustrationColor,
    tertiaryColor,
    actionForegroundColor: buttonTextColor,
    tertiaryAccentColor: tertiaryColor,
    headlineColor,
    actionColor: buttonColor,
    linkColor: buttonColor,
    highlightColor,
    secondaryAccentColor: secondaryIllustrationColor,
  };
}

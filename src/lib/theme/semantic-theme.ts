import { getContrastRatio, hasMinimumContrast, normalizeHexColor } from "./colors";
import { DEFAULT_PALETTE, NEUTRAL_COLORS, SYSTEM_COLORS } from "./default-theme";

export type MinimalBasePalette = { [K in keyof typeof DEFAULT_PALETTE]: string };
export type PaletteInput = Partial<Record<keyof MinimalBasePalette, unknown>>;
export type GlobalSemanticTheme = MinimalBasePalette & {
  heading: string;
  surface: string;
  surfaceForeground: string;
  muted: string;
  mutedForeground: string;
  brandForeground: string;
  actionForeground: string;
  accentForeground: string;
  border: string;
} & { [K in keyof typeof SYSTEM_COLORS]: string };

/** A two-candidate contrast choice, not a palette generation algorithm. */
export function contrastingForeground(background: string): string {
  const light = getContrastRatio(NEUTRAL_COLORS.light, background) ?? 0;
  const dark = getContrastRatio(NEUTRAL_COLORS.dark, background) ?? 0;
  return light >= dark ? NEUTRAL_COLORS.light : NEUTRAL_COLORS.dark;
}

/** Media scrims are neutral and independent of editorial branding. */
export function resolveMediaTheme(mode: "dark" | "light"): GlobalSemanticTheme {
  const background = mode === "dark" ? NEUTRAL_COLORS.dark : NEUTRAL_COLORS.light;
  const foreground = mode === "dark" ? NEUTRAL_COLORS.light : NEUTRAL_COLORS.dark;
  return resolveSemanticTheme({ background, foreground, action: foreground, accent: foreground });
}

export function resolveBasePalette(input?: PaletteInput | null): MinimalBasePalette {
  return Object.fromEntries(
    Object.entries(DEFAULT_PALETTE).map(([key, fallback]) => [
      key, normalizeHexColor(input?.[key as keyof MinimalBasePalette]) ?? fallback,
    ]),
  ) as MinimalBasePalette;
}

export function validateBasePalette(input?: PaletteInput | null): true | string {
  for (const key of Object.keys(DEFAULT_PALETTE) as (keyof MinimalBasePalette)[]) {
    const value = input?.[key];
    if (value != null && value !== "" && !normalizeHexColor(value)) {
      return "Informe cores hexadecimais validas.";
    }
  }
  const palette = resolveBasePalette(input);
  return hasMinimumContrast(palette.foreground, palette.background)
    ? true
    : "Texto e fundo precisam atingir contraste minimo de 4.5:1.";
}

export function resolveSemanticTheme(
  input?: PaletteInput | null,
  overrides?: Partial<Pick<GlobalSemanticTheme, "heading">>,
): GlobalSemanticTheme {
  const palette = resolveBasePalette(input);
  // Protect presentation even when invalid input bypasses editorial validation.
  const foreground = hasMinimumContrast(palette.foreground, palette.background)
    ? palette.foreground : contrastingForeground(palette.background);
  const heading = normalizeHexColor(overrides?.heading);
  return {
    ...palette,
    foreground,
    heading: heading && hasMinimumContrast(heading, palette.background) ? heading : foreground,
    surface: NEUTRAL_COLORS.surface,
    surfaceForeground: NEUTRAL_COLORS.surfaceForeground,
    muted: NEUTRAL_COLORS.muted,
    mutedForeground: NEUTRAL_COLORS.mutedForeground,
    brandForeground: contrastingForeground(palette.brand),
    actionForeground: contrastingForeground(palette.action),
    accentForeground: contrastingForeground(palette.accent),
    border: NEUTRAL_COLORS.border,
    ...SYSTEM_COLORS,
  };
}

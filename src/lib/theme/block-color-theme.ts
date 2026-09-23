import { getContrastRatio, hasMinimumContrast, normalizeHexColor } from "./colors";
import {
  contrastingForeground,
  resolveNestedSemanticTheme,
  type BlockPaletteOverrides,
  type GlobalSemanticTheme,
} from "./semantic-theme";

export const colorSchemes = ["default", "surface", "muted", "brand", "accent", "inverse"] as const;
export type ColorScheme = (typeof colorSchemes)[number];
export type BlockColorTheme = {
  background: string;
  foreground: string;
  heading: string;
  action: string;
  actionForeground: string;
  accent: string;
  border: string;
};
export type BlockColorThemeOverrides = Partial<Record<keyof BlockColorTheme, string | null>>;
/** The editor can override semantic palette roles, never individual component colors. */
export type EditorialColorOverrides = BlockPaletteOverrides;
export type BlockContrastToken = "foreground" | "action" | "accent";
export type BlockContrastCheck = {
  effective: string;
  minimum: number;
  passes: boolean;
  ratio: number;
  requested: string;
  token: BlockContrastToken;
};

export function normalizeColorScheme(value: unknown, fallback: ColorScheme = "default"): ColorScheme {
  return colorSchemes.includes(value as ColorScheme) ? value as ColorScheme : fallback;
}

function normalizeOverrides(input?: BlockColorThemeOverrides | null): BlockColorThemeOverrides {
  const result: BlockColorThemeOverrides = {};
  for (const key of ["background", "foreground", "heading", "action", "actionForeground", "accent"] as const) {
    const value = normalizeHexColor(input?.[key]);
    if (value) result[key] = value;
  }
  return result;
}

export function resolveBlockColorTheme(
  theme: GlobalSemanticTheme,
  scheme: ColorScheme = "default",
  input?: BlockColorThemeOverrides | null,
): BlockColorTheme {
  const pairs: Record<ColorScheme, [string, string]> = {
    default: [theme.background, theme.foreground],
    surface: [theme.surface, theme.surfaceForeground],
    muted: [theme.muted, theme.mutedForeground],
    brand: [theme.brand, theme.brandForeground],
    accent: [theme.accent, theme.accentForeground],
    inverse: [theme.foreground, theme.background],
  };
  const [schemeBackground, schemeForeground] = pairs[normalizeColorScheme(scheme)];
  const overrides = normalizeOverrides(input);
  const background = overrides.background ?? schemeBackground;
  const requestedForeground = overrides.foreground ?? (
    overrides.background ? contrastingForeground(background) : schemeForeground
  );
  const foreground = hasMinimumContrast(requestedForeground, background)
    ? requestedForeground : contrastingForeground(background);
  const requestedHeading = overrides.heading ?? (scheme === "default" && !overrides.background && !overrides.foreground
    ? theme.heading : foreground);
  const requestedAction = overrides.action ?? theme.action;
  // A filled control must be distinguishable from its surrounding surface too.
  const action = hasMinimumContrast(requestedAction, background, 3)
    ? requestedAction : foreground;
  const requestedActionForeground = overrides.actionForeground ?? (
    action === theme.action ? theme.actionForeground : contrastingForeground(action)
  );
  const requestedAccent = overrides.accent ?? theme.accent;
  const requestedBorder = theme.border;
  return {
    background,
    foreground,
    heading: hasMinimumContrast(requestedHeading, background) ? requestedHeading : foreground,
    action,
    actionForeground: hasMinimumContrast(requestedActionForeground, action)
      ? requestedActionForeground : contrastingForeground(action),
    // Accent is also used for small text; it must be readable, not merely decorative.
    accent: hasMinimumContrast(requestedAccent, background) ? requestedAccent : foreground,
    border: hasMinimumContrast(requestedBorder, background, 1.5) ? requestedBorder : foreground,
  };
}

/** Shared by the CMS warning and tests so their contrast verdict matches the renderer. */
export function analyzeCustomBlockPalette(
  parentTheme: GlobalSemanticTheme,
  input?: EditorialColorOverrides | null,
): { background: string; checks: BlockContrastCheck[]; resolved: BlockColorTheme } {
  const background = normalizeHexColor(input?.background) ?? parentTheme.background;
  const requested = {
    foreground: normalizeHexColor(input?.foreground) ?? parentTheme.foreground,
    action: normalizeHexColor(input?.action) ?? parentTheme.action,
    accent: normalizeHexColor(input?.accent) ?? parentTheme.accent,
  } satisfies Record<BlockContrastToken, string>;
  const nestedTheme = resolveNestedSemanticTheme(parentTheme, input);
  const resolved = resolveBlockColorTheme(nestedTheme);
  const minimums = { foreground: 4.5, action: 3, accent: 4.5 } satisfies Record<BlockContrastToken, number>;
  const checks = (Object.keys(minimums) as BlockContrastToken[]).map((token) => {
    const ratio = getContrastRatio(requested[token], background) ?? 0;
    return {
      token,
      requested: requested[token],
      effective: resolved[token],
      ratio,
      minimum: minimums[token],
      passes: ratio >= minimums[token],
    };
  });

  return { background, checks, resolved };
}

/**
 * Bloqueia no CMS valores malformados ou sem contraste suficiente. Esta e a
 * camada de feedback editorial; resolveBlockColorTheme() repete a protecao no
 * renderer e substitui valores inseguros caso a validacao seja contornada por
 * draft, API, importacao ou documento legado.
 */
export function validateColorOverrides(
  theme: GlobalSemanticTheme,
  scheme: ColorScheme,
  input?: EditorialColorOverrides | null,
): true | string {
  for (const key of ["background", "foreground", "brand", "action", "accent"] as const) {
    const value = input?.[key];
    if (value != null && value !== "" && !normalizeHexColor(value)) {
      return "Informe cores hexadecimais validas.";
    }
  }
  const background = normalizeHexColor(input?.background) ?? resolveBlockColorTheme(theme, scheme).background;
  for (const key of ["foreground", "accent"] as const) {
    const value = normalizeHexColor(input?.[key]);
    if (value && !hasMinimumContrast(value, background)) {
      return "Texto e destaque precisam atingir contraste minimo de 4.5:1 com o fundo efetivo.";
    }
  }
  return true;
}

export function mapBlockColorThemeToCssVariables(theme: BlockColorTheme) {
  return {
    "--block-background": theme.background,
    "--block-foreground": theme.foreground,
    "--block-heading": theme.heading,
    "--block-action": theme.action,
    "--block-action-foreground": theme.actionForeground,
    "--block-accent": theme.accent,
    "--block-border": theme.border,
  };
}

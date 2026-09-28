import {
  mapBlockColorThemeToCssVariables,
  resolveBlockColorTheme,
  type ColorScheme,
} from "./block-color-theme";
import { mapThemeToCssVariables, type ThemeCssVariables } from "./map-theme-to-css-variables";
import {
  resolveSemanticTheme,
  type GlobalSemanticTheme,
  type MinimalBasePalette,
} from "./semantic-theme";

export const ACCESSIBILITY_THEME_STORAGE_KEY =
  "meu-imovel-regular-accessibility-theme";

export const accessibilityThemeModes = [
  "default",
  "highContrast",
  "colorBlind",
] as const;

export type AccessibilityThemeMode = (typeof accessibilityThemeModes)[number];

/** Paletas institucionais aprovadas em docs/cms/paletas_de_cores_acessiveis.md. */
export const ACCESSIBLE_PALETTES = Object.freeze({
  light: {
    background: "#FFFFFF",
    foreground: "#0A3299",
    brand: "#517BEE",
    action: "#8800E0",
    accent: "#5CD6C9",
  },
  dark: {
    background: "#121212",
    foreground: "#D4DEFB",
    brand: "#A8BDF7",
    action: "#14B1F2",
    accent: "#2EED89",
  },
  highContrast: {
    background: "#000000",
    foreground: "#FFFFFF",
    brand: "#FFB000",
    action: "#00FFFF",
    accent: "#FF00FF",
  },
  colorBlind: {
    background: "#FFFFFF",
    foreground: "#212121",
    brand: "#0072B2",
    action: "#D55E00",
    accent: "#E69F00",
  },
} satisfies Record<string, MinimalBasePalette>);

export const accessibilityThemeOptions: ReadonlyArray<{
  label: string;
  value: AccessibilityThemeMode;
}> = [
  { label: "Padrão", value: "default" },
  { label: "Alto contraste", value: "highContrast" },
  { label: "Daltonismo", value: "colorBlind" },
];

export function normalizeAccessibilityThemeMode(
  value: unknown,
): AccessibilityThemeMode {
  return accessibilityThemeModes.includes(value as AccessibilityThemeMode)
    ? (value as AccessibilityThemeMode)
    : "default";
}

function createAccessibleSemanticTheme(
  mode: Exclude<AccessibilityThemeMode, "default">,
): GlobalSemanticTheme {
  const palette = ACCESSIBLE_PALETTES[mode];
  const base = resolveSemanticTheme(palette);

  if (mode === "highContrast") {
    return {
      ...base,
      heading: palette.foreground,
      surface: palette.background,
      surfaceForeground: palette.foreground,
      muted: palette.background,
      mutedForeground: palette.foreground,
      border: palette.foreground,
      focus: palette.action,
      info: palette.action,
      success: "#00FF66",
      warning: palette.brand,
      danger: "#FF6B6B",
    };
  }

  return {
    ...base,
    heading: palette.foreground,
    surface: "#FFFFFF",
    surfaceForeground: palette.foreground,
    muted: "#F2F2F2",
    mutedForeground: palette.foreground,
    border: "#595959",
    focus: "#0072B2",
    info: "#0072B2",
    success: "#007A5E",
    warning: "#9C6B00",
    danger: "#B44E00",
  };
}

export const ACCESSIBLE_SEMANTIC_THEMES = Object.freeze({
  highContrast: createAccessibleSemanticTheme("highContrast"),
  colorBlind: createAccessibleSemanticTheme("colorBlind"),
});

const lightElevations = {
  0: "#FFFFFF",
  50: "#F8FAFC",
  100: "#F1F5F9",
  150: "#E2E8F0",
  200: "#CBD5E1",
  250: "#94A3B8",
  300: "#64748B",
  400: "#475569",
  500: "#334155",
  600: "#1E293B",
  700: "#1E293B",
  800: "#1E293B",
  900: "#0F172A",
  1000: "#020617",
} as const;

const highContrastElevations = {
  0: "#000000",
  50: "#000000",
  100: "#0A0A0A",
  150: "#171717",
  200: "#FFFFFF",
  250: "#FFFFFF",
  300: "#FFFFFF",
  400: "#FFFFFF",
  500: "#FFFFFF",
  600: "#FFFFFF",
  700: "#FFFFFF",
  800: "#FFFFFF",
  900: "#FFFFFF",
  1000: "#FFFFFF",
} as const;

function mapAdminVariables(
  mode: Exclude<AccessibilityThemeMode, "default">,
  theme: GlobalSemanticTheme,
): ThemeCssVariables {
  const elevations = mode === "highContrast" ? highContrastElevations : lightElevations;
  const variables: ThemeCssVariables = {
    "--brand-primary": theme.brand,
    "--brand-secondary": theme.action,
    "--brand-accent": theme.accent,
    "--semantic-surface": theme.background,
    "--semantic-surface-muted": theme.muted,
    "--semantic-foreground": theme.foreground,
    "--semantic-muted": theme.mutedForeground,
    "--semantic-border": theme.border,
    "--state-success": theme.success,
    "--state-alert": theme.warning,
    "--state-error": theme.danger,
    "--theme-bg": theme.background,
    "--theme-text": theme.foreground,
    "--theme-error-400": theme.danger,
    "--theme-error-500": theme.danger,
    "--theme-success-400": theme.success,
    "--theme-success-500": theme.success,
    "--theme-warning-400": theme.warning,
    "--theme-warning-500": theme.warning,
    "--admin-brand-primary": theme.brand,
    "--admin-action-foreground": theme.actionForeground,
    "--admin-sidebar-bg": theme.background,
    "--admin-sidebar-border": theme.border,
    "--admin-nav-item-active-bg": theme.muted,
    "--admin-nav-item-active-color": theme.action,
    "--admin-card-bg": theme.surface,
    "--admin-card-border": theme.border,
    "--admin-input-bg": theme.surface,
    "--admin-input-border": theme.border,
  };

  Object.entries(elevations).forEach(([level, color]) => {
    variables[`--theme-elevation-${level}`] = color;
  });

  return variables;
}

function cssDeclarations(
  variables: Record<string, string>,
  important = false,
): string {
  return Object.entries(variables)
    .map(([name, value]) => `${name}:${value}${important ? " !important" : ""};`)
    .join("");
}

const accessibleBlockSchemes: ColorScheme[] = [
  "default",
  "surface",
  "muted",
  "brand",
  "accent",
  "inverse",
];

/** CSS global gerado dos mesmos tokens para vencer estilos editoriais inline. */
export function createAccessibilityThemeCss(): string {
  return (Object.entries(ACCESSIBLE_SEMANTIC_THEMES) as Array<
    [Exclude<AccessibilityThemeMode, "default">, GlobalSemanticTheme]
  >)
    .flatMap(([mode, theme]) => {
      const rootVariables = {
        ...mapThemeToCssVariables(theme),
        ...mapAdminVariables(mode, theme),
      };
      const root = `:root[data-accessibility-theme="${mode}"]{color-scheme:${
        mode === "highContrast" ? "dark" : "light"
      };${cssDeclarations(rootVariables, true)}}`;
      const blocks = accessibleBlockSchemes.map((scheme) => {
        const variables = mapBlockColorThemeToCssVariables(
          resolveBlockColorTheme(theme, scheme),
        );
        return `html[data-accessibility-theme="${mode}"] [data-color-scheme="${scheme}"]{${cssDeclarations(
          variables,
          true,
        )}}`;
      });

      return [root, ...blocks];
    })
    .concat([
      'html[data-accessibility-theme] .btn--style-primary{color:var(--admin-action-foreground) !important}',
    ])
    .join("\n");
}

export const ACCESSIBILITY_THEME_CSS = createAccessibilityThemeCss();

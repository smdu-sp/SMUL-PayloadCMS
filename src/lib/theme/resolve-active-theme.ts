import type { GoogleFontInput } from "./google-fonts.ts";
import type { PaletteInput } from "./semantic-theme.ts";

export type ThemeConfiguration = {
  colors?: PaletteInput | null;
  typography?: GoogleFontInput | null;
};

export type ThemeRelationship =
  | number
  | string
  | (ThemeConfiguration & { id?: number | string | null })
  | null;

export type ThemeSettingsInput = {
  activeTheme?: ThemeRelationship;
  theme?: ThemeConfiguration | null;
};

export type EffectiveThemeConfiguration = ThemeConfiguration & {
  source: "active" | "legacy" | "default";
};

function isPopulatedTheme(
  value: ThemeRelationship | undefined,
): value is ThemeConfiguration & { id?: number | string | null } {
  return typeof value === "object" && value !== null;
}

/**
 * Selects the populated active Theme while preserving the embedded SiteSettings
 * theme as a compatibility fallback for existing documents.
 */
export function resolveActiveThemeConfiguration(
  settings?: ThemeSettingsInput | null,
): EffectiveThemeConfiguration {
  if (isPopulatedTheme(settings?.activeTheme)) {
    return {
      colors: settings.activeTheme.colors,
      typography: settings.activeTheme.typography,
      source: "active",
    };
  }

  if (settings?.theme) {
    return {
      colors: settings.theme.colors,
      typography: settings.theme.typography,
      source: "legacy",
    };
  }

  return { source: "default" };
}

export function getRelationshipId(
  relationship: ThemeRelationship | undefined,
): number | string | null {
  if (typeof relationship === "number" || typeof relationship === "string") {
    return relationship;
  }

  return relationship?.id ?? null;
}

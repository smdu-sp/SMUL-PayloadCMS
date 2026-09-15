import type { SiteSetting } from "../../payload-types";
import { resolveThemeColors } from "./default-theme";

export type ThemeCssVariables = Record<`--${string}`, string>;

type ThemeSource = Pick<SiteSetting, "branding"> | null;

export function mapThemeToCssVariables(theme: ThemeSource): ThemeCssVariables {
  const { primaryColor: primary, secondaryColor: secondary, accentColor: accent } =
    resolveThemeColors(theme?.branding);
  return {
    "--color-primary": primary,
    "--color-brand": primary,
    "--color-link": primary,
    "--color-secondary": secondary,
    "--color-surface-strong": secondary,
    "--color-accent": accent,
    "--color-accent-soft": accent,
  };
}

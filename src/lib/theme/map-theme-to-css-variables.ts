import type { SiteSetting } from "../../payload-types";
import { resolveThemeColors } from "./default-theme";

export type ThemeCssVariables = Record<`--${string}`, string>;

type ThemeSource = Pick<SiteSetting, "branding"> | null;

export function mapThemeToCssVariables(theme: ThemeSource): ThemeCssVariables {
  const {
    accentColor: accent,
    actionColor: action,
    actionForegroundColor: actionForeground,
    backgroundColor: background,
    headlineColor: headline,
    highlightColor: highlight,
    linkColor: link,
    mainColor: illustrationMain,
    paragraphColor: paragraph,
    primaryColor: primary,
    secondaryAccentColor: secondaryAccent,
    secondaryColor: secondary,
    strokeColor: illustrationStroke,
    tertiaryAccentColor: tertiaryAccent,
  } = resolveThemeColors(theme?.branding);
  return {
    "--color-background": background,
    "--color-page": background,
    "--color-foreground": paragraph,
    "--color-text": paragraph,
    "--color-primary": primary,
    "--color-brand": primary,
    "--color-brand-hover": primary,
    "--color-action": action,
    "--color-action-hover": action,
    "--color-action-foreground": actionForeground,
    "--color-heading": headline,
    "--color-headline": headline,
    "--color-paragraph": paragraph,
    "--color-link": link,
    "--color-link-hover": link,
    "--color-secondary": secondary,
    "--color-surface-strong": secondary,
    "--color-secondary-accent": secondaryAccent,
    "--color-accent": accent,
    "--color-accent-soft": accent,
    "--color-highlight": highlight,
    "--color-highlight-foreground": "var(--color-accent-foreground)",
    "--color-tertiary-accent": tertiaryAccent,
    "--color-illustration-stroke": illustrationStroke,
    "--color-illustration-main": illustrationMain,
  };
}

import { mapBlockColorThemeToCssVariables, resolveBlockColorTheme } from "./block-color-theme";
import type { GlobalSemanticTheme } from "./semantic-theme";

export type ThemeCssVariables = Record<`--${string}`, string>;

/** Serialization only: all values have already been resolved and validated. */
export function mapThemeToCssVariables(theme: GlobalSemanticTheme): ThemeCssVariables {
  const colors = Object.fromEntries(Object.entries(theme).map(([key, value]) => [
    `--color-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, value,
  ]));
  return { ...colors, ...mapBlockColorThemeToCssVariables(resolveBlockColorTheme(theme)) };
}

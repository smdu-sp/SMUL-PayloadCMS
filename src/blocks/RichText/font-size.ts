export const richTextFontSizes = {
  small: {
    css: { "font-size": "0.875rem" },
    label: "Pequeno (14 px)",
  },
  medium: {
    css: { "font-size": "1.125rem" },
    label: "Médio (18 px)",
  },
  large: {
    css: { "font-size": "1.375rem" },
    label: "Grande (22 px)",
  },
  display: {
    css: { "font-size": "1.75rem" },
    label: "Destaque (28 px)",
  },
  displayLarge: {
    css: { "font-size": "2rem" },
    label: "Destaque grande (32 px)",
  },
} as const;

export type RichTextFontSize = keyof typeof richTextFontSizes;

export function getRichTextFontSize(value: unknown): string | undefined {
  if (typeof value !== "string" || !(value in richTextFontSizes)) return;

  return richTextFontSizes[value as RichTextFontSize].css["font-size"];
}

/** Readable semantic colors are resolved by the surrounding Block theme. */
export const richTextTextColors = {
  foreground: {
    css: { color: "var(--block-foreground, #1e293b)" },
    label: "Texto do bloco",
  },
  heading: {
    css: { color: "var(--block-heading, #1e293b)" },
    label: "Cor de titulo",
  },
  accent: {
    css: { color: "var(--block-accent, #0f766e)" },
    label: "Destaque",
  },
} as const;

export type RichTextTextColor = keyof typeof richTextTextColors;

export function getRichTextTextColor(value: unknown): string | undefined {
  return typeof value === "string" && value in richTextTextColors
    ? richTextTextColors[value as RichTextTextColor].css.color
    : undefined;
}

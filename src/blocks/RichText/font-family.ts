export const richTextFontFamilies = {
  roboto: {
    css: { "font-family": '"Roboto", Arial, sans-serif' },
    label: "Roboto",
  },
  montserrat: {
    css: { "font-family": '"Montserrat", Arial, sans-serif' },
    label: "Montserrat",
  },
  merriweather: {
    css: { "font-family": '"Merriweather", Georgia, serif' },
    label: "Merriweather",
  },
  notoSansTC: {
    css: { "font-family": '"Noto Sans TC", sans-serif' },
    label: "Noto Sans TC",
  },
} as const;

export type RichTextFontFamily = keyof typeof richTextFontFamilies;

const richTextFontStylesheets: Record<RichTextFontFamily, string> = {
  roboto:
    "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
  montserrat:
    "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap",
  merriweather:
    "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",
  notoSansTC:
    "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap",
};

export const allRichTextFontStylesheets = Object.values(richTextFontStylesheets);

function isRichTextFontFamily(value: unknown): value is RichTextFontFamily {
  return typeof value === "string" && value in richTextFontFamilies;
}

export function getRichTextFontFamily(value: unknown): string | undefined {
  if (!isRichTextFontFamily(value)) return;

  return richTextFontFamilies[value].css["font-family"];
}

export function getUsedRichTextFontStylesheets(content: unknown): string[] {
  const families = new Set<RichTextFontFamily>();

  const visit = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (!value || typeof value !== "object") return;

    const record = value as Record<string, unknown>;
    const state = record.$;
    if (state && typeof state === "object") {
      const family = (state as Record<string, unknown>).fontFamily;
      if (isRichTextFontFamily(family)) families.add(family);
    }

    Object.values(record).forEach(visit);
  };

  visit(content);

  return [...families].map((family) => richTextFontStylesheets[family]);
}

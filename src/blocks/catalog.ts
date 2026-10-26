// Editorial order is kept here so the CMS and the renderer share one contract.
export const pageBlockSlugs = [
  "hero",
  "richText",
  "imageBlock",
  "gallery",
  "carousel",
  "videoBlock",
  "imageText",
  "cards",
  "cta",
  "iconGrid",
  "faqAccordion",
  "alertBox",
  "actionBanners",
  "fullWidthImageBanner",
] as const;

export type PageBlockSlug = (typeof pageBlockSlugs)[number];

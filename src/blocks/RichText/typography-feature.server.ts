import { createServerFeature } from "@payloadcms/richtext-lexical";

export const RichTextTypographyFeature = createServerFeature({
  key: "richTextTypography",
  feature: {
    ClientFeature:
      "/blocks/RichText/typography-feature.client#RichTextTypographyFeatureClient",
  },
});

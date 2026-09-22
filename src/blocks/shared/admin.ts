import type { Block } from "payload";

export const blockSummaryLabel =
  "/components/admin/BlockSummaryLabel#BlockSummaryLabel";

type BlockPreview = {
  alt: string;
  slug: string;
};

export function createBlockAdmin(
  group: "Conteúdo" | "Mídia" | "Ações",
  preview: BlockPreview,
): NonNullable<Block["admin"]> {
  return {
    group,
    images: {
      thumbnail: {
        alt: preview.alt,
        url: `/block-previews/${preview.slug}.svg`,
      },
    },
    components: {
      Label: blockSummaryLabel,
    },
  };
}

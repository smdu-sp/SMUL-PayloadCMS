import { Fragment, type ReactNode } from "react";
import type { Page } from "../../payload-types";
import type { PageBlockSlug } from "../../blocks/catalog";
import { ActionBannersBlock } from "../../blocks/ActionBanners/Component";
import { AlertBoxBlock } from "../../blocks/AlertBox/Component";
import { CardsBlock } from "../../blocks/Cards/Component";
import { CarouselBlock } from "../../blocks/Carousel/Component";
import { CTABlock } from "../../blocks/CTA/Component";
import { FAQAccordionBlock } from "../../blocks/FAQ/Component";
import { FullWidthImageBannerBlock } from "../../blocks/FullWidthImageBanner/Component";
import { GalleryBlock } from "../../blocks/Gallery/Component";
import { HeroBlock } from "../../blocks/Hero/Component";
import { IconGridBlock } from "../../blocks/IconGrid/Component";
import { ImageBlock } from "../../blocks/ImageBlock/Component";
import { ImageTextBlock } from "../../blocks/ImageText/Component";
import { RichTextBlock } from "../../blocks/RichText/Component";
import { VideoBlock } from "../../blocks/VideoBlock/Component";

type PageBlock = NonNullable<Page["layout"]>[number];
type RenderablePageBlock =
  | PageBlock
  | Parameters<typeof CarouselBlock>[0]
  | Parameters<typeof GalleryBlock>[0]
  | Parameters<typeof ImageBlock>[0]
  | Parameters<typeof FullWidthImageBannerBlock>[0]
  | Parameters<typeof VideoBlock>[0];

type BlockOf<K extends PageBlockSlug> = Extract<RenderablePageBlock, { blockType: K }>;

const blockRenderers = {
  hero: (block) => <HeroBlock {...block} />,
  richText: (block) => <RichTextBlock {...block} />,
  imageBlock: (block) => <ImageBlock {...block} />,
  gallery: (block) => <GalleryBlock {...block} />,
  carousel: (block) => <CarouselBlock {...block} />,
  videoBlock: (block) => <VideoBlock {...block} />,
  imageText: (block) => <ImageTextBlock {...block} />,
  cards: (block) => <CardsBlock {...block} />,
  cta: (block) => <CTABlock {...block} />,
  iconGrid: (block) => <IconGridBlock {...block} />,
  faqAccordion: (block) => <FAQAccordionBlock {...block} />,
  alertBox: (block) => <AlertBoxBlock {...block} />,
  actionBanners: (block) => <ActionBannersBlock {...block} />,
  fullWidthImageBanner: (block) => <FullWidthImageBannerBlock {...block} />,
} satisfies { [K in PageBlockSlug]: (block: BlockOf<K>) => ReactNode };

export function RenderBlocks({ blocks }: { blocks?: Page["layout"] | null }) {
  if (!blocks?.length) return null;

  return (blocks as RenderablePageBlock[]).map((block, index) => {
    const key = block.id || `${block.blockType}-${index}`;
    // The mapped type checks each handler; this cast restores the correlation
    // between a union member and its handler after the dynamic lookup.
    const render = blockRenderers[block.blockType];
    if (!render) return null;
    return <Fragment key={key}>{render(block as never)}</Fragment>;
  });
}

export type { PageBlock };


import type { Page } from "../../payload-types";
import { ActionBannersBlock } from "../../blocks/ActionBanners/Component";
import { AlertBoxBlock } from "../../blocks/AlertBox/Component";
import { CardsBlock } from "../../blocks/Cards/Component";
import { CTABlock } from "../../blocks/CTA/Component";
import { FAQAccordionBlock } from "../../blocks/FAQ/Component";
import { FullWidthImageBannerBlock } from "../../blocks/FullWidthImageBanner/Component";
import { HeroBlock } from "../../blocks/Hero/Component";
import { IconGridBlock } from "../../blocks/IconGrid/Component";
import { ImageTextBlock } from "../../blocks/ImageText/Component";
import { RichTextBlock } from "../../blocks/RichText/Component";

type PageBlock = NonNullable<Page["layout"]>[number];
type RenderablePageBlock =
  | PageBlock
  | Parameters<typeof FullWidthImageBannerBlock>[0];

export function RenderBlocks({ blocks }: { blocks?: Page["layout"] | null }) {
  if (!blocks?.length) return null;

  return (blocks as RenderablePageBlock[]).map((block, index) => {
    const key = block.id || `${block.blockType}-${index}`;

    switch (block.blockType) {
      case "hero":
        return <HeroBlock {...block} key={key} />;
      case "richText":
        return <RichTextBlock {...block} key={key} />;
      case "imageText":
        return <ImageTextBlock {...block} key={key} />;
      case "cards":
        return <CardsBlock {...block} key={key} />;
      case "cta":
        return <CTABlock {...block} key={key} />;
      case "iconGrid":
        return <IconGridBlock {...block} key={key} />;
      case "faqAccordion":
        return <FAQAccordionBlock {...block} key={key} />;
      case "alertBox":
        return <AlertBoxBlock {...block} key={key} />;
      case "actionBanners":
        return <ActionBannersBlock {...block} key={key} />;
      case "fullWidthImageBanner":
        return <FullWidthImageBannerBlock {...block} key={key} />;
      default:
        return null;
    }
  });
}

export type { PageBlock };


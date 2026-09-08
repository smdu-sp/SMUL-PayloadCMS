import { RichText } from "@payloadcms/richtext-lexical/react";
import type { ImageTextBlock as ImageTextBlockProps } from "../../payload-types";
import { Container, Heading, Section } from "../../components/ui";
import {
  getFocalPointStyle,
  getImagePresentationClassName,
} from "../shared/image-presentation";
import { MediaImage } from "../shared/MediaImage";
import { BlockLink } from "../shared/BlockLink";

type ImageTextVariant = "image-left" | "image-right";

type ImageTextBlockWithLegacyProps = ImageTextBlockProps & {
  imagePosition?: "left" | "right" | string | null;
};

export function normalizeImageTextVariant(
  variant: ImageTextBlockProps["variant"] | "left" | "right" | string | null | undefined,
): ImageTextVariant {
  if (variant === "image-right" || variant === "right") return "image-right";
  return "image-left";
}

export function ImageTextBlock({
  content,
  cta,
  image,
  imagePosition,
  imagePresentation,
  variant,
  title,
}: ImageTextBlockWithLegacyProps) {
  const normalizedVariant = normalizeImageTextVariant(variant ?? imagePosition);
  const imageOnRight = normalizedVariant === "image-right";

  return (
    <Section spacing="md" tone="default">
      <Container size="lg">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <MediaImage
            className={`h-auto rounded-xl border border-border ${getImagePresentationClassName(imagePresentation)} ${imageOnRight ? "lg:order-2" : ""}`}
            media={image}
            sizes="(min-width: 1024px) 50vw, 100vw"
            style={getFocalPointStyle(
              typeof image === "object" ? image : null,
              imagePresentation,
            )}
          />
          <div className="max-w-container-sm">
            <Heading level={2} size="lg">
              <span className="text-balance break-words">{title}</span>
            </Heading>
            <RichText
              className="cms-rich-text mt-5 leading-relaxed"
              data={content}
            />
            {cta?.label ? (
              <div className="mt-6">
                <BlockLink link={cta} />
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}

import { RichText } from "@payloadcms/richtext-lexical/react";
import type { ImageTextBlock as ImageTextBlockProps } from "../../payload-types";
import type { ImagePresentationSize } from "../../fields/image-presentation";
import { BlockThemeScope, Container, Heading, Section } from "../../components/ui";
import type { EditorialColorOverrides } from "../../lib/theme/block-color-theme";
import type { ImagePresentation } from "../shared/image-presentation";
import { PresentedMediaImage } from "../shared/PresentedMediaImage";
import { BlockLink } from "../shared/BlockLink";

type ImageTextVariant = "image-left" | "image-right";

type ImageTextAppearance = {
  colors?: EditorialColorOverrides | null;
  spacing?: "compact" | "default" | "spacious" | string | null;
  scheme?: "custom" | "default" | "muted" | "surface" | string | null;
};

type ImageTextBlockWithLegacyProps = ImageTextBlockProps & {
  appearance?: ImageTextAppearance | null;
  imagePosition?: "left" | "right" | string | null;
};

const imageSizeClasses: Record<ImagePresentationSize, string> = {
  small: "w-full sm:w-1/2 sm:mx-auto",
  medium: "w-full sm:w-2/3 sm:mx-auto",
  large: "w-full sm:w-5/6 sm:mx-auto",
  full: "w-full",
};

export function normalizeImageTextVariant(
  variant: ImageTextBlockProps["variant"] | "left" | "right" | string | null | undefined,
): ImageTextVariant {
  if (variant === "image-right" || variant === "right") return "image-right";
  return "image-left";
}

export function normalizeImageTextTone(
  tone?: string | null,
): "default" | "muted" | "surface" {
  if (tone === "muted" || tone === "surface" || tone === "default") return tone;
  return "default";
}

export function normalizeImageTextSpacing(
  spacing?: string | null,
): "compact" | "default" | "spacious" {
  if (spacing === "compact" || spacing === "spacious") return spacing;
  return "default";
}

export function ImageTextBlock({
  appearance,
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
  const effectiveTone = normalizeImageTextTone(appearance?.scheme);
  const effectiveSpacing = normalizeImageTextSpacing(appearance?.spacing);
  const customTheme = appearance?.scheme === "custom";
  const section = (
    <Section spacing={effectiveSpacing} scheme={customTheme ? "default" : effectiveTone}>
      <Container size="lg">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <PresentedMediaImage
            className={`rounded-xl border border-(--block-border) ${imageOnRight ? "lg:order-2" : ""}`}
            media={image}
            presentation={imagePresentation as ImagePresentation}
            sizeClassNames={imageSizeClasses}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="max-w-container-sm">
            {title ? (
              <Heading level={2} size="lg">
                <span className="text-balance break-words">{title}</span>
              </Heading>
            ) : null}
            <RichText
              className={`cms-rich-text leading-relaxed${title ? " mt-5" : ""}`}
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

  return customTheme
    ? <BlockThemeScope palette={appearance?.colors}>{section}</BlockThemeScope>
    : section;
}

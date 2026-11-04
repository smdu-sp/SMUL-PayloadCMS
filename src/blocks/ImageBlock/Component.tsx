import type { Media } from "../../payload-types";
import type { ImagePresentationSize } from "../../fields/image-presentation";
import { BlockThemeScope, Container, Section, Text } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import {
  normalizeColorScheme,
  type EditorialColorOverrides,
} from "../../lib/theme/block-color-theme";
import type { ImagePresentation } from "../shared/image-presentation";
import {
  getImagePresentationSizeClassName,
} from "../shared/image-presentation";
import { PresentedMediaImage } from "../shared/PresentedMediaImage";

type ImageBlockAlignment = "center" | "left" | "right";

type ImageBlockAppearance = {
  alignment?: ImageBlockAlignment | string | null;
  colors?: EditorialColorOverrides | null;
  scheme?: "custom" | string | null;
};

export type ImageBlockProps = {
  appearance?: ImageBlockAppearance | null;
  blockType: "imageBlock";
  caption?: string | null;
  id?: string | null;
  imagePresentation?: ImagePresentation;
  media: number | Media;
};

const alignmentClasses: Record<ImageBlockAlignment, string> = {
  center: "mx-auto",
  left: "mr-auto",
  right: "ml-auto",
};

const imageSizeClasses: Record<ImagePresentationSize, string> = {
  small: "w-full sm:w-1/2 sm:max-w-xs",
  medium: "w-full sm:w-2/3 sm:max-w-md",
  large: "w-full sm:w-5/6 sm:max-w-2xl",
  full: "w-full",
};

export function normalizeImageBlockAlignment(
  alignment: ImageBlockAlignment | string | null | undefined,
): ImageBlockAlignment {
  if (alignment === "left" || alignment === "right") return alignment;
  return "center";
}

export function ImageBlock({
  appearance,
  caption,
  imagePresentation,
  media,
}: ImageBlockProps) {
  if (!media || typeof media !== "object" || !media.url) return null;

  const alignment = normalizeImageBlockAlignment(appearance?.alignment);
  const presentation: NonNullable<ImagePresentation> = {
    size: imagePresentation?.size ?? "large",
    aspectRatio: imagePresentation?.aspectRatio ?? "original",
    canvas: imagePresentation?.canvas,
    fit: imagePresentation?.fit ?? "cover",
  };
  const presentationSizeClassName = getImagePresentationSizeClassName(presentation, {
    sizeClassNames: imageSizeClasses,
  });
  const customTheme = appearance?.scheme === "custom";

  const section = (
    <Section
      spacing="default"
      scheme={customTheme ? "default" : normalizeColorScheme(appearance?.scheme)}
    >
      <Container size="lg">
        <figure
          className={classNames(
            presentationSizeClassName,
            alignmentClasses[alignment],
            "overflow-hidden",
          )}
        >
          <PresentedMediaImage
            className="rounded-xl border border-(--block-border) bg-muted"
            imageClassName="w-full"
            media={media}
            presentation={{ ...presentation, size: "full" }}
            sizes="(min-width: 1024px) 75vw, 100vw"
          />
          {caption ? (
            <figcaption className="mt-3">
              <Text variant="small">
                <span className="whitespace-pre-line break-words">{caption}</span>
              </Text>
            </figcaption>
          ) : null}
        </figure>
      </Container>
    </Section>
  );

  return customTheme
    ? <BlockThemeScope palette={appearance?.colors}>{section}</BlockThemeScope>
    : section;
}

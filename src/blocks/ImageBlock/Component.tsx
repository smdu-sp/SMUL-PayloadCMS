import type { Media } from "../../payload-types";
import { Container, Section, Text } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import type { ImagePresentation } from "../shared/image-presentation";
import {
  getFocalPointStyle,
  getImagePresentationClassName,
  getImagePresentationFitClassName,
} from "../shared/image-presentation";
import { MediaImage } from "../shared/MediaImage";

type ImageBlockAlignment = "center" | "left" | "right";

type ImageBlockAppearance = {
  alignment?: ImageBlockAlignment | string | null;
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
    fit: imagePresentation?.fit ?? "cover",
  };
  const presentationClassName = getImagePresentationClassName(presentation);
  const constrainedCrop = presentation.aspectRatio !== "original";
  const fitClassName = getImagePresentationFitClassName(presentation);

  return (
    <Section spacing="default" tone="default">
      <Container size="lg">
        <figure
          className={classNames(
            presentationClassName,
            alignmentClasses[alignment],
            "overflow-hidden",
          )}
        >
          {constrainedCrop ? (
            <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-muted">
              <MediaImage
                className={fitClassName}
                fill
                media={media}
                sizes="(min-width: 1024px) 75vw, 100vw"
                style={getFocalPointStyle(media, presentation)}
              />
            </div>
          ) : (
            <MediaImage
              className="h-auto w-full rounded-xl border border-border"
              media={media}
              sizes="(min-width: 1024px) 75vw, 100vw"
            />
          )}
          {caption ? (
            <figcaption className="mt-3">
              <Text tone="muted" variant="small">
                <span className="whitespace-pre-line break-words">{caption}</span>
              </Text>
            </figcaption>
          ) : null}
        </figure>
      </Container>
    </Section>
  );
}

import type { Media, Page } from "../../payload-types";
import { Container, Heading, Text } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import { BlockLink } from "../shared/BlockLink";
import { MediaImage } from "../shared/MediaImage";
import { normalizeFocalPoint, normalizeHeroOverlay } from "../Hero/Component";

type BannerVariant = "compact" | "default" | "immersive";
type ContentPosition = "center" | "left" | "right";
type ImageFit = "contain" | "cover";

type BannerAction = {
  id?: string | null;
  label: string;
  newTab?: boolean | null;
  page?: (number | null) | Page;
  type: "external" | "internal";
  url?: string | null;
};

export type FullWidthImageBannerBlockProps = {
  blockType: "fullWidthImageBanner";
  content?: {
    actions?: BannerAction[] | null;
    description?: string | null;
    eyebrow?: string | null;
    title?: string | null;
  } | null;
  contentPosition: ContentPosition;
  desktopImage: number | Media;
  focalPoint: "bottom" | "center" | "left" | "right" | "top";
  id?: string | null;
  imageFit: ImageFit;
  mobileImage?: (number | null) | Media;
  overlay: "dark" | "light" | "none";
  variant: BannerVariant;
};

type BannerProps = FullWidthImageBannerBlockProps & {
  imageFit?: ImageFit | string | null;
};

export function normalizeFullWidthImageBannerVariant(
  variant: BannerVariant | string | null | undefined,
): BannerVariant {
  if (variant === "compact" || variant === "immersive") return variant;
  return "default";
}

export function normalizeBannerContentPosition(
  position: ContentPosition | string | null | undefined,
): ContentPosition {
  if (position === "center" || position === "right") return position;
  return "left";
}

export function normalizeBannerImageFit(
  fit: ImageFit | string | null | undefined,
): ImageFit {
  return fit === "contain" ? "contain" : "cover";
}

const heightClasses: Record<BannerVariant, string> = {
  compact: "min-h-64",
  default: "min-h-96",
  immersive: "min-h-[34rem]",
};

const positionClasses: Record<ContentPosition, string> = {
  center: "items-center text-center",
  left: "items-start text-left",
  right: "items-end text-right",
};

const focalPointClasses = {
  bottom: "object-bottom",
  center: "object-center",
  left: "object-left",
  right: "object-right",
  top: "object-top",
} as const;

const overlayClasses = {
  dark: "bg-secondary/65",
  light: "bg-background/70",
  none: "",
} as const;

export function FullWidthImageBannerBlock({
  content,
  contentPosition,
  desktopImage,
  focalPoint,
  imageFit,
  mobileImage,
  overlay,
  variant,
}: BannerProps) {
  const normalizedVariant = normalizeFullWidthImageBannerVariant(variant);
  const normalizedPosition = normalizeBannerContentPosition(contentPosition);
  const normalizedFit = normalizeBannerImageFit(imageFit);
  const normalizedOverlay = normalizeHeroOverlay(overlay);
  const normalizedFocalPoint = normalizeFocalPoint(focalPoint);
  const hasDesktopImage = Boolean(
    desktopImage && typeof desktopImage === "object" && desktopImage.url,
  );
  const hasMobileImage = Boolean(
    hasDesktopImage && mobileImage && typeof mobileImage === "object" && mobileImage.url,
  );
  const hasContent = Boolean(
    content?.eyebrow || content?.title || content?.description || content?.actions?.length,
  );
  const contentTone = normalizedOverlay === "light" ? "default" : "inverse";

  if (!hasDesktopImage) return null;

  return (
    <section
      className={classNames(
        "relative flex overflow-hidden bg-muted",
        heightClasses[normalizedVariant],
      )}
    >
      <MediaImage
        className={classNames(
          normalizedFit === "cover" ? "object-cover" : "object-contain",
          focalPointClasses[normalizedFocalPoint],
          hasMobileImage && "hidden sm:block",
        )}
        fill
        media={desktopImage}
        sizes="100vw"
      />
      {hasMobileImage ? (
        <MediaImage
          className={classNames(
            normalizedFit === "cover" ? "object-cover" : "object-contain",
            focalPointClasses[normalizedFocalPoint],
            "sm:hidden",
          )}
          fill
          media={mobileImage}
          sizes="100vw"
        />
      ) : null}
      {normalizedOverlay !== "none" ? (
        <div aria-hidden="true" className={classNames("absolute inset-0", overlayClasses[normalizedOverlay])} />
      ) : null}
      {hasContent ? (
        <Container size="lg">
          <div
            className={classNames(
              "relative z-10 flex h-full max-w-container-sm flex-col justify-center py-16",
              normalizedPosition === "center" && "mx-auto",
              normalizedPosition === "right" && "ml-auto",
              positionClasses[normalizedPosition],
            )}
          >
            {content?.eyebrow ? (
              <Text
                as="span"
                tone={contentTone === "inverse" ? "accent" : "muted"}
                transform="uppercase"
                variant="small"
                weight="semibold"
              >
                {content.eyebrow}
              </Text>
            ) : null}
            {content?.title ? (
              <div className="mt-3">
                <Heading
                  align={
                    normalizedPosition === "right"
                      ? "end"
                      : normalizedPosition === "center"
                        ? "center"
                        : "start"
                  }
                  level={2}
                  size={normalizedVariant === "compact" ? "lg" : "display"}
                  tone={contentTone}
                >
                  <span className="text-balance break-words">{content.title}</span>
                </Heading>
              </div>
            ) : null}
            {content?.description ? (
              <div className="mt-5">
                <Text tone={contentTone} variant="lead">
                  {content.description}
                </Text>
              </div>
            ) : null}
            {content?.actions?.length ? (
              <div className="mt-7 flex flex-wrap gap-3">
                {content.actions.map((action) => (
                  <BlockLink appearance="primary" key={action.id} link={action} />
                ))}
              </div>
            ) : null}
          </div>
        </Container>
      ) : null}
    </section>
  );
}

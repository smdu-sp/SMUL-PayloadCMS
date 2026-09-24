import type { Media, Page } from "../../payload-types";
import { BlockThemeScope, ColorScope, Heading, MediaColorScope, Text } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import type { EditorialColorOverrides } from "../../lib/theme/block-color-theme";
import { BlockLink } from "../shared/BlockLink";
import { MediaImage } from "../shared/MediaImage";
import { normalizeFocalPoint, normalizeHeroOverlay } from "../Hero/Component";

type BannerVariant = "compact" | "default" | "immersive";
type BannerHeight = "auto" | "compact" | "custom" | "large" | "medium";
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
  appearance?: {
    colors?: EditorialColorOverrides | null;
    scheme?: "custom" | "default" | string | null;
  } | null;
  blockType: "fullWidthImageBanner";
  content?: {
    actions?: BannerAction[] | null;
    description?: string | null;
    eyebrow?: string | null;
    title?: string | null;
  } | null;
  contentPosition?: ContentPosition | null;
  customImageHeight?: number | null;
  desktopImage: number | Media;
  focalPoint?: "bottom" | "center" | "left" | "right" | "top" | null;
  id?: string | null;
  imageHeight?: BannerHeight | null;
  imageFit?: ImageFit | null;
  mobileImage?: (number | null) | Media;
  overlay?: "dark" | "light" | "none" | null;
};

type BannerProps = FullWidthImageBannerBlockProps & {
  customImageHeight?: number | null;
  imageHeight?: BannerHeight | string | null;
  imageFit?: ImageFit | string | null;
  variant?: BannerVariant | string | null;
};

export function normalizeBannerImageHeight(
  height: BannerHeight | string | null | undefined,
  legacyVariant?: BannerVariant | string | null,
): BannerHeight {
  if (
    height === "auto" ||
    height === "compact" ||
    height === "custom" ||
    height === "medium" ||
    height === "large"
  ) {
    return height;
  }

  if (legacyVariant === "compact") return "compact";
  if (legacyVariant === "immersive") return "large";
  if (legacyVariant === "default") return "medium";

  return "auto";
}

export function normalizeCustomBannerImageHeight(
  height: number | null | undefined,
): number | null {
  if (typeof height !== "number" || !Number.isFinite(height)) return null;

  return Math.min(Math.max(Math.round(height), 160), 900);
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

const positionClasses: Record<ContentPosition, string> = {
  center: "items-center text-center",
  left: "items-start text-left",
  right: "items-end text-right",
};

const heightClasses: Record<Exclude<BannerHeight, "auto" | "custom">, string> = {
  compact: "h-64",
  medium: "h-96",
  large: "h-[34rem]",
};

const focalPointClasses = {
  bottom: "object-bottom",
  center: "object-center",
  left: "object-left",
  right: "object-right",
  top: "object-top",
} as const;

const overlayClasses = {
  dark: "bg-[var(--block-background)] opacity-85",
  light: "bg-[var(--block-background)] opacity-85",
  none: "",
} as const;

export function FullWidthImageBannerBlock({
  appearance,
  content,
  contentPosition,
  customImageHeight,
  desktopImage,
  focalPoint,
  imageHeight,
  imageFit,
  mobileImage,
  overlay,
  variant,
}: BannerProps) {
  const normalizedHeight = normalizeBannerImageHeight(imageHeight, variant);
  const normalizedCustomHeight = normalizeCustomBannerImageHeight(customImageHeight);
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

  if (!hasDesktopImage) return null;

  const hasAutoHeight = normalizedHeight === "auto";
  const hasCustomHeight = normalizedHeight === "custom";
  const resolvedHeight = hasCustomHeight ? normalizedCustomHeight : null;
  const shouldUseFixedHeight = !hasAutoHeight && (!hasCustomHeight || Boolean(resolvedHeight));
  const customTheme = appearance?.scheme === "custom";

  const banner = (
    <section
      className={classNames(
        "relative overflow-hidden bg-muted",
        shouldUseFixedHeight && !hasCustomHeight && heightClasses[normalizedHeight],
      )}
      style={resolvedHeight ? { height: `${resolvedHeight}px` } : undefined}
    >
      <MediaImage
        className={classNames(
          shouldUseFixedHeight ? "" : "block h-auto w-full",
          normalizedFit === "cover" ? "object-cover" : "object-contain",
          focalPointClasses[normalizedFocalPoint],
          hasMobileImage && "hidden sm:block",
        )}
        fill={shouldUseFixedHeight}
        media={desktopImage}
        sizes="100vw"
      />
      {hasMobileImage ? (
        <MediaImage
          className={classNames(
            shouldUseFixedHeight ? "" : "block h-auto w-full",
            normalizedFit === "cover" ? "object-cover" : "object-contain",
            focalPointClasses[normalizedFocalPoint],
            "sm:hidden",
          )}
          fill={shouldUseFixedHeight}
          media={mobileImage}
          sizes="100vw"
        />
      ) : null}
      {normalizedOverlay !== "none" ? (
        <div aria-hidden="true" className={classNames("absolute inset-0", overlayClasses[normalizedOverlay])} />
      ) : null}
      {hasContent ? (
        <div className="absolute inset-0 z-10 mx-auto flex w-full max-w-container-lg px-container sm:px-container-wide">
          <div
            className={classNames(
              "flex max-w-container-sm flex-col justify-center py-8 sm:py-16",
              normalizedPosition === "center" && "mx-auto",
              normalizedPosition === "right" && "ml-auto",
              positionClasses[normalizedPosition],
            )}
          >
            {content?.eyebrow ? (
              <Text
                as="span"
                tone="accent"
                transform="uppercase"
                variant="small"
                weight="semibold"
              >
                <span className="whitespace-pre-line break-words">{content.eyebrow}</span>
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
                  size={normalizedHeight === "compact" ? "lg" : "display"}
                >
                  <span className="whitespace-pre-line text-balance break-words">{content.title}</span>
                </Heading>
              </div>
            ) : null}
            {content?.description ? (
              <div className="mt-5">
                <Text variant="lead">
                  <span className="whitespace-pre-line break-words">{content.description}</span>
                </Text>
              </div>
            ) : null}
            {content?.actions?.length ? (
              <div className="mt-7 flex flex-wrap gap-3">
                {content.actions.map((action) => (
                  <BlockLink appearance="solid" key={action.id} link={action} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );

  if (customTheme) {
    return (
      <BlockThemeScope palette={appearance?.colors}>
        <ColorScope scheme="default" paint={false}>{banner}</ColorScope>
      </BlockThemeScope>
    );
  }

  return (
    <MediaColorScope mode={normalizedOverlay === "light" ? "light" : "dark"} paint={false}>
      {banner}
    </MediaColorScope>
  );
}

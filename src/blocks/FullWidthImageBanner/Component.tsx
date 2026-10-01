import Link from "next/link";
import type { Media, Page } from "../../payload-types";
import { BlockThemeScope, ColorScope, MediaColorScope } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import { resolveLinkHref } from "../../lib/navigation/resolve-link";
import type { EditorialColorOverrides } from "../../lib/theme/block-color-theme";
import { MediaImage } from "../shared/MediaImage";
import { normalizeFocalPoint, normalizeHeroOverlay } from "../Hero/Component";

type BannerVariant = "compact" | "default" | "immersive";
type BannerHeight = "auto" | "compact" | "custom" | "large" | "medium";
type ImageFit = "contain" | "cover";

type BannerLink = {
  enabled?: boolean | null;
  newTab?: boolean | null;
  page?: (number | null) | Page;
  type?: "external" | "internal" | null;
  url?: string | null;
};

export type FullWidthImageBannerBlockProps = {
  appearance?: {
    colors?: EditorialColorOverrides | null;
    scheme?: "custom" | "default" | string | null;
  } | null;
  blockType: "fullWidthImageBanner";
  customImageHeight?: number | null;
  desktopImage: number | Media;
  focalPoint?: "bottom" | "center" | "left" | "right" | "top" | null;
  id?: string | null;
  imageHeight?: BannerHeight | null;
  imageFit?: ImageFit | null;
  link?: BannerLink | null;
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

export function normalizeBannerImageFit(
  fit: ImageFit | string | null | undefined,
): ImageFit {
  return fit === "contain" ? "contain" : "cover";
}

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
  customImageHeight,
  desktopImage,
  focalPoint,
  imageHeight,
  imageFit,
  link,
  mobileImage,
  overlay,
  variant,
}: BannerProps) {
  const normalizedHeight = normalizeBannerImageHeight(imageHeight, variant);
  const normalizedCustomHeight = normalizeCustomBannerImageHeight(customImageHeight);
  const normalizedFit = normalizeBannerImageFit(imageFit);
  const normalizedOverlay = normalizeHeroOverlay(overlay);
  const normalizedFocalPoint = normalizeFocalPoint(focalPoint);
  if (!desktopImage || typeof desktopImage !== "object" || !desktopImage.url) return null;

  const hasMobileImage = Boolean(
    mobileImage && typeof mobileImage === "object" && mobileImage.url,
  );

  const hasAutoHeight = normalizedHeight === "auto";
  const hasCustomHeight = normalizedHeight === "custom";
  const resolvedHeight = hasCustomHeight ? normalizedCustomHeight : null;
  const shouldUseFixedHeight = !hasAutoHeight && (!hasCustomHeight || Boolean(resolvedHeight));
  const customTheme = appearance?.scheme === "custom";
  const linkValue = link?.enabled === true ? link : null;
  const href = linkValue ? resolveLinkHref(linkValue) : null;
  const safeHref = href && (linkValue?.type === "external" || linkValue?.url)
    ? (() => {
        try {
          const url = new URL(href);
          return url.protocol === "http:" || url.protocol === "https:" ? href : null;
        } catch {
          return null;
        }
      })()
    : href;

  const image = (
    <div
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
    </div>
  );

  const banner = safeHref ? (
    <Link
      aria-label={`Abrir banner: ${desktopImage.alt}`}
      className="block rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      href={safeHref}
      rel={linkValue?.newTab ? "noopener noreferrer" : undefined}
      target={linkValue?.newTab ? "_blank" : undefined}
    >
      {image}
    </Link>
  ) : image;

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

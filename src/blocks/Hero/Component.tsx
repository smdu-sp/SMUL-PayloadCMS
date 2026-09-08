import type { HeroBlock as HeroBlockProps } from "../../payload-types";
import { Container, Heading, Section, Text } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import { MediaImage } from "../shared/MediaImage";
import { BlockLink } from "../shared/BlockLink";

type HeroVariant = "centered" | "default" | "split";
type HeroOverlay = "dark" | "light" | "none";
type FocalPoint = "bottom" | "center" | "left" | "right" | "top";

type HeroBackground = {
  focalPoint?: FocalPoint | string | null;
  image?: HeroBlockProps["image"];
  mobileImage?: HeroBlockProps["image"];
  overlay?: HeroOverlay | string | null;
};

type HeroBlockWithBackgroundProps = HeroBlockProps & {
  background?: HeroBackground | null;
};

export function normalizeHeroVariant(
  variant: HeroBlockProps["variant"] | "image" | string | null | undefined,
): HeroVariant {
  if (variant === "centered" || variant === "split") return variant;
  if (variant === "image") return "split";
  return "default";
}

export function normalizeHeroOverlay(
  overlay: HeroOverlay | string | null | undefined,
): HeroOverlay {
  if (overlay === "light" || overlay === "none") return overlay;
  return "dark";
}

export function normalizeFocalPoint(
  focalPoint: FocalPoint | string | null | undefined,
): FocalPoint {
  if (
    focalPoint === "bottom" ||
    focalPoint === "left" ||
    focalPoint === "right" ||
    focalPoint === "top"
  ) {
    return focalPoint;
  }
  return "center";
}

const focalPointClasses: Record<FocalPoint, string> = {
  bottom: "object-bottom",
  center: "object-center",
  left: "object-left",
  right: "object-right",
  top: "object-top",
};

const overlayClasses: Record<HeroOverlay, string> = {
  dark: "bg-secondary/70",
  light: "bg-background/70",
  none: "",
};

export function HeroBlock({
  background,
  cta,
  description,
  eyebrow,
  image,
  title,
  variant,
}: HeroBlockWithBackgroundProps) {
  const normalizedVariant = normalizeHeroVariant(variant);
  const centered = normalizedVariant === "centered";
  const hasImage = Boolean(image && typeof image === "object" && image.url);
  const split = normalizedVariant === "split" && hasImage;
  const backgroundImage = background?.image;
  const mobileBackgroundImage = background?.mobileImage;
  const hasBackground = Boolean(
    backgroundImage && typeof backgroundImage === "object" && backgroundImage.url,
  );
  const hasMobileBackground = Boolean(
    hasBackground &&
      mobileBackgroundImage &&
      typeof mobileBackgroundImage === "object" &&
      mobileBackgroundImage.url,
  );
  const overlay = normalizeHeroOverlay(background?.overlay);
  const focalPoint = normalizeFocalPoint(background?.focalPoint);
  const contentAlignment = centered ? "items-center text-center" : "items-start";
  const contentWidth = split ? "max-w-container-md" : "max-w-container-sm";
  const contentTone = hasBackground && overlay === "light" ? "default" : "inverse";

  return (
    <Section spacing={hasBackground ? "sm" : "xl"} tone="brand">
      <div
        className={classNames(
          "relative overflow-hidden",
          hasBackground && "min-h-[30rem] py-16 sm:py-20",
        )}
      >
        {hasBackground ? (
          <>
            <MediaImage
              className={classNames(
                "object-cover",
                focalPointClasses[focalPoint],
                hasMobileBackground && "hidden sm:block",
              )}
              fill
              media={backgroundImage}
              preload
              sizes="100vw"
            />
            {hasMobileBackground ? (
              <MediaImage
                className={classNames(
                  "object-cover sm:hidden",
                  focalPointClasses[focalPoint],
                )}
                fill
                media={mobileBackgroundImage}
                preload
                sizes="100vw"
              />
            ) : null}
            {overlay !== "none" ? (
              <div
                aria-hidden="true"
                className={classNames("absolute inset-0", overlayClasses[overlay])}
              />
            ) : null}
          </>
        ) : null}
        <Container size="lg">
          <div
            className={classNames(
              "relative z-10 grid w-full gap-10 lg:gap-16",
              split && "items-center lg:grid-cols-2",
            )}
          >
            <div
              className={
                centered
                  ? `mx-auto flex ${contentWidth} flex-col ${contentAlignment}`
                  : `flex ${contentWidth} flex-col ${contentAlignment}`
              }
            >
              {eyebrow ? (
                <Text
                  as="span"
                  tone="accent"
                  transform="uppercase"
                  variant="small"
                  weight="semibold"
                >
                  {eyebrow}
                </Text>
              ) : null}
              <div className="mt-3">
                <Heading
                  align={centered ? "center" : "start"}
                  level={1}
                  size="display"
                  tone={contentTone}
                >
                  <span className="text-balance break-words">{title}</span>
                </Heading>
              </div>
              {description ? (
                <div className="mt-6 max-w-container-sm">
                  <Text tone={contentTone} variant="lead">
                    {description}
                  </Text>
                </div>
              ) : null}
              {cta?.label ? (
                <div className="mt-8">
                  <BlockLink appearance="primary" link={cta} />
                </div>
              ) : null}
            </div>
            {split ? (
              <MediaImage
                className="aspect-video h-auto w-full rounded-xl border border-border object-cover"
                media={image}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            ) : null}
          </div>
        </Container>
      </div>
    </Section>
  );
}

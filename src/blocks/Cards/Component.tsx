import type { CardsBlock as CardsBlockProps } from "../../payload-types";
import { Card, Container, Heading, Section, Text } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import { MediaImage } from "../shared/MediaImage";
import { BlockLink } from "../shared/BlockLink";

type CardsVariant = "default" | "modalities";
type CardMediaSource = "icon" | "image" | "none";
type CardMediaPosition = "left" | "right" | "top";
type CardImageSize = "large" | "medium" | "small";
type CardImageAspect = "16:9" | "4:3" | "original" | "square";
type CardImageFit = "contain" | "cover";

type CardsItem = CardsBlockProps["items"][number] & {
  fit?: CardImageFit | string | null;
  image?: CardsBlockProps["items"][number]["icon"];
  imageAspect?: CardImageAspect | string | null;
  imageSize?: CardImageSize | string | null;
  mediaPosition?: CardMediaPosition | string | null;
  mediaSource?: CardMediaSource | string | null;
};

export function normalizeCardsVariant(
  variant: CardsBlockProps["variant"] | string | null | undefined,
): CardsVariant {
  return variant === "modalities" ? "modalities" : "default";
}

export function normalizeCardMediaSource(item: CardsItem): CardMediaSource {
  if (item.mediaSource === "image" && item.image) return "image";
  if ((item.mediaSource === "icon" || !item.mediaSource) && item.icon) return "icon";
  return "none";
}

export function normalizeCardMediaPosition(
  position: CardMediaPosition | string | null | undefined,
): CardMediaPosition {
  if (position === "left" || position === "right") return position;
  return "top";
}

export function normalizeCardImageSize(
  size: CardImageSize | string | null | undefined,
): CardImageSize {
  if (size === "small" || size === "large") return size;
  return "medium";
}

export function normalizeCardImageAspect(
  aspect: CardImageAspect | string | null | undefined,
): CardImageAspect {
  if (aspect === "square" || aspect === "4:3" || aspect === "16:9") return aspect;
  return "original";
}

export function normalizeCardImageFit(
  fit: CardImageFit | string | null | undefined,
): CardImageFit {
  return fit === "contain" ? "contain" : "cover";
}

const iconSizeClasses = {
  default: {
    modalities: "h-14 w-14",
    standard: "h-12 w-12",
  },
  side: {
    modalities: "h-14 w-14",
    standard: "h-12 w-12",
  },
} as const;

const imageSizeClasses: Record<CardImageSize, string> = {
  large: "w-full",
  medium: "w-full",
  small: "w-28",
};

const imageAspectClasses: Record<CardImageAspect, string> = {
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  original: "aspect-auto",
  square: "aspect-square",
};

const imageFitClasses: Record<CardImageFit, string> = {
  contain: "object-contain",
  cover: "object-cover",
};

function CardMedia({
  item,
  modalities,
  position,
  source,
}: {
  item: CardsItem;
  modalities: boolean;
  position: CardMediaPosition;
  source: CardMediaSource;
}) {
  if (source === "none") return null;

  const side = position !== "top";

  if (source === "icon") {
    return (
      <MediaImage
        className={classNames(
          side
            ? iconSizeClasses.side[modalities ? "modalities" : "standard"]
            : iconSizeClasses.default[modalities ? "modalities" : "standard"],
          side ? "mt-1" : "mb-5",
          "shrink-0 object-contain",
        )}
        media={item.icon}
        sizes="56px"
      />
    );
  }

  const size = normalizeCardImageSize(item.imageSize);
  const aspect = normalizeCardImageAspect(item.imageAspect);
  const fit = normalizeCardImageFit(item.fit);

  return (
    <MediaImage
      className={classNames(
        side ? "mt-1 shrink-0 sm:w-32" : "mb-5",
        imageSizeClasses[size],
        imageAspectClasses[aspect],
        imageFitClasses[fit],
        "rounded-md border border-border bg-background",
      )}
      media={item.image}
      sizes={side ? "128px" : "(min-width: 1024px) 33vw, 100vw"}
    />
  );
}

export function CardsBlock({ description, items, title, variant }: CardsBlockProps) {
  const normalizedVariant = normalizeCardsVariant(variant);
  const modalities = normalizedVariant === "modalities";

  return (
    <Section spacing="md" tone={modalities ? "default" : "muted"}>
      <Container size="lg">
        {title ? (
          <Heading level={2} size="lg">
            <span className="text-balance break-words">{title}</span>
          </Heading>
        ) : null}
        {description ? (
          <div className="mt-4 max-w-container-sm">
            <Text variant="muted">{description}</Text>
          </div>
        ) : null}
        <ul className="mt-8 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const cardItem = item as CardsItem;
            const mediaSource = normalizeCardMediaSource(cardItem);
            const mediaPosition = normalizeCardMediaPosition(cardItem.mediaPosition);
            const sideMedia = mediaSource !== "none" && mediaPosition !== "top";

            return (
              <li key={item.id}>
                <Card fullHeight interactive padding={modalities ? "lg" : "md"}>
                  <div
                    className={classNames(
                      sideMedia && "flex gap-5",
                      sideMedia && mediaPosition === "right" && "flex-row-reverse",
                    )}
                  >
                    <CardMedia
                      item={cardItem}
                      modalities={modalities}
                      position={mediaPosition}
                      source={mediaSource}
                    />
                    <div className="min-w-0 flex-1">
                      <Heading level={3} size="md">
                        <span className="break-words">{item.title}</span>
                      </Heading>
                      <div className="mt-3">
                        <Text>{item.description}</Text>
                      </div>
                    </div>
                  </div>
                  {item.link?.label ? (
                    <div className="mt-auto pt-5">
                      <BlockLink link={item.link} />
                    </div>
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}

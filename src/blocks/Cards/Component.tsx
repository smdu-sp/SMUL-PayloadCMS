import type { CardsBlock as CardsBlockProps } from "../../payload-types";
import { Card, Container, Heading, Section, Text } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import type { ImagePresentation } from "../shared/image-presentation";
import {
  getFocalPointStyle,
  getImagePresentationClassName,
} from "../shared/image-presentation";
import { BlockIcon } from "../shared/BlockIcon";
import { BlockLink } from "../shared/BlockLink";
import { MediaImage } from "../shared/MediaImage";

type CardsVariant = "default" | "modalities";
type CardMediaSource = "icon" | "image" | "none";
type CardMediaPosition = "left" | "right" | "top";

type CardsItem = CardsBlockProps["items"][number] & {
  iconSource?: "custom" | "standard" | string | null;
  image?: CardsBlockProps["items"][number]["icon"];
  imagePresentation?: ImagePresentation;
  mediaPosition?: CardMediaPosition | string | null;
  mediaSource?: CardMediaSource | string | null;
  standardIcon?: string | null;
};

type CardsAppearance = {
  spacing?: "compact" | "default" | "spacious" | string | null;
  tone?: "default" | "muted" | "surface" | string | null;
};

type CardsBlockWithAppearanceProps = CardsBlockProps & {
  appearance?: CardsAppearance | null;
};

export function normalizeCardsVariant(
  variant: CardsBlockProps["variant"] | string | null | undefined,
): CardsVariant {
  return variant === "modalities" ? "modalities" : "default";
}

export function normalizeCardsTone(
  tone?: string | null,
  fallbackTone: "default" | "muted" | "surface" = "default",
): "default" | "muted" | "surface" {
  if (tone === "muted" || tone === "surface" || tone === "default") return tone;
  return fallbackTone;
}

export function normalizeCardsSpacing(
  spacing?: string | null,
  fallbackSpacing: "compact" | "default" | "spacious" = "default",
): "compact" | "default" | "spacious" {
  if (spacing === "compact" || spacing === "spacious") return spacing;
  return fallbackSpacing;
}

export function normalizeCardMediaSource(item: CardsItem): CardMediaSource {
  if (item.mediaSource === "image" && item.image) return "image";
  if (item.mediaSource === "icon") return "icon";
  if (!item.mediaSource && (item.icon || item.standardIcon)) return "icon";
  return "none";
}

export function normalizeCardMediaPosition(
  position: CardMediaPosition | string | null | undefined,
): CardMediaPosition {
  if (position === "left" || position === "right") return position;
  return "top";
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

const cardImageSizeClasses = {
  top: {
    small: "w-28 max-w-full mx-auto",
    medium: "w-3/4 max-w-full mx-auto",
    large: "w-full",
  },
  side: {
    small: "w-20 shrink-0",
    medium: "w-28 shrink-0",
    large: "w-32 shrink-0",
  },
} as const;

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
      <BlockIcon
        className={classNames(
          side
            ? iconSizeClasses.side[modalities ? "modalities" : "standard"]
            : iconSizeClasses.default[modalities ? "modalities" : "standard"],
          side ? "mt-1" : "mb-5",
          "shrink-0 object-contain",
        )}
        icon={item.icon}
        iconSource={item.iconSource}
        sizes="56px"
        standardIcon={item.standardIcon}
        tone="primary"
      />
    );
  }

  const presentation: NonNullable<ImagePresentation> = {
    size: item.imagePresentation?.size ?? "medium",
    aspectRatio: item.imagePresentation?.aspectRatio ?? "original",
    fit: item.imagePresentation?.fit ?? "cover",
  };

  return (
    <MediaImage
      className={classNames(
        side ? "mt-1" : "mb-5",
        getImagePresentationClassName(presentation, {
          sizeClassNames: side ? cardImageSizeClasses.side : cardImageSizeClasses.top,
        }),
        "rounded-md border border-border bg-background",
      )}
      media={item.image}
      style={getFocalPointStyle(
        typeof item.image === "object" ? item.image : null,
        presentation,
      )}
      sizes={side ? "128px" : "(min-width: 1024px) 33vw, 100vw"}
    />
  );
}

export function CardsBlock({
  appearance,
  description,
  items,
  title,
  variant,
}: CardsBlockWithAppearanceProps) {
  const normalizedVariant = normalizeCardsVariant(variant);
  const modalities = normalizedVariant === "modalities";
  const effectiveTone = normalizeCardsTone(
    appearance?.tone && appearance.tone !== "default" ? appearance.tone : null,
    modalities ? "default" : "muted",
  );
  const effectiveSpacing = normalizeCardsSpacing(
    appearance?.spacing,
    "default",
  );

  return (
    <Section spacing={effectiveSpacing} tone={effectiveTone}>
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

import type { HeroBlock as HeroBlockProps } from "../../payload-types";
import { Container, Heading, Section, Text } from "../../components/ui";
import {
  getFocalPointStyle,
  getImagePresentationClassName,
} from "../shared/image-presentation";
import { MediaImage } from "../shared/MediaImage";
import { BlockLink } from "../shared/BlockLink";

type HeroVariant = "centered" | "default" | "split";

export function normalizeHeroVariant(
  variant: HeroBlockProps["variant"] | "image" | string | null | undefined,
): HeroVariant {
  if (variant === "centered" || variant === "split") return variant;
  if (variant === "image") return "split";
  return "default";
}

export function HeroBlock({
  cta,
  description,
  eyebrow,
  image,
  imagePresentation,
  title,
  variant,
}: HeroBlockProps) {
  const normalizedVariant = normalizeHeroVariant(variant);
  const centered = normalizedVariant === "centered";
  const hasImage = Boolean(image && typeof image === "object" && image.url);
  const split = normalizedVariant === "split" && hasImage;
  const contentAlignment = centered ? "items-center text-center" : "items-start";
  const contentWidth = split ? "max-w-container-md" : "max-w-container-sm";

  return (
    <Section spacing="xl" tone="brand">
      <Container size="lg">
        <div
          className={`grid w-full gap-10 lg:gap-16 ${split ? "items-center lg:grid-cols-2" : ""}`}
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
                tone="inverse"
              >
                <span className="text-balance break-words">{title}</span>
              </Heading>
            </div>
            {description ? (
              <div className="mt-6 max-w-container-sm">
                <Text tone="inverse" variant="lead">
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
              className={`h-auto rounded-xl border border-border ${getImagePresentationClassName(imagePresentation)}`}
              media={image}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              style={getFocalPointStyle(
                typeof image === "object" ? image : null,
                imagePresentation,
              )}
            />
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

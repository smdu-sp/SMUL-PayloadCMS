import type { CTABlock as CTABlockProps } from "../../payload-types";
import { Card, Container, Heading, Section, Text } from "../../components/ui";
import { BlockLink } from "../shared/BlockLink";

type CTAVariant = "brand" | "compact" | "default";

const ctaVariantStyles = {
  brand: {
    actionAppearance: "secondary",
    cardTone: "brand",
    containerSize: "lg",
    descriptionSpacing: "mt-4",
    linkSize: "md",
    padding: "lg",
    headingSize: "lg",
    actionSpacing: "mt-7",
    sectionSpacing: "md",
    textTone: "inverse",
    titleTone: "inverse",
  },
  compact: {
    actionAppearance: "primary",
    cardTone: "surface",
    containerSize: "md",
    descriptionSpacing: "mt-3",
    linkSize: "sm",
    padding: "md",
    headingSize: "md",
    actionSpacing: "mt-5",
    sectionSpacing: "sm",
    textTone: "default",
    titleTone: "default",
  },
  default: {
    actionAppearance: "primary",
    cardTone: "accent",
    containerSize: "lg",
    descriptionSpacing: "mt-4",
    linkSize: "md",
    padding: "lg",
    headingSize: "lg",
    actionSpacing: "mt-7",
    sectionSpacing: "md",
    textTone: "default",
    titleTone: "default",
  },
} as const;

type CTAAppearance = {
  spacing?: "compact" | "default" | "spacious" | string | null;
  tone?: "accent" | "brand" | "default" | "muted" | "surface" | string | null;
};

type CTABlockWithAppearanceProps = CTABlockProps & {
  appearance?: CTAAppearance | null;
};

export function normalizeCTAVariant(
  variant: CTABlockProps["variant"] | "primary" | "secondary" | string | null | undefined,
): CTAVariant {
  if (variant === "brand" || variant === "compact" || variant === "default") return variant;
  if (variant === "primary") return "brand";
  return "default";
}

export function normalizeCTATone(
  tone?: string | null,
  fallbackTone: "accent" | "brand" | "default" | "muted" | "surface" = "default",
): "accent" | "brand" | "default" | "muted" | "surface" {
  if (
    tone === "brand" ||
    tone === "accent" ||
    tone === "muted" ||
    tone === "surface"
  ) {
    return tone;
  }
  return fallbackTone;
}

export function normalizeCTASpacing(
  spacing?: string | null,
  fallbackSpacing: "compact" | "default" | "spacious" = "default",
): "compact" | "default" | "spacious" {
  if (spacing === "compact" || spacing === "spacious") return spacing;
  return fallbackSpacing;
}

export function CTABlock({
  action,
  appearance,
  description,
  title,
  variant,
}: CTABlockWithAppearanceProps) {
  const normalizedVariant = normalizeCTAVariant(variant);
  const styles = ctaVariantStyles[normalizedVariant];
  const effectiveTone = normalizeCTATone(
    appearance?.tone && appearance.tone !== "default" ? appearance.tone : null,
    styles.cardTone,
  );
  const isDarkTone = effectiveTone === "brand";
  const effectiveSpacing = normalizeCTASpacing(
    appearance?.spacing,
    styles.sectionSpacing === "sm" ? "compact" : "default",
  );

  return (
    <Section spacing={effectiveSpacing} tone="default">
      <Container size={styles.containerSize}>
        <Card padding={styles.padding} tone={effectiveTone}>
          <Heading
            level={2}
            size={styles.headingSize}
            tone={isDarkTone ? "inverse" : "default"}
          >
            <span className="text-balance break-words">{title}</span>
          </Heading>
          {description ? (
            <div className={`${styles.descriptionSpacing} max-w-container-sm`}>
              <Text tone={isDarkTone ? "inverse" : "default"} variant="lead">
                {description}
              </Text>
            </div>
          ) : null}
          {action?.label ? (
            <div className={styles.actionSpacing}>
              <BlockLink
                appearance={isDarkTone ? "secondary" : styles.actionAppearance}
                link={action}
                size={styles.linkSize}
              />
            </div>
          ) : null}
        </Card>
      </Container>
    </Section>
  );
}

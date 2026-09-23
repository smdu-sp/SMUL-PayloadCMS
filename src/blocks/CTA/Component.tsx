import type { CTABlock as CTABlockProps } from "../../payload-types";
import { BlockThemeScope, Card, Container, Heading, Section, Text } from "../../components/ui";
import {
  normalizeColorScheme,
  type EditorialColorOverrides,
} from "../../lib/theme/block-color-theme";
import { BlockLink } from "../shared/BlockLink";

type CTAVariant = "brand" | "compact" | "default";
type CTAEmphasis = "default" | "strong" | "subtle";
type CTABlockWithAppearanceProps = Omit<CTABlockProps, "appearance"> & {
  appearance?: (Omit<NonNullable<CTABlockProps["appearance"]>, "colors" | "scheme"> & {
    colors?: EditorialColorOverrides | null;
    emphasis?: CTAEmphasis | string | null;
    scheme?: "custom" | string | null;
  }) | null;
};
const ctaVariantStyles = {
  brand: { containerSize: "lg", headingSize: "lg", linkSize: "md" },
  compact: { containerSize: "md", headingSize: "md", linkSize: "sm" },
  default: { containerSize: "lg", headingSize: "lg", linkSize: "md" },
} as const;
const ctaEmphasisPadding = {
  subtle: "md",
  default: "lg",
  strong: "lg",
} as const;

export function normalizeCTAVariant(variant?: string | null): CTAVariant {
  return variant === "brand" || variant === "compact" ? variant : "default";
}

export function normalizeCTASpacing(spacing?: string | null, fallback: "compact" | "default" | "spacious" = "default") {
  return spacing === "compact" || spacing === "spacious" || spacing === "default" ? spacing : fallback;
}

export function normalizeCTAEmphasis(emphasis?: string | null, fallback: CTAEmphasis = "default"): CTAEmphasis {
  return emphasis === "subtle" || emphasis === "strong" || emphasis === "default" ? emphasis : fallback;
}

export function CTABlock({ action, appearance, description, title, variant }: CTABlockWithAppearanceProps) {
  const normalizedVariant = normalizeCTAVariant(variant);
  const emphasis = normalizeCTAEmphasis(appearance?.emphasis);
  const styles = ctaVariantStyles[normalizedVariant];
  const customTheme = appearance?.scheme === "custom";
  const card = (
    <Card
      scheme={customTheme ? "default" : normalizeColorScheme(appearance?.scheme)}
      padding={ctaEmphasisPadding[emphasis]}
    >
      <Heading level={2} size={styles.headingSize}>
        <span className="text-balance wrap-break-word">{title}</span>
      </Heading>
      {description ? <div className="mt-4 max-w-container-sm"><Text variant="lead">{description}</Text></div> : null}
      {action?.label ? (
        <div className="mt-7"><BlockLink appearance="solid" link={action} size={styles.linkSize} /></div>
      ) : null}
    </Card>
  );

  return (
    <Section spacing={normalizeCTASpacing(appearance?.spacing, normalizedVariant === "compact" ? "compact" : "default")}>
      <Container size={styles.containerSize}>
        {customTheme ? (
          <BlockThemeScope palette={appearance?.colors}>{card}</BlockThemeScope>
        ) : card}
      </Container>
    </Section>
  );
}

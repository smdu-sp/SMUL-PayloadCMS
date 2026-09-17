import type { CTABlock as CTABlockProps } from "../../payload-types";
import { Card, Container, Heading, Section, Text } from "../../components/ui";
import { normalizeColorScheme } from "../../lib/theme/block-color-theme";
import { BlockLink } from "../shared/BlockLink";

type CTAVariant = "brand" | "compact" | "default";
const ctaVariantStyles = {
  brand: { containerSize: "lg", padding: "lg", headingSize: "lg", linkSize: "md" },
  compact: { containerSize: "md", padding: "md", headingSize: "md", linkSize: "sm" },
  default: { containerSize: "lg", padding: "lg", headingSize: "lg", linkSize: "md" },
} as const;

export function normalizeCTAVariant(variant?: string | null): CTAVariant {
  return variant === "brand" || variant === "compact" ? variant : "default";
}

export function normalizeCTASpacing(spacing?: string | null, fallback: "compact" | "default" | "spacious" = "default") {
  return spacing === "compact" || spacing === "spacious" || spacing === "default" ? spacing : fallback;
}

export function CTABlock({ action, appearance, description, title, variant }: CTABlockProps) {
  const normalizedVariant = normalizeCTAVariant(variant);
  const styles = ctaVariantStyles[normalizedVariant];
  return (
    <Section spacing={normalizeCTASpacing(appearance?.spacing, normalizedVariant === "compact" ? "compact" : "default")}>
      <Container size={styles.containerSize}>
        <Card scheme={normalizeColorScheme(appearance?.scheme)} overrides={appearance?.colors} padding={styles.padding}>
          <Heading level={2} size={styles.headingSize}>
            <span className="text-balance break-words">{title}</span>
          </Heading>
          {description ? <div className="mt-4 max-w-container-sm"><Text variant="lead">{description}</Text></div> : null}
          {action?.label ? (
            <div className="mt-7"><BlockLink appearance="solid" link={action} size={styles.linkSize} /></div>
          ) : null}
        </Card>
      </Container>
    </Section>
  );
}

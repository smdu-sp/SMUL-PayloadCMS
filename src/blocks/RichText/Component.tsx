import { RichText } from "@payloadcms/richtext-lexical/react";
import type { RichTextBlock as RichTextBlockProps } from "../../payload-types";
import { Container, Section } from "../../components/ui";

type RichTextVariant = "default" | "narrow";

type RichTextAppearance = {
  spacing?: "compact" | "default" | "spacious" | string | null;
  width?: "default" | "narrow" | "wide" | string | null;
};

type RichTextBlockWithLegacyProps = RichTextBlockProps & {
  appearance?: RichTextAppearance | null;
  width?: "content" | "wide" | string | null;
};

export function normalizeRichTextVariant(
  variant: RichTextBlockProps["variant"] | "content" | "wide" | string | null | undefined,
): RichTextVariant {
  if (variant === "narrow" || variant === "content") return "narrow";
  return "default";
}

export function normalizeRichTextWidth(
  width?: string | null,
  fallbackVariant: "default" | "narrow" = "default",
): "default" | "narrow" | "wide" {
  if (width === "narrow" || width === "wide" || width === "default") return width;
  return fallbackVariant;
}

export function normalizeRichTextSpacing(
  spacing?: string | null,
  fallbackSpacing: "compact" | "default" | "spacious" = "default",
): "compact" | "default" | "spacious" {
  if (spacing === "compact" || spacing === "spacious") return spacing;
  return fallbackSpacing;
}

export function RichTextBlock({
  appearance,
  content,
  variant,
  width,
}: RichTextBlockWithLegacyProps) {
  const normalizedVariant = normalizeRichTextVariant(variant ?? width);
  const effectiveWidth = normalizeRichTextWidth(
    appearance?.width,
    normalizedVariant,
  );
  const effectiveSpacing = normalizeRichTextSpacing(
    appearance?.spacing,
    normalizedVariant === "narrow" ? "compact" : "default",
  );
  const containerSize =
    effectiveWidth === "narrow"
      ? "sm"
      : effectiveWidth === "wide"
        ? "xl"
        : "lg";

  return (
    <Section spacing={effectiveSpacing} tone="default">
      <Container size={containerSize}>
        <RichText
          className={`cms-rich-text leading-relaxed ${effectiveWidth !== "narrow" ? "cms-rich-text--wide" : ""}`}
          data={content}
        />
      </Container>
    </Section>
  );
}


import {
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { RichTextBlock as RichTextBlockProps } from "../../payload-types";
import { BlockThemeScope, Container, Section } from "../../components/ui";
import {
  normalizeColorScheme,
  type EditorialColorOverrides,
} from "../../lib/theme/block-color-theme";
import {
  getRichTextFontFamily,
  getUsedRichTextFontStylesheets,
} from "./font-family";
import { getRichTextFontSize } from "./font-size";

type RichTextVariant = "default" | "narrow";

type RichTextAppearance = {
  colors?: EditorialColorOverrides | null;
  scheme?: "custom" | string | null;
  spacing?: "compact" | "default" | "spacious" | string | null;
  width?: "default" | "narrow" | "wide" | string | null;
};

type RichTextBlockWithLegacyProps = RichTextBlockProps & {
  appearance?: RichTextAppearance | null;
  width?: "content" | "wide" | string | null;
};

const richTextConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  text: (args) => {
    const defaultText =
      typeof defaultConverters.text === "function"
        ? defaultConverters.text(args)
        : args.node.text;
    const state = (args.node as {
      $?: { fontFamily?: unknown; fontSize?: unknown };
    }).$;
    const fontFamily = getRichTextFontFamily(state?.fontFamily);
    const fontSize = getRichTextFontSize(state?.fontSize);

    return fontFamily || fontSize
      ? <span style={{ fontFamily, fontSize }}>{defaultText}</span>
      : defaultText;
  },
});

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
  const fontStylesheets = getUsedRichTextFontStylesheets(content);
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
  const customTheme = appearance?.scheme === "custom";
  const section = (
    <Section
      spacing={effectiveSpacing}
      scheme={customTheme ? "default" : normalizeColorScheme(appearance?.scheme)}
    >
      <Container size={containerSize}>
        <RichText
          className={`cms-rich-text leading-relaxed ${effectiveWidth !== "narrow" ? "cms-rich-text--wide" : ""}`}
          converters={richTextConverters}
          data={content}
        />
      </Container>
    </Section>
  );

  const themedSection = customTheme
    ? <BlockThemeScope palette={appearance?.colors}>{section}</BlockThemeScope>
    : section;

  return (
    <>
      {fontStylesheets.map((href) => (
        <link href={href} key={href} precedence="rich-text-fonts" rel="stylesheet" />
      ))}
      {themedSection}
    </>
  );
}

import { RichText } from "@payloadcms/richtext-lexical/react";
import type { FAQAccordionBlock as FAQAccordionBlockProps } from "../../payload-types";
import { ColorScope, Container, Heading, Section, Text } from "../../components/ui";

type FAQVariant = "compact" | "default";
type FAQTone = "default" | "muted" | "surface";

type FAQBlockWithAppearanceProps = FAQAccordionBlockProps & {
  appearance?: {
    scheme?: FAQTone | string | null;
  } | null;
};

export function normalizeFAQVariant(
  variant: FAQAccordionBlockProps["variant"] | string | null | undefined,
): FAQVariant {
  return variant === "compact" ? "compact" : "default";
}

export function normalizeFAQTone(
  tone?: string | null,
): FAQTone {
  if (tone === "default" || tone === "surface") return tone;
  return "muted";
}

export function FAQAccordionBlock({
  appearance,
  description,
  items,
  title,
  variant,
}: FAQBlockWithAppearanceProps) {
  const normalizedVariant = normalizeFAQVariant(variant);
  const effectiveTone = normalizeFAQTone(appearance?.scheme);

  return (
    <Section spacing={normalizedVariant === "compact" ? "sm" : "md"} scheme={effectiveTone}>
      <Container size="md">
        <Heading level={2} size="lg">
          <span className="text-balance wrap-break-word">{title}</span>
        </Heading>
        {description ? (
          <div className="mt-4">
            <Text variant="muted">{description}</Text>
          </div>
        ) : null}
        <ColorScope scheme="surface" className="mt-8 divide-y divide-(--block-border) rounded-lg border border-(--block-border)">
          {items.map((item) => (
            <details className="group" key={item.id}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 font-semibold text-(--block-foreground) outline-none focus-visible:outline focus-visible:outline-offset-[-3px] focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
                <span className="wrap-break-word">{item.question}</span>
                <span aria-hidden="true" className="mt-1 shrink-0 text-(--block-accent)">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5">
                <RichText className="cms-rich-text leading-relaxed" data={item.answer} />
              </div>
            </details>
          ))}
        </ColorScope>
      </Container>
    </Section>
  );
}

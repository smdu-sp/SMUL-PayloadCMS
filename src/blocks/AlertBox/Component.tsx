import { RichText } from "@payloadcms/richtext-lexical/react";
import type { AlertBoxBlock as AlertBoxBlockProps } from "../../payload-types";
import { Card, Container, Heading, Section } from "../../components/ui";
import { BlockLink } from "../shared/BlockLink";

type AlertBoxType = "info" | "warning";

const alertStyles = {
  info: {
    cardTone: "surface",
    marker: "bg-[var(--block-accent)]",
  },
  warning: {
    cardTone: "accent",
    marker: "bg-warning",
  },
} as const;

export function normalizeAlertBoxType(
  type: AlertBoxBlockProps["type"] | string | null | undefined,
): AlertBoxType {
  return type === "warning" ? "warning" : "info";
}

export function AlertBoxBlock({
  content,
  link,
  title,
  type,
}: AlertBoxBlockProps) {
  const styles = alertStyles[normalizeAlertBoxType(type)];

  return (
    <Section spacing="sm" scheme="default">
      <Container size="md">
        <Card padding="lg" scheme={styles.cardTone}>
          <div className="flex gap-5">
            <div className={`mt-1 h-10 w-1.5 shrink-0 rounded-full ${styles.marker}`} />
            <div className="min-w-0">
              {title ? (
                <Heading level={2} size="md">
                  <span className="break-words">{title}</span>
                </Heading>
              ) : null}
              <RichText
                className={`cms-rich-text leading-relaxed ${title ? "mt-4" : ""}`}
                data={content}
              />
              {link?.label ? (
                <div className="mt-5">
                  <BlockLink link={link} />
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      </Container>
    </Section>
  );
}

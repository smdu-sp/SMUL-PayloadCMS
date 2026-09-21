import { RichText } from "@payloadcms/richtext-lexical/react";
import type { AlertBoxBlock as AlertBoxBlockProps } from "../../payload-types";
import { ColorScope, Container, Heading, Section, Status, normalizeStatusVariant } from "../../components/ui";
import { BlockLink } from "../shared/BlockLink";

type AlertBoxType = "info" | "success" | "warning" | "danger";

export function normalizeAlertBoxType(
  type: AlertBoxBlockProps["type"] | string | null | undefined,
): AlertBoxType {
  return normalizeStatusVariant(type);
}

export function AlertBoxBlock({
  content,
  link,
  title,
  type,
}: AlertBoxBlockProps) {
  const variant = normalizeAlertBoxType(type);

  return (
    <Section spacing="sm" scheme="default">
      <Container size="md">
        <ColorScope scheme="surface">
          <Status
            title={title ? (
              <Heading level={2} size="md">
                <span className="break-words">{title}</span>
              </Heading>
            ) : null}
            variant={variant}
          >
            <RichText className="cms-rich-text leading-relaxed" data={content} />
            {link?.label ? (
              <div className="mt-5">
                <BlockLink link={link} />
              </div>
            ) : null}
          </Status>
        </ColorScope>
      </Container>
    </Section>
  );
}

import { RichText } from "@payloadcms/richtext-lexical/react";
import type { AlertBoxBlock as AlertBoxBlockProps } from "../../payload-types";
import { BlockThemeScope, ColorScope, Container, Heading, Section, Status, normalizeStatusVariant } from "../../components/ui";
import type { EditorialColorOverrides } from "../../lib/theme/block-color-theme";
import { BlockLink } from "../shared/BlockLink";

type AlertBoxType = "info" | "success" | "warning" | "danger";
type AlertBoxTone = "default" | "muted" | "surface";

type AlertBoxWithAppearanceProps = Omit<AlertBoxBlockProps, "appearance"> & {
  appearance?: {
    colors?: EditorialColorOverrides | null;
    scheme?: "custom" | AlertBoxTone | string | null;
  } | null;
};

export function normalizeAlertBoxType(
  type: AlertBoxBlockProps["type"] | string | null | undefined,
): AlertBoxType {
  return normalizeStatusVariant(type);
}

export function normalizeAlertBoxTone(tone?: string | null): AlertBoxTone {
  if (tone === "default" || tone === "muted") return tone;
  return "surface";
}

export function AlertBoxBlock({
  appearance,
  content,
  link,
  title,
  type,
}: AlertBoxWithAppearanceProps) {
  const variant = normalizeAlertBoxType(type);
  const customTheme = appearance?.scheme === "custom";
  const effectiveTone = normalizeAlertBoxTone(appearance?.scheme);

  const alert = (
    <ColorScope scheme={customTheme ? "default" : effectiveTone}>
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
  );

  return (
    <Section spacing="sm" scheme="default">
      <Container size="md">
        {customTheme
          ? <BlockThemeScope palette={appearance?.colors}>{alert}</BlockThemeScope>
          : alert}
      </Container>
    </Section>
  );
}

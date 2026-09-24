import type { ActionBannersBlock as ActionBannersBlockProps } from "../../payload-types";
import { BlockThemeScope, Card, Container, Heading, Section, Text } from "../../components/ui";
import type { EditorialColorOverrides } from "../../lib/theme/block-color-theme";
import { BlockLink } from "../shared/BlockLink";

type ActionBannersVariant = "grid" | "stacked";
type ActionBannerAppearance = "accent" | "brand" | "surface";
type ActionBannersTone = "default" | "muted" | "surface";

type ActionBannersWithAppearanceProps = Omit<ActionBannersBlockProps, "appearance"> & {
  appearance?: {
    colors?: EditorialColorOverrides | null;
    scheme?: "custom" | ActionBannersTone | string | null;
  } | null;
};

const bannerStyles = {
  accent: {
    cardTone: "accent",
    linkAppearance: "solid",
  },
  brand: {
    cardTone: "brand",
    linkAppearance: "solid",
  },
  surface: {
    cardTone: "surface",
    linkAppearance: "solid",
  },
} as const;

export function normalizeActionBannersVariant(
  variant: ActionBannersBlockProps["variant"] | string | null | undefined,
): ActionBannersVariant {
  return variant === "stacked" ? "stacked" : "grid";
}

export function normalizeActionBannerAppearance(
  appearance: ActionBannersBlockProps["banners"][number]["appearance"] | string | null | undefined,
): ActionBannerAppearance {
  if (appearance === "brand" || appearance === "accent") return appearance;
  return "surface";
}

export function normalizeActionBannersTone(tone?: string | null): ActionBannersTone {
  if (tone === "surface" || tone === "muted") return tone;
  return "default";
}

export function ActionBannersBlock({
  appearance,
  banners,
  title,
  variant,
}: ActionBannersWithAppearanceProps) {
  const normalizedVariant = normalizeActionBannersVariant(variant);
  const customTheme = appearance?.scheme === "custom";
  const effectiveTone = normalizeActionBannersTone(appearance?.scheme);

  const section = (
    <Section spacing="md" scheme={customTheme ? "default" : effectiveTone}>
      <Container size="lg">
        {title ? (
          <Heading level={2} size="lg">
            <span className="text-balance break-words">{title}</span>
          </Heading>
        ) : null}
        <ul
          className={`grid gap-5 ${title ? "mt-8" : ""} ${
            normalizedVariant === "grid" ? "lg:grid-cols-3" : ""
          }`}
        >
          {banners.map((banner) => {
            const styles = bannerStyles[normalizeActionBannerAppearance(banner.appearance)];

            return (
              <li key={banner.id}>
                <Card fullHeight padding="lg" scheme={styles.cardTone}>
                  <Heading level={3} size="md">
                    <span className="break-words">{banner.title}</span>
                  </Heading>
                  {banner.description ? (
                    <div className="mt-3">
                      <Text>{banner.description}</Text>
                    </div>
                  ) : null}
                  <div className="mt-auto pt-6">
                    <BlockLink
                      appearance={styles.linkAppearance}
                      link={banner.button}
                    />
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );

  return customTheme
    ? <BlockThemeScope palette={appearance?.colors}>{section}</BlockThemeScope>
    : section;
}

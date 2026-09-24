import type { Media } from "../../payload-types";
import { BlockThemeScope, Container, Heading, Section } from "../../components/ui";
import {
  normalizeColorScheme,
  type EditorialColorOverrides,
} from "../../lib/theme/block-color-theme";
import { GalleryLightbox } from "./GalleryLightbox";

export type GalleryColumns = "2" | "3" | "4" | "8";
export type GalleryPreset = "grid";
export type GalleryThumbnailEffect = "grow" | "none";
export type GalleryInteraction = "none" | "subtle" | "default" | "emphasized";

export type GalleryItem = {
  caption?: string | null;
  id?: string | null;
  media: number | Media;
};

export type GalleryBlockProps = {
  appearance?: {
    colors?: EditorialColorOverrides | null;
    interaction?: GalleryInteraction | string | null;
    scheme?: "custom" | string | null;
    spacing?: "compact" | "default" | "spacious" | string | null;
  } | null;
  blockType: "gallery";
  id?: string | null;
  images?: GalleryItem[] | null;
  layout?: {
    columns?: GalleryColumns | string | null;
    preset?: GalleryPreset | string | null;
    thumbnailEffect?: GalleryThumbnailEffect | string | null;
  } | null;
  title?: string | null;
};

export function normalizeGallerySpacing(
  spacing?: string | null,
): "compact" | "default" | "spacious" {
  if (spacing === "compact" || spacing === "spacious") return spacing;
  return "default";
}

export function normalizeGalleryInteraction(
  interaction?: string | null,
): GalleryInteraction {
  if (
    interaction === "none" ||
    interaction === "subtle" ||
    interaction === "emphasized"
  ) {
    return interaction;
  }
  return "default";
}

export function normalizeGalleryColumns(
  columns: GalleryColumns | string | null | undefined,
): GalleryColumns {
  if (columns === "2" || columns === "3" || columns === "8") return columns;
  return "4";
}

export function normalizeGalleryPreset(
  preset: GalleryPreset | string | null | undefined,
): GalleryPreset {
  return preset === "grid" ? "grid" : "grid";
}

export function normalizeGalleryThumbnailEffect(
  effect: GalleryThumbnailEffect | string | null | undefined,
): GalleryThumbnailEffect {
  return effect === "none" ? "none" : "grow";
}

export function GalleryBlock({ appearance, images, layout, title }: GalleryBlockProps) {
  const usableImages =
    images?.filter((item) => item.media && typeof item.media === "object" && item.media.url) ?? [];

  if (!usableImages.length) return null;

  const columns = normalizeGalleryColumns(layout?.columns);
  const preset = normalizeGalleryPreset(layout?.preset);
  const thumbnailEffect = normalizeGalleryThumbnailEffect(layout?.thumbnailEffect);
  const interaction = normalizeGalleryInteraction(appearance?.interaction);
  const spacing = normalizeGallerySpacing(appearance?.spacing);
  const customTheme = appearance?.scheme === "custom";

  const section = (
    <Section
      spacing={spacing}
      scheme={customTheme ? "default" : normalizeColorScheme(appearance?.scheme)}
    >
      <Container size="lg">
        {title ? (
          <div className="mb-8">
            <Heading level={2} size="lg">
              <span className="text-balance break-words">{title}</span>
            </Heading>
          </div>
        ) : null}
        <GalleryLightbox
          columns={columns}
          images={usableImages}
          interaction={interaction}
          preset={preset}
          thumbnailEffect={thumbnailEffect}
        />
      </Container>
    </Section>
  );

  return customTheme
    ? <BlockThemeScope palette={appearance?.colors}>{section}</BlockThemeScope>
    : section;
}

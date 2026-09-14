import type { Media } from "../../payload-types";
import { Container, Heading, Section } from "../../components/ui";
import { GalleryLightbox } from "./GalleryLightbox";

export type GalleryColumns = "2" | "3" | "4";
export type GalleryPreset = "grid";
export type GalleryThumbnailEffect = "grow" | "none";

export type GalleryItem = {
  caption?: string | null;
  id?: string | null;
  media: number | Media;
};

export type GalleryBlockProps = {
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

export function normalizeGalleryColumns(
  columns: GalleryColumns | string | null | undefined,
): GalleryColumns {
  if (columns === "2" || columns === "4") return columns;
  return "3";
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

export function GalleryBlock({ images, layout, title }: GalleryBlockProps) {
  const usableImages =
    images?.filter((item) => item.media && typeof item.media === "object" && item.media.url) ?? [];

  if (!usableImages.length) return null;

  const columns = normalizeGalleryColumns(layout?.columns);
  const preset = normalizeGalleryPreset(layout?.preset);
  const thumbnailEffect = normalizeGalleryThumbnailEffect(layout?.thumbnailEffect);

  return (
    <Section spacing="default" tone="default">
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
          preset={preset}
          thumbnailEffect={thumbnailEffect}
        />
      </Container>
    </Section>
  );
}

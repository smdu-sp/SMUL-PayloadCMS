import type { Media, Page } from "../../payload-types";
import { Container, Heading, Section } from "../../components/ui";
import { CarouselClient } from "./CarouselClient";

export type CarouselSlidesPerView = "1" | "2" | "3";
export type CarouselNavigation = "arrows" | "arrows-dots";
export type CarouselAutoplay = "off" | "on";

export type CarouselLink = {
  label?: string | null;
  newTab?: boolean | null;
  page?: (number | null) | Page;
  type?: "external" | "internal" | null;
  url?: string | null;
};

export type CarouselItem = {
  description?: string | null;
  id?: string | null;
  image: number | Media;
  link?: CarouselLink | null;
  title?: string | null;
};

export type CarouselBlockProps = {
  behavior?: {
    autoplay?: CarouselAutoplay | string | null;
  } | null;
  blockType: "carousel";
  display?: {
    navigation?: CarouselNavigation | string | null;
    slidesPerView?: CarouselSlidesPerView | string | null;
  } | null;
  id?: string | null;
  items?: CarouselItem[] | null;
  title?: string | null;
};

export function normalizeCarouselSlidesPerView(
  slidesPerView: CarouselSlidesPerView | string | null | undefined,
): CarouselSlidesPerView {
  if (slidesPerView === "2" || slidesPerView === "3") return slidesPerView;
  return "1";
}

export function normalizeCarouselNavigation(
  navigation: CarouselNavigation | string | null | undefined,
): CarouselNavigation {
  return navigation === "arrows" ? "arrows" : "arrows-dots";
}

export function normalizeCarouselAutoplay(
  autoplay: CarouselAutoplay | string | null | undefined,
): CarouselAutoplay {
  return autoplay === "on" ? "on" : "off";
}

export function CarouselBlock({
  behavior,
  display,
  items,
  title,
}: CarouselBlockProps) {
  const usableItems =
    items?.filter((item) => item.image && typeof item.image === "object" && item.image.url) ?? [];

  if (!usableItems.length) return null;

  return (
    <Section spacing="default" scheme="default">
      <Container size="lg">
        {title ? (
          <div className="mb-8">
            <Heading level={2} size="lg">
              <span className="text-balance break-words">{title}</span>
            </Heading>
          </div>
        ) : null}
        <CarouselClient
          autoplay={normalizeCarouselAutoplay(behavior?.autoplay)}
          items={usableItems}
          navigation={normalizeCarouselNavigation(display?.navigation)}
          slidesPerView={normalizeCarouselSlidesPerView(display?.slidesPerView)}
        />
      </Container>
    </Section>
  );
}

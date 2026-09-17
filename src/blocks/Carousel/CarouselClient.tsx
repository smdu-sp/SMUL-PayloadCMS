"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Media } from "../../payload-types";
import { Card, Heading, Text } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import { BlockLink } from "../shared/BlockLink";
import { MediaImage } from "../shared/MediaImage";
import type {
  CarouselAutoplay,
  CarouselItem,
  CarouselNavigation,
  CarouselSlidesPerView,
} from "./Component";

const autoplayDelayMs = 600;

const slideWidthClasses: Record<CarouselSlidesPerView, string> = {
  "1": "basis-full",
  "2": "basis-full md:basis-1/2",
  "3": "basis-full md:basis-1/2 lg:basis-1/3",
};

type CarouselClientProps = {
  autoplay: CarouselAutoplay;
  items: CarouselItem[];
  navigation: CarouselNavigation;
  slidesPerView: CarouselSlidesPerView;
};

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      const onChange = () => onStoreChange();

      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () =>
      typeof window === "undefined"
        ? false
        : window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function CarouselClient({
  autoplay,
  items,
  navigation,
  slidesPerView,
}: CarouselClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const carouselId = useId();
  const trackRef = useRef<HTMLUListElement | null>(null);
  const slideRefs = useRef<Array<HTMLLIElement | null>>([]);
  const hasMultiple = items.length > 1;
  const showDots = navigation === "arrows-dots" && hasMultiple;
  const canAutoplay = autoplay === "on" && hasMultiple && !reducedMotion;
  const isRotationActive = canAutoplay && !userInteracted;

  const scrollToSlide = useCallback((index: number, behavior: ScrollBehavior) => {
    const track = trackRef.current;
    const slide = slideRefs.current[index];
    if (!track || !slide) return;

    track.scrollTo({
      behavior,
      left: slide.offsetLeft - track.offsetLeft,
    });
  }, []);

  const goTo = useCallback((index: number, userAction = false) => {
    if (userAction) {
      setUserInteracted(true);
    }

    setActiveIndex(index);
    scrollToSlide(index, userAction ? "smooth" : "smooth");
  }, [scrollToSlide]);

  const goToPrevious = useCallback((userAction = false) => {
    setActiveIndex((current) => {
      const nextIndex = (current - 1 + items.length) % items.length;
      if (userAction) {
        setUserInteracted(true);
      }
      scrollToSlide(nextIndex, "smooth");
      return nextIndex;
    });
  }, [items.length, scrollToSlide]);

  const goToNext = useCallback((userAction = false) => {
    setActiveIndex((current) => {
      const nextIndex = (current + 1) % items.length;
      if (userAction) {
        setUserInteracted(true);
      }
      scrollToSlide(nextIndex, "smooth");
      return nextIndex;
    });
  }, [items.length, scrollToSlide]);

  useEffect(() => {
    if (!isRotationActive) return;

    const interval = window.setInterval(() => {
      goToNext(false);
    }, autoplayDelayMs);

    return () => window.clearInterval(interval);
  }, [goToNext, isRotationActive]);

  const instructions = useMemo(() => {
    if (!hasMultiple) return "Carrossel com um slide.";
    if (autoplay === "on") {
      return "Use os botoes anterior e proximo para navegar pelos slides. A rotacao automatica para quando houver interacao.";
    }
    return "Use os botoes anterior e proximo para navegar pelos slides.";
  }, [autoplay, hasMultiple]);

  return (
    <div
      aria-describedby={`${carouselId}-instructions`}
      aria-label="Carrossel de conteudo"
      aria-roledescription="carousel"
      className="relative"
      role="region"
    >
      <p className="sr-only" id={`${carouselId}-instructions`}>
        {instructions}
      </p>

      <div
        className="relative"
        onFocus={() => {
          if (canAutoplay) {
            setUserInteracted(true);
          }
        }}
      >
        <ul
          className="-ml-4 flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-lg pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={trackRef}
        >
          {items.map((item, index) => {
            const image = item.image as Media;

            return (
              <li
                aria-label={`Slide ${index + 1} de ${items.length}`}
                aria-roledescription="slide"
                className={classNames(
                  "min-w-0 shrink-0 snap-start",
                  slideWidthClasses[slidesPerView],
                )}
                key={item.id ?? `${image.id}-${index}`}
                ref={(element) => {
                  slideRefs.current[index] = element;
                }}
                role="group"
              >
                <div className="h-full pl-4">
                  <Card fullHeight padding="sm" scheme="surface">
                    <article className="flex h-full flex-col">
                      <div className="-m-5 mb-0 overflow-hidden rounded-t-lg bg-muted">
                        <div className="relative aspect-[16/9] w-full">
                          <MediaImage
                            className="object-cover"
                            fill
                            media={image}
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col pt-5">
                        {item.title ? (
                          <Heading level={3} size="md">
                            <span className="break-words">{item.title}</span>
                          </Heading>
                        ) : null}
                        {item.description ? (
                          <div className={item.title ? "mt-3" : ""}>
                            <Text variant="muted">
                              <span className="whitespace-pre-line break-words">
                                {item.description}
                              </span>
                            </Text>
                          </div>
                        ) : null}
                        {item.link?.label ? (
                          <div className="mt-5">
                            <BlockLink link={item.link} />
                          </div>
                        ) : null}
                      </div>
                    </article>
                  </Card>
                </div>
              </li>
            );
          })}
        </ul>

        {hasMultiple ? (
          <>
            <button
              aria-label="Slide anterior"
              className="group absolute left-0 top-0 z-10 hidden h-full cursor-pointer items-center justify-center px-4 focus-visible:outline-none md:flex"
              onClick={() => goToPrevious(true)}
              type="button"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[var(--block-action)] text-lg font-semibold text-[var(--block-action-foreground)] shadow-sm ring-1 ring-border backdrop-blur-sm transition-colors group-hover:underline group-focus-visible:outline focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus">
                {"<"}
              </span>
            </button>
            <button
              aria-label="Proximo slide"
              className="group absolute right-0 top-0 z-10 hidden h-full cursor-pointer items-center justify-center px-4 focus-visible:outline-none md:flex"
              onClick={() => goToNext(true)}
              type="button"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[var(--block-action)] text-lg font-semibold text-[var(--block-action-foreground)] shadow-sm ring-1 ring-border backdrop-blur-sm transition-colors group-hover:underline group-focus-visible:outline focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus">
                {">"}
              </span>
            </button>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:justify-center">
          <div className="flex gap-2 md:hidden">
            <button
              aria-label="Slide anterior"
              className="rounded-md border border-border px-4 py-2 font-semibold text-[var(--block-foreground)] hover:underline focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus"
              onClick={() => goToPrevious(true)}
              type="button"
            >
              Anterior
            </button>
            <button
              aria-label="Proximo slide"
              className="rounded-md border border-border px-4 py-2 font-semibold text-[var(--block-foreground)] hover:underline focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus"
              onClick={() => goToNext(true)}
              type="button"
            >
              Proximo
            </button>
          </div>

          {showDots ? (
            <div aria-label="Indicadores do carrossel" className="flex gap-2" role="group">
              {items.map((item, index) => (
                <button
                  aria-label={`Ir para slide ${index + 1}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                  className={classNames(
                    "h-3 w-3 rounded-full border border-border focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus",
                    activeIndex === index ? "bg-[var(--block-foreground)]" : "border-current bg-transparent",
                  )}
                  key={item.id ?? index}
                  onClick={() => goTo(index, true)}
                  type="button"
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

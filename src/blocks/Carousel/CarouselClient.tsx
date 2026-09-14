"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Media } from "../../payload-types";
import { Heading, Text } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import { BlockLink } from "../shared/BlockLink";
import { MediaImage } from "../shared/MediaImage";
import type {
  CarouselAutoplay,
  CarouselItem,
  CarouselNavigation,
  CarouselSlidesPerView,
} from "./Component";

const autoplayDelayMs = 6000;

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
  const [paused, setPaused] = useState(autoplay !== "on");
  const [userInteracted, setUserInteracted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const carouselId = useId();
  const slideRefs = useRef<Array<HTMLLIElement | null>>([]);
  const hasMultiple = items.length > 1;
  const showDots = navigation === "arrows-dots" && hasMultiple;
  const canAutoplay = autoplay === "on" && hasMultiple && !reducedMotion;
  const isRotationActive = canAutoplay && !paused && !userInteracted;

  const goTo = useCallback((index: number, userAction = false) => {
    if (userAction) {
      setUserInteracted(true);
      setPaused(true);
    }

    setActiveIndex(index);
    slideRefs.current[index]?.scrollIntoView({
      behavior: userAction ? "smooth" : "auto",
      block: "nearest",
      inline: "start",
    });
  }, []);

  const goToPrevious = useCallback((userAction = false) => {
    setActiveIndex((current) => {
      const nextIndex = (current - 1 + items.length) % items.length;
      if (userAction) {
        setUserInteracted(true);
        setPaused(true);
      }
      slideRefs.current[nextIndex]?.scrollIntoView({
        behavior: userAction ? "smooth" : "auto",
        block: "nearest",
        inline: "start",
      });
      return nextIndex;
    });
  }, [items.length]);

  const goToNext = useCallback((userAction = false) => {
    setActiveIndex((current) => {
      const nextIndex = (current + 1) % items.length;
      if (userAction) {
        setUserInteracted(true);
        setPaused(true);
      }
      slideRefs.current[nextIndex]?.scrollIntoView({
        behavior: userAction ? "smooth" : "auto",
        block: "nearest",
        inline: "start",
      });
      return nextIndex;
    });
  }, [items.length]);

  useEffect(() => {
    if (!isRotationActive) return;

    const interval = window.setInterval(() => {
      goToNext(false);
    }, autoplayDelayMs);

    return () => window.clearInterval(interval);
  }, [goToNext, isRotationActive]);

  const instructions = useMemo(() => {
    if (!hasMultiple) return "Carrossel com um slide.";
    return "Use os botoes anterior e proximo para navegar pelos slides.";
  }, [hasMultiple]);

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
        className="overflow-hidden"
        onFocus={() => {
          if (canAutoplay) {
            setUserInteracted(true);
            setPaused(true);
          }
        }}
        onMouseEnter={() => {
          if (canAutoplay) setPaused(true);
        }}
      >
        <ul className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2">
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
                <article className="h-full overflow-hidden rounded-lg border border-border bg-surface">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                    <MediaImage
                      className="object-cover"
                      fill
                      media={image}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <div className="p-5">
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
              </li>
            );
          })}
        </ul>
      </div>

      {hasMultiple ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              aria-label="Slide anterior"
              className="rounded-md border border-border px-4 py-2 font-semibold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus"
              onClick={() => goToPrevious(true)}
              type="button"
            >
              Anterior
            </button>
            <button
              aria-label="Proximo slide"
              className="rounded-md border border-border px-4 py-2 font-semibold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus"
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
                    activeIndex === index ? "bg-primary" : "bg-surface",
                  )}
                  key={item.id ?? index}
                  onClick={() => goTo(index, true)}
                  type="button"
                />
              ))}
            </div>
          ) : null}

          {autoplay === "on" ? (
            <button
              aria-pressed={paused || userInteracted || reducedMotion}
              className="rounded-md border border-border px-4 py-2 font-semibold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus"
              onClick={() => {
                setUserInteracted(false);
                setPaused((current) => !current);
              }}
              type="button"
            >
              {paused || userInteracted || reducedMotion ? "Reproduzir" : "Pausar"}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

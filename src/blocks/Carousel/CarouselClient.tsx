"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Media } from "../../payload-types";
import { Card, Heading, Text } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import { BlockLink } from "../shared/BlockLink";
import { MediaImage } from "../shared/MediaImage";
import type { CarouselAutoplay, CarouselItem, CarouselNavigation, CarouselSlidesPerView } from "./Component";

const AUTOPLAY_DELAY_MS = 600;

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
    () => (typeof window === "undefined" ? false : window.matchMedia("(prefers-reduced-motion: reduce)").matches),
    () => false,
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <rect height="16" rx="1" width="4" x="6" y="4" />
      <rect height="16" rx="1" width="4" x="14" y="4" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

export function CarouselClient({ autoplay, items, navigation, slidesPerView }: CarouselClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoplay === "on");

  const reducedMotion = usePrefersReducedMotion();
  const carouselId = useId();
  const trackRef = useRef<HTMLUListElement | null>(null);
  const slideRefs = useRef<Array<HTMLLIElement | null>>([]);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasMultiple = items.length > 1;
  const showDots = navigation === "arrows-dots" && hasMultiple;
  const canAutoplay = autoplay === "on" && hasMultiple && !reducedMotion;
  const isRotationActive = canAutoplay && isPlaying && !isHovered && !isFocused;

  const scrollToSlide = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const slide = slideRefs.current[index];
      if (!track || !slide) return;

      isProgrammaticScroll.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      track.scrollTo({
        behavior: reducedMotion ? "auto" : "smooth",
        left: slide.offsetLeft - track.offsetLeft,
      });

      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 400);
    },
    [reducedMotion],
  );

  const goTo = useCallback(
    (index: number, userAction = false) => {
      if (userAction) {
        setUserInteracted(true);
      }
      setActiveIndex(index);
      scrollToSlide(index);
    },
    [scrollToSlide],
  );

  const goToPrevious = useCallback(
    (userAction = false) => {
      if (userAction) {
        setUserInteracted(true);
      }
      setActiveIndex((current) => {
        const nextIndex = (current - 1 + items.length) % items.length;
        scrollToSlide(nextIndex);
        return nextIndex;
      });
    },
    [items.length, scrollToSlide],
  );

  const goToNext = useCallback(
    (userAction = false) => {
      if (userAction) {
        setUserInteracted(true);
      }
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % items.length;
        scrollToSlide(nextIndex);
        return nextIndex;
      });
    },
    [items.length, scrollToSlide],
  );

  // Sync scroll position when user swipes / scrolls manually
  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current) return;
    const track = trackRef.current;
    if (!track) return;

    const scrollLeft = track.scrollLeft;
    let closestIndex = 0;
    let minDistance = Infinity;

    slideRefs.current.forEach((slide, idx) => {
      if (!slide) return;
      const distance = Math.abs(slide.offsetLeft - track.offsetLeft - scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
      setUserInteracted(true);
    }
  }, [activeIndex]);

  // Autoplay timer
  useEffect(() => {
    if (!isRotationActive) return;

    const interval = window.setInterval(() => {
      goToNext(false);
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearInterval(interval);
  }, [goToNext, isRotationActive]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultiple) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToPrevious(true);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goToNext(true);
    }
  };

  const instructions = useMemo(() => {
    if (!hasMultiple) return "Carrossel com um slide.";
    if (autoplay === "on") {
      return "Use as teclas de seta esquerda e direita ou os botões para navegar pelos slides. A rotação automática pode ser pausada pelo botão de controle.";
    }
    return "Use as teclas de seta esquerda e direita ou os botões para navegar pelos slides.";
  }, [autoplay, hasMultiple]);

  return (
    <div
      aria-describedby={`${carouselId}-instructions`}
      aria-label="Carrossel de conteúdo"
      aria-roledescription="carousel"
      className="relative focus-visible:outline-none"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsFocused(false);
        }
      }}
      onFocus={() => setIsFocused(true)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      tabIndex={0}
    >
      <p className="sr-only" id={`${carouselId}-instructions`}>
        {instructions}
      </p>

{/* Screen reader live announcement for manual navigation */}
      <div aria-atomic="true" aria-live={userInteracted ? "polite" : "off"} className="sr-only">
        {`Slide ${activeIndex + 1} de ${items.length}: ${items[activeIndex]?.title || "Slide sem título"}`}
      </div>

      <div
        className="relative"
        onFocus={() => {
          if (canAutoplay) {
            setUserInteracted(true);
          }
        }}
      >
        <ul
          className="-ml-4 flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-lg pb-2 motion-reduce:scroll-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={handleScroll}
          ref={trackRef}
        >
          {items.map((item, index) => {
            const image = item.image as Media;

            return (
              <li
                aria-label={`Slide ${index + 1} de ${items.length}`}
                aria-roledescription="slide"
                className={classNames("min-w-0 shrink-0 snap-start", slideWidthClasses[slidesPerView])}
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
                          <MediaImage className="object-cover" fill media={image} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
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
                              <span className="whitespace-pre-line break-words">{item.description}</span>
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

        {/* Desktop floating side navigation arrows */}
        {hasMultiple ? (
          <>
            <button
              aria-label="Slide anterior"
              className="absolute left-1 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 p-2.5 text-foreground shadow-md ring-1 ring-border backdrop-blur-sm transition-all hover:bg-surface hover:scale-110 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus md:flex"
              onClick={() => goToPrevious(true)}
              type="button"
            >
<ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              aria-label="Próximo slide"
              className="absolute right-1 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 p-2.5 text-foreground shadow-md ring-1 ring-border backdrop-blur-sm transition-all hover:bg-surface hover:scale-110 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus md:flex"
              onClick={() => goToNext(true)}
              type="button"
            >
<ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {/* Controls Bar: Prev/Next on mobile, Dots and Play/Pause */}
      {hasMultiple ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          {/* Mobile navigation buttons */}
          <div className="flex gap-2 md:hidden">
            <button
              aria-label="Slide anterior"
className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm hover:bg-muted focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus"
              onClick={() => goToPrevious(true)}
              type="button"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span>Anterior</span>
            </button>
            <button
aria-label="Próximo slide"
              className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm hover:bg-muted focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus"
              onClick={() => goToNext(true)}
              type="button"
            >
              <span>Próximo</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Dots indicators */}
          {showDots ? (
            <div aria-label="Indicadores do carrossel" className="flex items-center gap-2" role="group">
              {items.map((item, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`Ir para slide ${index + 1} de ${items.length}${isActive ? ", atual" : ""}`}
                    className={classNames(
                      "h-3 rounded-full border border-border transition-all duration-300 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus",
                      isActive ? "w-7 bg-primary" : "w-3 bg-surface hover:bg-muted",
                    )}
                    key={item.id ?? index}
                    onClick={() => goTo(index, true)}
                    type="button"
                  />
                );
              })}
            </div>
          ) : null}

          {/* WCAG 2.2.2 Pause/Play button (available when autoplay is configured) */}
          {canAutoplay ? (
            <button
              aria-label={isPlaying ? "Pausar rotação automática" : "Iniciar rotação automática"}
              className="inline-flex items-center justify-center rounded-md border border-border bg-surface p-1.5 text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus"
              onClick={() => setIsPlaying((prev) => !prev)}
              title={isPlaying ? "Pausar rotação automática" : "Iniciar rotação automática"}
              type="button"
            >
              {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

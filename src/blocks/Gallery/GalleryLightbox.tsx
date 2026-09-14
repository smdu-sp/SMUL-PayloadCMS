"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Media } from "../../payload-types";
import { Text } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import { MediaImage } from "../shared/MediaImage";
import type { GalleryColumns, GalleryItem, GalleryPreset } from "./Component";

type GalleryLightboxProps = {
  columns: GalleryColumns;
  images: GalleryItem[];
  preset: GalleryPreset;
};

const columnClasses: Record<GalleryColumns, string> = {
  "2": "sm:grid-cols-2",
  "3": "sm:grid-cols-2 lg:grid-cols-3",
  "4": "sm:grid-cols-2 lg:grid-cols-4",
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function mediaLabel(item: GalleryItem, index: number): string {
  const media = item.media as Media;
  return item.caption || media.alt || `Imagem ${index + 1}`;
}

export function GalleryLightbox({ columns, images }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const activeItem = activeIndex === null ? null : images[activeIndex];
  const hasMultiple = images.length > 1;
  const isOpen = activeIndex !== null;

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrevious = useCallback(() =>
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + images.length) % images.length,
    ), [images.length]);
  const showNext = useCallback(() =>
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % images.length,
    ), [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "ArrowLeft" && hasMultiple) {
        event.preventDefault();
        showPrevious();
        return;
      }

      if (event.key === "ArrowRight" && hasMultiple) {
        event.preventDefault();
        showNext();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus();
    };
  }, [close, hasMultiple, isOpen, showNext, showPrevious]);

  return (
    <>
      <ul className={classNames("grid gap-4", columnClasses[columns])}>
        {images.map((item, index) => {
          const media = item.media as Media;
          const label = mediaLabel(item, index);

          return (
            <li key={item.id ?? `${media.id}-${index}`}>
              <button
                aria-label={`Abrir imagem ampliada: ${label}`}
                className="group block w-full overflow-hidden rounded-lg border border-border bg-muted text-left transition hover:border-primary focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus"
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setActiveIndex(index);
                }}
                type="button"
              >
                <span className="relative block aspect-[4/3] w-full overflow-hidden">
                  <MediaImage
                    className="object-cover transition duration-200 group-hover:scale-[1.03]"
                    fill
                    media={media}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </span>
                {item.caption ? (
                  <span className="block bg-surface px-4 py-3 text-sm leading-normal text-muted-foreground">
                    {item.caption}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {activeItem && activeIndex !== null ? (
        <div
          aria-labelledby={titleId}
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/90 p-4 text-secondary-foreground"
          ref={dialogRef}
          role="dialog"
          tabIndex={-1}
        >
          <div className="flex max-h-full w-full max-w-6xl flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold" id={titleId}>
                Imagem {activeIndex + 1} de {images.length}
              </h2>
              <button
                aria-label="Fechar galeria"
                className="rounded-md border border-secondary-foreground/40 px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary-foreground/10 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus"
                onClick={close}
                type="button"
              >
                Fechar
              </button>
            </div>

            <div className="grid min-h-0 items-center gap-4 md:grid-cols-[auto_1fr_auto]">
              {hasMultiple ? (
                <button
                  aria-label="Imagem anterior"
                  className="rounded-md border border-secondary-foreground/40 px-4 py-3 font-semibold hover:bg-secondary-foreground/10 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus"
                  onClick={showPrevious}
                  type="button"
                >
                  Anterior
                </button>
              ) : null}

              <figure className="min-h-0">
                <div className="relative mx-auto h-[70vh] max-h-[70vh] min-h-64 w-full overflow-hidden rounded-lg bg-black/30">
                  <MediaImage
                    className="object-contain"
                    fill
                    media={activeItem.media}
                    sizes="100vw"
                  />
                </div>
                {activeItem.caption ? (
                  <figcaption className="mt-3">
                    <Text tone="inverse" variant="small">
                      <span className="whitespace-pre-line break-words">
                        {activeItem.caption}
                      </span>
                    </Text>
                  </figcaption>
                ) : null}
              </figure>

              {hasMultiple ? (
                <button
                  aria-label="Proxima imagem"
                  className="rounded-md border border-secondary-foreground/40 px-4 py-3 font-semibold hover:bg-secondary-foreground/10 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus"
                  onClick={showNext}
                  type="button"
                >
                  Proxima
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

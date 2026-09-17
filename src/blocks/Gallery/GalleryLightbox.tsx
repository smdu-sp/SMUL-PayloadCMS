"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Media } from "../../payload-types";
import { MediaColorScope, Text } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import { MediaImage } from "../shared/MediaImage";
import type {
  GalleryColumns,
  GalleryItem,
  GalleryPreset,
  GalleryThumbnailEffect,
} from "./Component";

type GalleryLightboxProps = {
  columns: GalleryColumns;
  images: GalleryItem[];
  preset: GalleryPreset;
  thumbnailEffect: GalleryThumbnailEffect;
};

const columnClasses: Record<GalleryColumns, string> = {
  "2": "grid-cols-2",
  "3": "grid-cols-2 md:grid-cols-3",
  "4": "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  "8": "grid-cols-2 sm:grid-cols-4 lg:grid-cols-8",
};

// Para adicionar efeitos, inclua o valor no schema do GalleryBlock,
// normalize em Component.tsx e registre aqui as classes aplicadas a miniatura.
const thumbnailEffectClasses: Record<GalleryThumbnailEffect, string> = {
  grow: "transition-transform duration-700 ease-out group-hover:scale-[1.03]",
  none: "",
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

export function GalleryLightbox({
  columns,
  images,
  thumbnailEffect,
}: GalleryLightboxProps) {
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
      <ul className={classNames("grid gap-0.5 sm:gap-0.5", columnClasses[columns])}>
        {images.map((item, index) => {
          const media = item.media as Media;
          const label = mediaLabel(item, index);

          return (
            <li key={item.id ?? `${media.id}-${index}`}>
              <button
                aria-label={`Abrir imagem ampliada: ${label}`}
                className="group block w-full overflow-hidden rounded-lg border border-border bg-transparent text-left focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus"
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setActiveIndex(index);
                }}
                type="button"
              >
                <span
                  className={classNames(
                    "relative block aspect-square w-full overflow-hidden sm:aspect-[4/3]",
                    thumbnailEffectClasses[thumbnailEffect],
                  )}
                >
                  <MediaImage
                    className="object-cover"
                    fill
                    media={media}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {activeItem && activeIndex !== null ? (
        <MediaColorScope mode="dark" paint={false}>
        <div
          aria-labelledby={titleId}
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 text-white backdrop-blur-md"
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
                className="rounded-md border border-white/50 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white"
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
                  className="rounded-md border border-white/50 px-4 py-3 font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white"
                  onClick={showPrevious}
                  type="button"
                >
                  Anterior
                </button>
              ) : null}

              <figure className="min-h-0">
                <div className="relative mx-auto h-[70vh] max-h-[70vh] min-h-64 w-full overflow-hidden">
                  <MediaImage
                    className="object-contain"
                    fill
                    media={activeItem.media}
                    sizes="100vw"
                  />
                </div>
                {activeItem.caption ? (
                  <figcaption className="mt-3 text-center">
                    <Text variant="small">
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
                  className="rounded-md border border-white/50 px-4 py-3 font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white"
                  onClick={showNext}
                  type="button"
                >
                  Proxima
                </button>
              ) : null}
            </div>
          </div>
        </div>
        </MediaColorScope>
      ) : null}
    </>
  );
}

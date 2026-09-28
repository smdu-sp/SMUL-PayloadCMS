"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./RichTextFullScreen.module.css";

export function RichTextFullScreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    const rootEl = containerRef.current?.closest(".rich-text-lexical");
    if (!rootEl) return;

    if (isFullscreen) {
      rootEl.classList.add("is-fullscreen-editor");
      document.body.classList.add("has-fullscreen-rich-text");
    } else {
      rootEl.classList.remove("is-fullscreen-editor");
      document.body.classList.remove("has-fullscreen-rich-text");
    }

    return () => {
      rootEl.classList.remove("is-fullscreen-editor");
      document.body.classList.remove("has-fullscreen-rich-text");
    };
  }, [isFullscreen]);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <button
        type="button"
        className={`${styles.button} ${isFullscreen ? styles.exitButton : ""}`}
        onClick={() => setIsFullscreen((prev) => !prev)}
        aria-pressed={isFullscreen}
        title={isFullscreen ? "Sair da tela cheia (Esc)" : "Expandir para tela cheia (estilo Word / Google Docs)"}
      >
        {isFullscreen ? (
          <>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span>Sair da Tela Cheia</span>
            <kbd className={styles.kbd}>Esc</kbd>
          </>
        ) : (
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            <span>Tela Cheia (Word)</span>
          </>
        )}
      </button>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const FRONTEND_ORIGIN = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';

function getPreviewUrl(slug: string) {
  return `${FRONTEND_ORIGIN}/block-preview/${slug}`;
}

function extractSlug(src: string): string | null {
  if (!src.includes('/live-preview/')) return null;
  const part = src.split('/live-preview/')[1];
  if (!part) return null;
  return part.replace(/\/$/, '').split('?')[0] || null;
}

export function BlockPreviewPopup() {
  const [popup, setPopup] = useState<{
    slug: string;
    title: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const host = target.closest('img, iframe, [data-live-preview-slug]') as HTMLElement | null;
      if (!host) return;

      const slug =
        host.getAttribute('data-live-preview-slug') ||
        extractSlug((host as HTMLImageElement).src || '');

      if (!slug) return;

      const title =
        host.getAttribute('alt') ||
        host.getAttribute('data-live-preview-title') ||
        'Prévia do bloco';

      const rect = host.getBoundingClientRect();
      let x = rect.right + 15;
      let y = rect.top - 20;

      if (x + 820 > window.innerWidth) x = rect.left - 820;
      if (y < 20) y = 20;
      if (y + 500 > window.innerHeight) {
        y = Math.max(10, window.innerHeight - 520);
      }

      clearTimeout(timer);
      timer = setTimeout(() => setPopup({ slug, title, x, y }), 150);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (related?.closest?.('[data-live-preview-slug], img, iframe')) return;
      clearTimeout(timer);
      setPopup(null);
    };

    // Troca as imagens estáticas das miniaturas do Payload por IFrames em tempo real
    const transformThumbnails = () => {
      document
        .querySelectorAll<HTMLImageElement>('img[src*="/live-preview/"]')
        .forEach((img) => {
          const slug = extractSlug(img.src);
          if (!slug) return;

          const parent = img.parentElement;
          if (!parent || parent.querySelector('[data-live-preview-root]')) return;

          img.style.display = 'none';

          const root = document.createElement('div');
          root.setAttribute('data-live-preview-root', 'true');
          root.setAttribute('data-live-preview-slug', slug);
          root.setAttribute('data-live-preview-title', img.alt || 'Prévia do bloco');
          root.style.width = '100%';
          root.style.aspectRatio = '16 / 10';
          root.style.overflow = 'hidden';
          root.style.background = '#f4f4f5';
          root.style.borderRadius = '4px';
          root.style.position = 'relative';

          const iframe = document.createElement('iframe');
          iframe.src = getPreviewUrl(slug);
          iframe.title = img.alt || slug;
          iframe.setAttribute('data-live-preview-slug', slug);
          iframe.style.width = '1440px';
          iframe.style.height = '900px';
          iframe.style.border = 'none';
          iframe.style.transform = 'scale(0.2)';
          iframe.style.transformOrigin = 'top left';
          iframe.style.pointerEvents = 'none';
          iframe.style.background = '#fff';

          root.appendChild(iframe);
          parent.appendChild(root);
        });
    };

    // Recarrega os iframes quando o usuário volta à aba do Admin (útil após atualizar a página Seed)
    const reloadLiveIframes = () => {
      document
        .querySelectorAll<HTMLIFrameElement>('iframe[data-live-preview-slug]')
        .forEach((iframe) => {
          const slug = iframe.getAttribute('data-live-preview-slug');
          if (slug) {
            iframe.src = `${getPreviewUrl(slug)}?t=${Date.now()}`;
          }
        });
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('focus', reloadLiveIframes);

    const observer = new MutationObserver(transformThumbnails);
    observer.observe(document.body, { childList: true, subtree: true });
    transformThumbnails();

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('focus', reloadLiveIframes);
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (!popup) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        left: popup.x,
        top: popup.y,
        zIndex: 999999,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: '#18181b',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 10,
          padding: 6,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.85)',
          width: 800,
          maxWidth: '85vw',
          height: 450,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            borderRadius: 6,
            background: '#fff',
            position: 'relative',
          }}
        >
          <iframe
            src={getPreviewUrl(popup.slug)}
            title={popup.title}
            style={{
              width: 1440,
              height: 820,
              border: 'none',
              transform: 'scale(0.55)',
              transformOrigin: 'top left',
              background: '#fff',
            }}
          />
        </div>
        <div
          style={{
            padding: '6px 10px 2px',
            color: '#f4f4f5',
            fontSize: 12,
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          {popup.title}
        </div>
      </div>
    </div>,
    document.body,
  );
}
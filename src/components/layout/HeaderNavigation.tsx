"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type {
  ResolvedHeaderItem,
  ResolvedHeaderLink,
} from "../../lib/navigation/resolve-header-navigation";
import { ColorScope } from "../ui";

function HeaderSearchForm({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <form
      action="/busca"
      className="flex min-w-0 items-stretch gap-2"
      onSubmit={onNavigate}
      role="search"
    >
      <label className="sr-only" htmlFor="header-search-query">
        Buscar no portal
      </label>
      <input
        className="min-w-0 flex-1 rounded-md border border-border bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-surface-foreground)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:w-48"
        id="header-search-query"
        maxLength={100}
        name="q"
        placeholder="Buscar no portal"
        type="search"
      />
      <button
        className="rounded-md bg-action px-3 py-2 text-sm font-semibold text-action-foreground outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        type="submit"
      >
        Buscar
      </button>
    </form>
  );
}

function HeaderLink({
  link,
  onNavigate,
  pathname,
}: {
  link: ResolvedHeaderLink;
  onNavigate: () => void;
  pathname: string;
}) {
  return (
    <Link
      aria-current={pathname === link.href ? "page" : undefined}
      className="block rounded-sm py-2 font-semibold text-current underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:py-1"
      href={link.href}
      onClick={onNavigate}
      rel={link.rel}
      target={link.target}
    >
      {link.label}
    </Link>
  );
}

export function HeaderNavigation({
  items,
  searchEnabled = false,
}: {
  items: ResolvedHeaderItem[];
  searchEnabled?: boolean;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const categoryButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hasContent = items.length > 0 || searchEnabled;

  const closeNavigation = () => {
    setMobileOpen(false);
    setOpenCategory(null);
  };

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeNavigation();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (openCategory) {
        const trigger = categoryButtonRefs.current[openCategory];
        setOpenCategory(null);
        trigger?.focus();
        return;
      }

      if (mobileOpen) {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, openCategory]);

  if (!hasContent) return null;

  return (
    <div className="relative ml-auto" ref={rootRef}>
      <button
        aria-controls="site-header-navigation"
        aria-expanded={mobileOpen}
        className="rounded-md border border-(--block-border) px-4 py-2 font-semibold outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:hidden"
        onClick={() => {
          setMobileOpen((current) => !current);
          setOpenCategory(null);
        }}
        ref={menuButtonRef}
        type="button"
      >
        Menu
      </button>

      <div
        className={`${mobileOpen ? "flex" : "hidden"} absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(22rem,calc(100vw-2rem))] flex-col gap-4 rounded-lg border border-(--block-border) bg-(--block-background) p-4 shadow-lg lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
        id="site-header-navigation"
      >
        {items.length ? (
          <nav aria-label="Navegação principal">
            <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-x-5">
              {items.map((item, index) => {
                if (item.kind === "link") {
                  return (
                    <li key={item.link.id}>
                      <HeaderLink
                        link={item.link}
                        onNavigate={closeNavigation}
                        pathname={pathname}
                      />
                    </li>
                  );
                }

                const itemKey = `${item.id}-${index}`;
                const submenuId = `header-submenu-${index}`;
                const expanded = openCategory === itemKey;

                return (
                  <li className="relative" key={itemKey}>
                    <button
                      aria-controls={submenuId}
                      aria-expanded={expanded}
                      className="flex w-full items-center justify-between gap-2 rounded-sm py-2 font-semibold text-(--block-foreground) outline-none underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:py-1"
                      onClick={() => setOpenCategory(expanded ? null : itemKey)}
                      ref={(element) => {
                        categoryButtonRefs.current[itemKey] = element;
                      }}
                      type="button"
                    >
                      {item.label}
                      <span aria-hidden="true" className={expanded ? "rotate-180" : undefined}>
                        ▾
                      </span>
                    </button>

                    <ColorScope
                      className="mt-1 min-w-64 rounded-md border border-(--block-border) p-2 shadow-lg lg:absolute lg:left-0 lg:top-full lg:z-50"
                      hidden={!expanded}
                      id={submenuId}
                      scheme="surface"
                    >
                      <ul className="space-y-1">
                        {item.links.map((link) => (
                          <li key={link.id}>
                            <HeaderLink
                              link={link}
                              onNavigate={closeNavigation}
                              pathname={pathname}
                            />
                          </li>
                        ))}
                      </ul>
                    </ColorScope>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}

        {searchEnabled ? <HeaderSearchForm onNavigate={closeNavigation} /> : null}
      </div>
    </div>
  );
}

import Link from "next/link";

import type { Header } from "../../payload-types";
import { resolveLink } from "../../lib/navigation/resolve-link";
import { MediaImage } from "../../blocks/shared/MediaImage";
import { Container } from "../ui";

export function SiteHeader({
  header,
  siteName,
}: {
  header?: Header | null;
  siteName?: string | null;
}) {
  const name = siteName?.trim() || "Portal";
  const navigation = (header?.navigation ?? []).flatMap((item) => {
    const link = resolveLink({ label: item.label, page: item.page, type: "internal" });
    return link ? [link] : [];
  });

  return (
    <header className="border-b border-border bg-background text-foreground">
      <Container size="xl">
        <div className="flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">
          <Link
            aria-label={`${name} — página inicial`}
            className="inline-flex min-w-0 items-center text-lg font-bold text-heading no-underline"
            href="/"
          >
            {header?.logo && typeof header.logo === "object" ? (
              <MediaImage
                className="h-12 w-auto max-w-64 object-contain"
                media={header.logo}
                priority
                sizes="256px"
              />
            ) : (
              <span className="wrap-break-word">{name}</span>
            )}
          </Link>

          {navigation.length ? (
            <nav aria-label="Navegação principal">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {navigation.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link
                      className="font-semibold text-foreground underline-offset-4 hover:underline"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </Container>
    </header>
  );
}

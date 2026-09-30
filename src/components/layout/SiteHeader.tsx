import Link from "next/link";

import { MediaImage } from "../../blocks/shared/MediaImage";
import { resolveHeaderNavigation } from "../../lib/navigation/resolve-header-navigation";
import type { Header } from "../../payload-types";
import { Container } from "../ui";
import { HeaderNavigation } from "./HeaderNavigation";

export function SiteHeader({
  header,
  siteName,
}: {
  header?: Header | null;
  siteName?: string | null;
}) {
  const name = siteName?.trim() || "Portal";
  const navigation = resolveHeaderNavigation(header);

  return (
    <header className="border-b border-border bg-background text-foreground">
      <Container size="xl">
        <div className="flex min-h-20 items-center justify-between gap-4 py-4">
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

          <HeaderNavigation
            items={navigation.items}
            searchEnabled={Boolean(header?.enableSearch)}
          />
        </div>
      </Container>
    </header>
  );
}

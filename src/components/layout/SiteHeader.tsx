import Link from "next/link";

import { MediaImage } from "../../blocks/shared/MediaImage";
import { resolveHeaderNavigation } from "../../lib/navigation/resolve-header-navigation";
import { normalizeColorScheme } from "../../lib/theme/block-color-theme";
import type { Header } from "../../payload-types";
import { BlockThemeScope, ColorScope, Container } from "../ui";
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
  const customTheme = header?.appearance?.scheme === "custom";

  const content = (
    <ColorScope
      as="header"
      className="border-b border-(--block-border)"
      scheme={customTheme ? "default" : normalizeColorScheme(header?.appearance?.scheme)}
    >
      <Container size="xl">
        <div className="flex min-h-20 items-center justify-between gap-4 py-4">
          <Link
            aria-label={`${name} — página inicial`}
            className="inline-flex min-w-0 items-center text-lg font-bold text-(--block-heading) no-underline"
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
    </ColorScope>
  );

  return customTheme
    ? <BlockThemeScope palette={header?.appearance?.colors}>{content}</BlockThemeScope>
    : content;
}

import type { Metadata } from "next";
import { draftMode } from "next/headers";

import type { Page } from "../../payload-types";
import { getPage, getSiteSettings, resolvePageMetadata } from "./get-page";

export async function getPageRouteState(
  slug: string,
): Promise<{ page: Page | null; draft: boolean }> {
  const { isEnabled } = await draftMode();
  return { page: await getPage(slug, { draft: isEnabled }), draft: isEnabled };
}

export async function getPageRouteMetadata(slug: string): Promise<Metadata> {
  const { page, draft } = await getPageRouteState(slug);

  if (!page) return {};

  const siteSettings = await getSiteSettings();
  return resolvePageMetadata(page, siteSettings, { draft });
}

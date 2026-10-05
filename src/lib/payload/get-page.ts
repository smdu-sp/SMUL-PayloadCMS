import { getPayload } from "payload";

import config from "@payload-config";
import type { Page, SiteSetting } from "../../payload-types";
import { pageSlugToPath } from "../../domain/slug";
import { generatePageMetadata } from "../seo/metadata";

type GetPageOptions = {
  draft?: boolean;
};

export const activeLifecycleWhere = {
  lifecycleStatus: {
    equals: "active",
  },
} as const;

export const buildPageLookupWhere = (
  slug: string,
  { draft = false }: GetPageOptions = {},
) => ({
  ...activeLifecycleWhere,
  slug: {
    equals: slug,
  },
  ...(draft
    ? {}
    : {
        _status: {
          equals: "published",
        },
      }),
});

export async function getPage(
  slug: string,
  { draft = false }: GetPageOptions = {},
): Promise<Page | null> {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "pages",
    depth: 2,
    draft,
    limit: 1,
    // Draft Mode is enabled only by the permission-protected preview routes.
    // Public reads still execute the Pages access policy.
    overrideAccess: draft,
    where: buildPageLookupWhere(slug, { draft }),
  });

  return result.docs[0] ?? null;
}

export async function getSiteSettings(): Promise<SiteSetting | null> {
  const payload = await getPayload({ config });

  try {
    return await payload.findGlobal({
      slug: "site-settings",
      depth: 2,
      overrideAccess: false,
    });
  } catch {
    return null;
  }
}

export const resolvePageMetadata = generatePageMetadata;

export async function getPublishedPagesForSitemap(): Promise<Page[]> {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "pages",
    depth: 0,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    where: {
      ...activeLifecycleWhere,
      _status: {
        equals: "published",
      },
      "seo.noIndex": {
        not_equals: true,
      },
    },
  });

  return result.docs;
}

export const pageUrl = (slug: string, baseUrl: string): string =>
  new URL(pageSlugToPath(slug), baseUrl).toString();

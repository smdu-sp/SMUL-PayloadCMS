import { getPayload, type Where } from "payload";

import config from "@payload-config";
import { pageSlugToPath } from "../../domain/slug";
import type { Page } from "../../payload-types";
import { activeLifecycleWhere } from "./get-page";

export const SEARCH_QUERY_MIN_LENGTH = 2;
export const SEARCH_QUERY_MAX_LENGTH = 100;
export const SEARCH_RESULTS_PER_PAGE = 10;

export type PageSearchResult = {
  description: string | null;
  href: string;
  id: number;
  title: string;
};

export type PageSearchResponse = {
  page: number;
  results: PageSearchResult[];
  totalDocs: number;
  totalPages: number;
};

export function normalizeSearchQuery(value: unknown): string {
  const candidate = Array.isArray(value) ? value[0] : value;
  return typeof candidate === "string"
    ? candidate.trim().replace(/\s+/g, " ").slice(0, SEARCH_QUERY_MAX_LENGTH)
    : "";
}

export function normalizeSearchPage(value: unknown): number {
  const candidate = Array.isArray(value) ? value[0] : value;
  const parsed = typeof candidate === "string" ? Number.parseInt(candidate, 10) : 1;
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function buildPageSearchWhere(query: string): Where {
  return {
    and: [
      activeLifecycleWhere,
      { _status: { equals: "published" } },
      {
        or: [
          { title: { contains: query } },
          { slug: { contains: query } },
          { "seo.metaTitle": { contains: query } },
          { "seo.metaDescription": { contains: query } },
        ],
      },
    ],
  };
}

function mapSearchResult(page: Page): PageSearchResult {
  return {
    description: page.seo?.metaDescription?.trim() || null,
    href: pageSlugToPath(page.slug),
    id: page.id,
    title: page.seo?.metaTitle?.trim() || page.title,
  };
}

export async function searchPublishedPages(
  query: string,
  page = 1,
): Promise<PageSearchResponse> {
  const normalizedQuery = normalizeSearchQuery(query);
  const normalizedPage = normalizeSearchPage(String(page));

  if (normalizedQuery.length < SEARCH_QUERY_MIN_LENGTH) {
    return { page: 1, results: [], totalDocs: 0, totalPages: 0 };
  }

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "pages",
    depth: 0,
    limit: SEARCH_RESULTS_PER_PAGE,
    overrideAccess: false,
    page: normalizedPage,
    sort: "title",
    where: buildPageSearchWhere(normalizedQuery),
  });

  return {
    page: result.page ?? normalizedPage,
    results: result.docs.map(mapSearchResult),
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
  };
}

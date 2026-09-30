import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildPageSearchWhere,
  normalizeSearchPage,
  normalizeSearchQuery,
  SEARCH_QUERY_MAX_LENGTH,
} from "./search-pages";

describe("page search", () => {
  it("normalizes query strings and limits their size", () => {
    assert.equal(normalizeSearchQuery("  regularização   de imóvel  "), "regularização de imóvel");
    assert.equal(normalizeSearchQuery(["orientações", "ignorado"]), "orientações");
    assert.equal(normalizeSearchQuery(null), "");
    assert.equal(normalizeSearchQuery("a".repeat(150)).length, SEARCH_QUERY_MAX_LENGTH);
  });

  it("accepts only positive safe result pages", () => {
    assert.equal(normalizeSearchPage("2"), 2);
    assert.equal(normalizeSearchPage(["3"]), 3);
    assert.equal(normalizeSearchPage("0"), 1);
    assert.equal(normalizeSearchPage("texto"), 1);
  });

  it("always restricts results to active published Pages", () => {
    const where = buildPageSearchWhere("regularização");

    assert.deepEqual(where.and?.[0], {
      lifecycleStatus: { equals: "active" },
    });
    assert.deepEqual(where.and?.[1], {
      _status: { equals: "published" },
    });
    assert.deepEqual(where.and?.[2], {
      or: [
        { title: { contains: "regularização" } },
        { slug: { contains: "regularização" } },
        { "seo.metaTitle": { contains: "regularização" } },
        { "seo.metaDescription": { contains: "regularização" } },
      ],
    });
  });
});

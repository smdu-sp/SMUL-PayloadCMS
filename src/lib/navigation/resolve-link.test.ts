import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Page } from "../../payload-types";
import { resolveLink, resolveLinkHref } from "./resolve-link";

const page = {
  id: 1,
  lifecycleStatus: "active",
  title: "Entenda a lei",
  slug: "entenda-a-lei",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
} satisfies Page;

const inactivePage = {
  ...page,
  lifecycleStatus: "inactive",
} as Page & { lifecycleStatus: "inactive" };

const draftPage = {
  ...page,
  _status: "draft",
} as Page;

describe("navigation link resolver", () => {
  it("resolves internal links from Page relationships", () => {
    assert.equal(
      resolveLinkHref({
        label: "Entenda a lei",
        type: "internal",
        page,
      }),
      "/entenda-a-lei",
    );
  });

  it("does not resolve unresolved relationship ids as hrefs", () => {
    assert.equal(
      resolveLinkHref({
        label: "Entenda a lei",
        type: "internal",
        page: 1,
      }),
      null,
    );
  });

  it("does not resolve internal links to inactive pages", () => {
    assert.equal(
      resolveLinkHref({
        label: "Entenda a lei",
        type: "internal",
        page: inactivePage,
      }),
      null,
    );
  });

  it("does not resolve internal links to draft pages", () => {
    assert.equal(
      resolveLinkHref({
        label: "Entenda a lei",
        type: "internal",
        page: draftPage,
      }),
      null,
    );
  });

  it("resolves external links with safe new-tab attributes", () => {
    assert.deepEqual(
      resolveLink({
        label: "Portal",
        type: "external",
        url: "https://example.com",
        newTab: true,
      }),
      {
        href: "https://example.com",
        label: "Portal",
        rel: "noopener noreferrer",
        target: "_blank",
      },
    );
  });

  it("resolves legacy Global external links without an explicit type", () => {
    assert.deepEqual(
      resolveLink({
        label: "Portal",
        url: "https://example.com",
      }),
      {
        href: "https://example.com",
        label: "Portal",
        rel: undefined,
        target: undefined,
      },
    );
  });

  it("ignores incomplete links", () => {
    assert.equal(resolveLink(null), null);
    assert.equal(resolveLink({ label: "", type: "external", url: "https://example.com" }), null);
    assert.equal(resolveLink({ label: "Sem destino", type: "external" }), null);
  });
});

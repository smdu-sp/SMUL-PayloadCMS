import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Header, Page } from "../../payload-types";
import { resolveHeaderNavigation } from "./resolve-header-navigation";

const activePage = {
  id: 1,
  _status: "published",
  lifecycleStatus: "active",
  slug: "orientacoes",
  title: "Orientações",
} as Page;

const draftPage = {
  ...activePage,
  id: 2,
  _status: "draft",
  slug: "rascunho",
} as Page;

describe("header navigation resolver", () => {
  it("preserves legacy normal navigation and filters unavailable pages", () => {
    const result = resolveHeaderNavigation({
      id: 1,
      navigationMode: "normal",
      navigation: [
        { id: "active", label: " Orientações ", page: activePage },
        { id: "draft", label: "Rascunho", page: draftPage },
      ],
    } as Header);

    assert.equal(result.mode, "normal");
    assert.deepEqual(result.items, [
      {
        kind: "link",
        link: {
          href: "/orientacoes",
          id: "active",
          label: "Orientações",
          rel: undefined,
          target: undefined,
        },
      },
    ]);
  });

  it("resolves direct pages and categorized links without a third level", () => {
    const result = resolveHeaderNavigation({
      id: 1,
      navigationMode: "submenus",
      menuItems: [
        {
          id: "direct",
          type: "page",
          label: "Orientações",
          page: activePage,
        },
        {
          id: "services",
          type: "category",
          label: "Serviços",
          links: [
            { id: "service-active", label: "Como regularizar", page: activePage },
            { id: "service-draft", label: "Rascunho", page: draftPage },
          ],
        },
        {
          id: "empty",
          type: "category",
          label: "Categoria vazia",
          links: [{ id: "only-draft", label: "Rascunho", page: draftPage }],
        },
      ],
    } as Header);

    assert.equal(result.mode, "submenus");
    assert.equal(result.items.length, 2);
    assert.equal(result.items[0]?.kind, "link");
    assert.deepEqual(result.items[1], {
      id: "services",
      kind: "category",
      label: "Serviços",
      links: [
        {
          href: "/orientacoes",
          id: "service-active",
          label: "Como regularizar",
          rel: undefined,
          target: undefined,
        },
      ],
    });
  });

  it("falls back to the legacy menu when submenu data has no valid links", () => {
    const result = resolveHeaderNavigation({
      id: 1,
      navigationMode: "submenus",
      navigation: [{ id: "legacy", label: "Orientações", page: activePage }],
      menuItems: [
        {
          id: "empty",
          type: "category",
          label: "Categoria vazia",
          links: [{ id: "draft", label: "Rascunho", page: draftPage }],
        },
      ],
    } as Header);

    assert.equal(result.mode, "normal");
    assert.equal(result.items[0]?.kind, "link");
  });
});

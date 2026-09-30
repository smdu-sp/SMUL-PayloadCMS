import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Field, TextFieldValidation } from "payload";

import { Footer } from "./Footer";
import { Header } from "./Header";

function fieldByName(fields: Field[], name: string): Field {
  const field = fields.find((candidate) => "name" in candidate && candidate.name === name);
  assert.ok(field, `Expected field ${name}`);
  return field;
}

describe("Header and Footer Globals", () => {
  it("limits Header navigation choices to active published pages", () => {
    const navigation = fieldByName(Header.fields, "navigation");
    assert.ok("fields" in navigation && Array.isArray(navigation.fields));
    const page = fieldByName(navigation.fields, "page");
    assert.equal(page.type, "relationship");
    if (page.type !== "relationship") assert.fail("Expected a relationship field");
    assert.deepEqual(page.filterOptions, {
      _status: { equals: "published" },
      lifecycleStatus: { equals: "active" },
    });
  });

  it("supports a backwards-compatible submenu mode with controlled depth", () => {
    const mode = fieldByName(Header.fields, "navigationMode");
    const search = fieldByName(Header.fields, "enableSearch");
    const navigation = fieldByName(Header.fields, "navigation");
    const menuItems = fieldByName(Header.fields, "menuItems");

    assert.equal(mode.type, "select");
    assert.equal("defaultValue" in mode ? mode.defaultValue : undefined, "normal");
    assert.equal(search.type, "checkbox");
    assert.equal("defaultValue" in search ? search.defaultValue : undefined, false);
    assert.equal(navigation.admin?.condition?.({ navigationMode: "normal" }, {}, {} as never), true);
    assert.equal(navigation.admin?.condition?.({ navigationMode: "submenus" }, {}, {} as never), false);
    assert.equal(menuItems.type, "array");
    if (menuItems.type !== "array") assert.fail("Expected submenu items array");
    assert.equal(menuItems.maxRows, 6);

    const directPage = fieldByName(menuItems.fields, "page");
    const links = fieldByName(menuItems.fields, "links");
    assert.equal(directPage.type, "relationship");
    assert.equal(links.type, "array");
    if (directPage.type !== "relationship" || links.type !== "array") {
      assert.fail("Expected direct Page and category links");
    }
    assert.deepEqual(directPage.filterOptions, {
      _status: { equals: "published" },
      lifecycleStatus: { equals: "active" },
    });
    assert.equal(links.maxRows, 8);
    const childPage = fieldByName(links.fields, "page");
    assert.equal(childPage.type, "relationship");
    if (childPage.type !== "relationship") assert.fail("Expected child Page relationship");
    assert.deepEqual(childPage.filterOptions, directPage.filterOptions);
  });

  it("requires secure institutional URLs and revalidates both Globals", async () => {
    const institutionalLinks = fieldByName(Footer.fields, "institutionalLinks");
    assert.ok("fields" in institutionalLinks && Array.isArray(institutionalLinks.fields));
    const url = fieldByName(institutionalLinks.fields, "url");
    assert.equal(url.type, "text");
    if (url.type !== "text" || !url.validate) assert.fail("Expected URL validation");
    const validate = url.validate as TextFieldValidation;

    assert.equal(await validate("https://example.gov.br", {} as never), true);
    assert.notEqual(await validate("javascript:alert(1)", {} as never), true);
    assert.equal(Header.hooks?.afterChange?.length, 1);
    assert.equal(Footer.hooks?.afterChange?.length, 1);
  });
});

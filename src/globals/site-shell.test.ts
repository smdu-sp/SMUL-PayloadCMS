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

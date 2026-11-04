import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Field } from "payload";
import { CardsBlock } from "./Cards/config";
import { CTABlock } from "./CTA/config";
import { FAQBlock } from "./FAQ/config";
import { HeroBlock } from "./Hero/config";
import { IconGridBlock } from "./IconGrid/config";
import { ImageTextBlock } from "./ImageText/config";

function fieldByName(fields: Field[], name: string): Field {
  const field = fields.find((candidate) => "name" in candidate && candidate.name === name);
  assert.ok(field, `Expected field ${name}`);
  return field;
}

describe("editorial fields after manual testing", () => {
  it("accepts optional card descriptions and longer card and CTA copy", () => {
    const items = fieldByName(CardsBlock.fields, "items");
    if (items.type !== "array") assert.fail("Expected cards items array");
    const cardDescription = fieldByName(items.fields, "description");
    const ctaDescription = fieldByName(CTABlock.fields, "description");
    if (cardDescription.type !== "textarea" || ctaDescription.type !== "textarea") {
      assert.fail("Expected textarea descriptions");
    }
    assert.notEqual(cardDescription.required, true);
    assert.equal(cardDescription.maxLength, 300);
    assert.equal(ctaDescription.maxLength, 300);
  });

  it("keeps the primary Hero heading required while making section titles optional", () => {
    for (const block of [CTABlock, FAQBlock, IconGridBlock, ImageTextBlock]) {
      const title = fieldByName(block.fields, "title");
      assert.notEqual("required" in title ? title.required : undefined, true);
    }
    const heroTitle = fieldByName(HeroBlock.fields, "title");
    assert.equal("required" in heroTitle ? heroTitle.required : undefined, true);
  });
});

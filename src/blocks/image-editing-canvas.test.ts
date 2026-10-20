import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Field } from "payload";
import { CardsBlock } from "./Cards/config";
import { CarouselBlock } from "./Carousel/config";
import { FullWidthImageBannerBlock } from "./FullWidthImageBanner/config";
import { GalleryBlock } from "./Gallery/config";
import { HeroBlock } from "./Hero/config";
import { ImageBlock } from "./ImageBlock/config";
import { ImageTextBlock } from "./ImageText/config";

function fieldByName(fields: Field[], name: string): Field {
  const field = fields.find((candidate) => "name" in candidate && candidate.name === name);
  assert.ok(field, `Missing field ${name}`);
  return field;
}

function nestedFields(field: Field): Field[] {
  assert.ok("fields" in field && Array.isArray(field.fields));
  return field.fields;
}

function assertCanvas(field: Field, mediaFieldName: string) {
  assert.ok("type" in field && field.type === "json");
  const component = field.admin?.components?.Field;
  assert.ok(component && typeof component === "object");
  assert.equal(component.path, "/components/admin/ImageEditingCanvas#ImageEditingCanvas");
  assert.deepEqual(component.clientProps, { mediaFieldName });
}

function presentationCanvas(fields: Field[], mediaFieldName: string) {
  const presentation = fieldByName(fields, "imagePresentation");
  assertCanvas(fieldByName(nestedFields(presentation), "canvas"), mediaFieldName);
}

describe("SPEC-041 Canvas schema", () => {
  it("stores Canvas data beside every ordinary image occurrence", () => {
    presentationCanvas(ImageBlock.fields, "media");
    presentationCanvas(ImageTextBlock.fields, "image");
    presentationCanvas(HeroBlock.fields, "image");

    presentationCanvas(nestedFields(fieldByName(CardsBlock.fields, "items")), "image");
    presentationCanvas(nestedFields(fieldByName(GalleryBlock.fields, "images")), "media");
    presentationCanvas(nestedFields(fieldByName(CarouselBlock.fields, "items")), "image");
  });

  it("keeps responsive background occurrences independent", () => {
    const heroBackground = nestedFields(fieldByName(HeroBlock.fields, "background"));
    assertCanvas(fieldByName(heroBackground, "desktopCanvas"), "image");
    assertCanvas(fieldByName(heroBackground, "mobileCanvas"), "mobileImage");

    assertCanvas(
      fieldByName(FullWidthImageBannerBlock.fields, "desktopCanvas"),
      "desktopImage",
    );
    assertCanvas(
      fieldByName(FullWidthImageBannerBlock.fields, "mobileCanvas"),
      "mobileImage",
    );
  });
});

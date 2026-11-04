import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CardsBlock } from "./config";

describe("Cards item editor", () => {
  it("places image and icon controls directly after media type, before card text", () => {
    const fields = CardsBlock.fields as Array<{ fields?: Array<{ name?: string }>; name?: string }>;
    const itemFields = fields.find((field) => field.name === "items")?.fields ?? [];

    assert.deepEqual(itemFields.map((field) => field.name), [
      "mediaSource",
      "iconSource",
      "standardIcon",
      "icon",
      "mediaPosition",
      "image",
      "imageLayout",
      "imagePresentation",
      "title",
      "description",
      "link",
    ]);
  });
});

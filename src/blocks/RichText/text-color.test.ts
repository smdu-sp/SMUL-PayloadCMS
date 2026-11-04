import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getRichTextTextColor } from "./text-color";

describe("RichText semantic text colors", () => {
  it("uses only contrast-checked block roles", () => {
    assert.match(getRichTextTextColor("accent") ?? "", /--block-accent/);
    assert.match(getRichTextTextColor("heading") ?? "", /--block-heading/);
    assert.equal(getRichTextTextColor("#ff0000"), undefined);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  allRichTextFontStylesheets,
  getRichTextFontFamily,
  getUsedRichTextFontStylesheets,
} from "./font-family";

describe("RichText controlled font families", () => {
  it("exposes the approved pool and rejects unknown stored values", () => {
    assert.equal(allRichTextFontStylesheets.length, 4);
    assert.match(getRichTextFontFamily("notoSansTC") ?? "", /Noto Sans TC/);
    assert.equal(getRichTextFontFamily("Comic Sans MS"), undefined);
  });

  it("loads only fonts found in serialized text state", () => {
    const stylesheets = getUsedRichTextFontStylesheets({
      root: {
        children: [
          { $: { fontFamily: "roboto" }, type: "text" },
          { $: { fontFamily: "roboto" }, type: "text" },
          { $: { fontFamily: "unknown" }, type: "text" },
        ],
      },
    });

    assert.equal(stylesheets.length, 1);
    assert.match(stylesheets[0] ?? "", /family=Roboto/);
  });
});

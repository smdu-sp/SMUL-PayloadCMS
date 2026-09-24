import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { IconGridBlock } from "./Component";

const items = [{
  description: "Item local",
  iconSource: "standard",
  id: "item-1",
  standardIcon: "building",
}];

describe("IconGrid custom theme", () => {
  it("applies background, foreground and accent to the grid", () => {
    const markup = renderToStaticMarkup(createElement(IconGridBlock, {
      appearance: {
        colors: {
          accent: "#006644",
          background: "#ffffff",
          foreground: "#222222",
        },
        scheme: "custom",
      },
      blockType: "iconGrid",
      items,
      title: "Grade local",
      variant: "default",
    } as never));

    assert.match(markup, /--block-background:#ffffff/);
    assert.match(markup, /--block-foreground:#222222/);
    assert.match(markup, /--block-accent:#006644/);
    assert.match(markup, /var\(--block-accent\)/);
  });

  it("ignores stored custom colors after switching to a preset", () => {
    const markup = renderToStaticMarkup(createElement(IconGridBlock, {
      appearance: {
        colors: { accent: "#ff00ff", background: "#ff0000", foreground: "#00ff00" },
        scheme: "surface",
      },
      blockType: "iconGrid",
      items,
      title: "Grade preset",
      variant: "default",
    } as never));

    assert.doesNotMatch(markup, /--block-background:#ff0000/);
    assert.doesNotMatch(markup, /--block-accent:#ff00ff/);
    assert.match(markup, /data-color-scheme="surface"/);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { CardsBlock } from "./Component";

const items = [{
  description: "Descricao local",
  iconSource: "standard",
  id: "card-1",
  mediaSource: "icon",
  standardIcon: "building",
  title: "Card local",
}];

describe("Cards custom theme", () => {
  it("applies background, foreground and accent to the card grid", () => {
    const markup = renderToStaticMarkup(createElement(CardsBlock, {
      appearance: {
        colors: {
          accent: "#006644",
          background: "#ffffff",
          foreground: "#222222",
        },
        scheme: "custom",
      },
      blockType: "cards",
      items,
      title: "Cards locais",
      variant: "default",
    } as never));

    assert.match(markup, /--block-background:#ffffff/);
    assert.match(markup, /--block-foreground:#222222/);
    assert.match(markup, /--block-accent:#006644/);
    assert.match(markup, /var\(--block-accent\)/);
  });

  it("ignores stored custom colors after switching to a preset", () => {
    const markup = renderToStaticMarkup(createElement(CardsBlock, {
      appearance: {
        colors: { accent: "#ff00ff", background: "#ff0000", foreground: "#00ff00" },
        scheme: "muted",
      },
      blockType: "cards",
      items,
      variant: "default",
    } as never));

    assert.doesNotMatch(markup, /--block-background:#ff0000/);
    assert.doesNotMatch(markup, /--block-accent:#ff00ff/);
    assert.match(markup, /data-color-scheme="muted"/);
  });
});

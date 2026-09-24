import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ActionBannersBlock } from "./Component";

const banners = [{
  appearance: "brand" as const,
  button: { label: "Continuar", type: "external" as const, url: "/continuar" },
  id: "banner-1",
  title: "Acao local",
}];

describe("ActionBanners custom theme", () => {
  it("applies the local palette only to the outer section", () => {
    const markup = renderToStaticMarkup(createElement(ActionBannersBlock, {
      appearance: {
        colors: { background: "#ffffff", foreground: "#222222" },
        scheme: "custom",
      },
      banners,
      blockType: "actionBanners",
      title: "Acoes locais",
      variant: "grid",
    }));

    assert.match(markup, /--block-background:#ffffff/);
    assert.match(markup, /--block-foreground:#222222/);
    assert.match(markup, /data-color-scheme="brand"/);
  });

  it("ignores stored custom colors after switching to a preset", () => {
    const markup = renderToStaticMarkup(createElement(ActionBannersBlock, {
      appearance: {
        colors: { background: "#ff0000", foreground: "#00ff00" },
        scheme: "muted",
      },
      banners,
      blockType: "actionBanners",
      variant: "stacked",
    }));

    assert.doesNotMatch(markup, /--block-background:#ff0000/);
    assert.match(markup, /data-color-scheme="muted"/);
  });
});

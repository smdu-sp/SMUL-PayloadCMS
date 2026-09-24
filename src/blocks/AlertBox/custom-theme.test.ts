import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { AlertBoxBlock } from "./Component";

const content = {
  root: {
    children: [{
      children: [{ detail: 0, format: 0, mode: "normal", style: "", text: "Aviso local", type: "text", version: 1 }],
      direction: null,
      format: "" as const,
      indent: 0,
      type: "paragraph",
      version: 1,
    }],
    direction: null,
    format: "" as const,
    indent: 0,
    type: "root",
    version: 1,
  },
};

describe("AlertBox custom theme", () => {
  it("applies the local palette without replacing the semantic marker", () => {
    const markup = renderToStaticMarkup(createElement(AlertBoxBlock, {
      appearance: {
        colors: { background: "#ffffff", foreground: "#222222" },
        scheme: "custom",
      },
      blockType: "alertBox",
      content,
      title: "Atencao local",
      type: "warning",
    }));

    assert.match(markup, /--block-background:#ffffff/);
    assert.match(markup, /--block-foreground:#222222/);
    assert.match(markup, /data-status="warning"/);
    assert.match(markup, /bg-warning/);
  });

  it("ignores stored custom colors after switching to a preset", () => {
    const markup = renderToStaticMarkup(createElement(AlertBoxBlock, {
      appearance: {
        colors: { background: "#ff0000", foreground: "#00ff00" },
        scheme: "muted",
      },
      blockType: "alertBox",
      content,
      type: "info",
    }));

    assert.doesNotMatch(markup, /--block-background:#ff0000/);
    assert.match(markup, /data-color-scheme="muted"/);
  });
});

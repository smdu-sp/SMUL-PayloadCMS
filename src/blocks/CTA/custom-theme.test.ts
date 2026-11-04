import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { CTABlock } from "./Component";

describe("CTA custom theme", () => {
  it("gives the institutional variant a brand surface without discarding other chosen schemes", () => {
    const render = (scheme: "default" | "muted") => renderToStaticMarkup(createElement(CTABlock, {
      action: { label: "", type: "external", url: "" },
      appearance: { scheme },
      blockType: "cta",
      title: "Chamada institucional",
      variant: "brand",
    }));

    assert.match(render("default"), /data-color-scheme="brand"/);
    assert.match(render("muted"), /data-color-scheme="muted"/);
  });

  it("applies the local palette to the complete CTA surface", () => {
    const markup = renderToStaticMarkup(createElement(CTABlock, {
      action: { label: "", type: "external", url: "" },
      appearance: {
        colors: {
          accent: "#006644",
          action: "#003399",
          background: "#ffffff",
          brand: "#663399",
          foreground: "#222222",
        },
        scheme: "custom",
      },
      blockType: "cta",
      title: "CTA com tema local",
      variant: "default",
    }));

    assert.match(markup, /--block-background:#ffffff/);
    assert.match(markup, /--block-foreground:#222222/);
    assert.match(markup, /--block-action:#003399/);
    assert.match(markup, /--block-accent:#006644/);
  });

  it("ignores stored custom colors after switching back to a preset", () => {
    const markup = renderToStaticMarkup(createElement(CTABlock, {
      action: { label: "", type: "external", url: "" },
      appearance: {
        colors: {
          background: "#ff0000",
          foreground: "#00ff00",
        },
        scheme: "surface",
      },
      blockType: "cta",
      title: "CTA com preset",
      variant: "default",
    }));

    assert.doesNotMatch(markup, /--block-background:#ff0000/);
    assert.doesNotMatch(markup, /--block-foreground:#00ff00/);
    assert.match(markup, /data-color-scheme="surface"/);
  });

  it("omits an empty title and gives strong emphasis a visible treatment", () => {
    const markup = renderToStaticMarkup(createElement(CTABlock, {
      action: { label: "", type: "external", url: "" },
      appearance: { emphasis: "strong" },
      blockType: "cta",
      description: "Orientacao sem titulo",
      variant: "default",
    }));
    assert.doesNotMatch(markup, /<h2/);
    assert.match(markup, /Orientacao sem titulo/);
    assert.match(markup, /border-2 shadow-lg/);
  });
});

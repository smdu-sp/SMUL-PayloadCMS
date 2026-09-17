import assert from "node:assert/strict";
import { it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ColorRegressionFixture, regressionThemes } from "./color-regression.fixture";

it("renders the main regression with real primitives and Lexical in both palettes", () => {
  for (const palette of Object.keys(regressionThemes) as (keyof typeof regressionThemes)[]) {
    const html = renderToStaticMarkup(createElement(ColorRegressionFixture, { palette }));
    assert.match(html, /data-regression="surface"/);
    assert.match(html, /data-regression="brand"/);
    assert.match(html, /data-regression="accent"/);
    assert.match(html, /class="cms-rich-text"><p>/);
    assert.match(html, /data-color-scheme="inherit"/);
    assert.match(html, /--block-background:#fff;/);
    assert.match(html, /--block-foreground:#123;/);
    assert.doesNotMatch(html, /text-white|text-primary|text-secondary|text-link/);
  }
});

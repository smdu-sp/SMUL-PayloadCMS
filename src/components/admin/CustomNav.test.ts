import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { CustomNav } from "./CustomNav.tsx";

describe("CustomNav", () => {
  it("renders an icon for every admin navigation link", () => {
    const markup = renderToStaticMarkup(createElement(CustomNav));
    const links = markup.match(/<a\b/g) ?? [];
    const icons = markup.match(/<svg\b/g) ?? [];

    assert.equal(links.length, 11);
    assert.equal(icons.length, links.length);
    assert.match(markup, /href="\/admin\/collections\/users"/);
    assert.match(markup, /href="\/admin\/icones"/);
    assert.match(markup, /href="\/admin\/logout"/);
  });
});

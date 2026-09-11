import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { STANDARD_ICONS } from "../../domain/icons.ts";
import { Icon } from "./Icon.tsx";

describe("Icon component", () => {
  it("renders every standard icon in the catalog without error", () => {
    for (const name of STANDARD_ICONS) {
      const markup = renderToStaticMarkup(createElement(Icon, { name }));
      assert.match(markup, /<svg/);
      assert.match(markup, /viewBox="0 0 24 24"/);
      assert.match(markup, /stroke="currentColor"/);
    }
  });

  it("applies accessible decorative attributes by default", () => {
    const markup = renderToStaticMarkup(createElement(Icon, { name: "building" }));

    assert.match(markup, /aria-hidden="true"/);
    assert.match(markup, /focusable="false"/);
    assert.doesNotMatch(markup, /role="img"/);
    assert.doesNotMatch(markup, /aria-label/);
  });

  it("applies semantic role and label when informative ariaLabel is provided", () => {
    const markup = renderToStaticMarkup(
      createElement(Icon, {
        ariaLabel: "Localização da unidade",
        name: "location",
      }),
    );

    assert.match(markup, /role="img"/);
    assert.match(markup, /aria-label="Localização da unidade"/);
    assert.doesNotMatch(markup, /aria-hidden="true"/);
  });

  it("maps design token sizes and tones to css classes", () => {
    const primaryLg = renderToStaticMarkup(
      createElement(Icon, { name: "check", size: "lg", tone: "primary" }),
    );
    assert.match(primaryLg, /h-6 w-6/);
    assert.match(primaryLg, /text-primary/);
    assert.match(primaryLg, /width="24"/);
    assert.match(primaryLg, /height="24"/);

    const warningSm = renderToStaticMarkup(
      createElement(Icon, { name: "warning", size: "sm", tone: "warning" }),
    );
    assert.match(warningSm, /h-4 w-4/);
    assert.match(warningSm, /text-warning/);
    assert.match(warningSm, /width="16"/);
    assert.match(warningSm, /height="16"/);

    const secondary2xl = renderToStaticMarkup(
      createElement(Icon, { name: "document", size: "2xl", tone: "secondary" }),
    );
    assert.match(secondary2xl, /h-10 w-10/);
    assert.match(secondary2xl, /text-secondary/);
    assert.match(secondary2xl, /width="40"/);
    assert.match(secondary2xl, /height="40"/);
  });

  it("falls back gracefully when given unknown or undefined icon name", () => {
    const markup = renderToStaticMarkup(
      createElement(Icon, { name: "unknown-icon-name" }),
    );
    assert.match(markup, /<svg/);
  });
});

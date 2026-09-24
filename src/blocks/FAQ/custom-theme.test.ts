import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { FAQAccordionBlock } from "./Component";

const answer = {
  root: {
    children: [{
      children: [{ detail: 0, format: 0, mode: "normal", style: "", text: "Resposta local", type: "text", version: 1 }],
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

const items = [{ answer, id: "faq-1", question: "Pergunta local?" }];

describe("FAQ custom theme", () => {
  it("applies the local palette to the outer FAQ section", () => {
    const markup = renderToStaticMarkup(createElement(FAQAccordionBlock, {
      appearance: {
        colors: { background: "#ffffff", foreground: "#222222" },
        scheme: "custom",
      },
      blockType: "faqAccordion",
      items,
      title: "FAQ local",
      variant: "default",
    }));

    assert.match(markup, /--block-background:#ffffff/);
    assert.match(markup, /--block-foreground:#222222/);
    assert.match(markup, /data-color-scheme="surface"/);
  });

  it("ignores stored custom colors after switching to a preset", () => {
    const markup = renderToStaticMarkup(createElement(FAQAccordionBlock, {
      appearance: {
        colors: { background: "#ff0000", foreground: "#00ff00" },
        scheme: "muted",
      },
      blockType: "faqAccordion",
      items,
      title: "FAQ preset",
      variant: "default",
    }));

    assert.doesNotMatch(markup, /--block-background:#ff0000/);
    assert.match(markup, /data-color-scheme="muted"/);
  });
});

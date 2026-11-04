import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { getImagePresentationSizeClassName } from "../shared/image-presentation";
import { ImageTextBlock } from "./Component";

const content = {
  root: {
    children: [{
      children: [{ detail: 0, format: 0, mode: "normal", style: "", text: "Conteúdo local", type: "text", version: 1 }],
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

describe("ImageText custom theme", () => {
  it("keeps large narrower than the image column and full at column width", () => {
    const imageClassName = (size: "large" | "full") => {
      const section = ImageTextBlock({
        blockType: "imageText",
        content,
        image: { alt: "Imagem de teste", url: "/imagem.jpg" } as never,
        imagePresentation: { aspectRatio: "original", fit: "cover", size },
        title: "Imagem e texto",
        variant: "image-left",
      }) as ReactElement<{ children: ReactElement }>;
      const container = section.props.children as ReactElement<{ children: ReactElement }>;
      const grid = container.props.children as ReactElement<{ children: ReactElement[] }>;
      const image = grid.props.children[0] as ReactElement<{ sizeClassNames: Record<string, string> }>;
      return getImagePresentationSizeClassName({ size }, { sizeClassNames: image.props.sizeClassNames });
    };

    assert.match(imageClassName("large"), /sm:w-5\/6/);
    assert.equal(imageClassName("full"), "w-full");
  });

  it("applies the local palette to the complete editorial surface", () => {
    const markup = renderToStaticMarkup(createElement(ImageTextBlock, {
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
      blockType: "imageText",
      content,
      cta: { label: "", type: "external", url: "" },
      image: 1,
      imagePresentation: { aspectRatio: "original", fit: "cover", size: "medium" },
      title: "Imagem e texto",
      variant: "image-left",
    }));

    assert.match(markup, /--block-background:#ffffff/);
    assert.match(markup, /--block-foreground:#222222/);
    assert.match(markup, /--block-action:#003399/);
    assert.match(markup, /--block-accent:#006644/);
  });

  it("ignores stored custom colors after switching to a preset", () => {
    const markup = renderToStaticMarkup(createElement(ImageTextBlock, {
      appearance: {
        colors: { background: "#ff0000", foreground: "#00ff00" },
        scheme: "muted",
      },
      blockType: "imageText",
      content,
      cta: { label: "", type: "external", url: "" },
      image: 1,
      imagePresentation: { aspectRatio: "original", fit: "cover", size: "medium" },
      title: "Imagem e texto",
      variant: "image-left",
    }));

    assert.doesNotMatch(markup, /--block-background:#ff0000/);
    assert.doesNotMatch(markup, /--block-foreground:#00ff00/);
    assert.match(markup, /data-color-scheme="muted"/);
  });
});

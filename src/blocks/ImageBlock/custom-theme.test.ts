import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidElement, type ReactElement } from "react";

import { BlockThemeScope, Section } from "../../components/ui";
import { ImageBlock } from "./Component";

const media = { alt: "Imagem de teste", url: "/imagem.jpg" } as never;

describe("ImageBlock custom theme", () => {
  it("scopes the image section and caption to the local palette", () => {
    const block = ImageBlock({
      appearance: {
        colors: { background: "#ffffff", foreground: "#222222" },
        scheme: "custom",
      },
      blockType: "imageBlock",
      caption: "Legenda local",
      imagePresentation: { aspectRatio: "original", fit: "cover", size: "large" },
      media,
    });

    assert.ok(isValidElement(block));
    const scopedBlock = block as ReactElement<{
      children: ReactElement<{ scheme: string }>;
      palette: { background: string; foreground: string };
    }>;
    assert.equal(scopedBlock.type, BlockThemeScope);
    assert.deepEqual(scopedBlock.props.palette, { background: "#ffffff", foreground: "#222222" });
    const section = scopedBlock.props.children;
    assert.equal(section.type, Section);
    assert.equal(section.props.scheme, "default");
  });

  it("ignores stored custom colors after switching to a preset", () => {
    const block = ImageBlock({
      appearance: {
        colors: { background: "#ff0000", foreground: "#00ff00" },
        scheme: "surface",
      },
      blockType: "imageBlock",
      imagePresentation: { aspectRatio: "original", fit: "cover", size: "large" },
      media,
    });

    assert.ok(isValidElement(block));
    const section = block as ReactElement<{ scheme: string }>;
    assert.equal(section.type, Section);
    assert.equal(section.props.scheme, "surface");
  });
});

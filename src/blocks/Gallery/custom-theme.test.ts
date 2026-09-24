import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidElement, type ReactElement } from "react";

import { BlockThemeScope, Section } from "../../components/ui";
import { GalleryBlock } from "./Component";

const images = [{ media: { alt: "Imagem de teste", id: 1, url: "/imagem.jpg" } as never }];

describe("Gallery custom theme", () => {
  it("scopes the gallery surface to the local palette", () => {
    const block = GalleryBlock({
      appearance: {
        colors: { background: "#ffffff", foreground: "#222222" },
        scheme: "custom",
      },
      blockType: "gallery",
      images,
      title: "Galeria local",
    });

    assert.ok(isValidElement(block));
    const scopedBlock = block as ReactElement<{
      children: ReactElement<{ scheme: string }>;
      palette: { background: string; foreground: string };
    }>;
    assert.equal(scopedBlock.type, BlockThemeScope);
    assert.deepEqual(scopedBlock.props.palette, { background: "#ffffff", foreground: "#222222" });
    assert.equal(scopedBlock.props.children.type, Section);
    assert.equal(scopedBlock.props.children.props.scheme, "default");
  });

  it("ignores stored custom colors after switching to a preset", () => {
    const block = GalleryBlock({
      appearance: {
        colors: { background: "#ff0000", foreground: "#00ff00" },
        scheme: "surface",
      },
      blockType: "gallery",
      images,
    });

    assert.ok(isValidElement(block));
    const section = block as ReactElement<{ scheme: string }>;
    assert.equal(section.type, Section);
    assert.equal(section.props.scheme, "surface");
  });
});

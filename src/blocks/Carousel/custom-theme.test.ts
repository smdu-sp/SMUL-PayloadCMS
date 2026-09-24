import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidElement, type ReactElement } from "react";

import { BlockThemeScope, Section } from "../../components/ui";
import { CarouselBlock } from "./Component";

const items = [{ image: { alt: "Imagem de teste", id: 1, url: "/imagem.jpg" } as never }];

describe("Carousel custom theme", () => {
  it("scopes the carousel section to the local palette", () => {
    const block = CarouselBlock({
      appearance: {
        colors: { background: "#ffffff", foreground: "#222222" },
        scheme: "custom",
      },
      blockType: "carousel",
      items,
      title: "Carrossel local",
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
    const block = CarouselBlock({
      appearance: {
        colors: { background: "#ff0000", foreground: "#00ff00" },
        scheme: "muted",
      },
      blockType: "carousel",
      items,
    });

    assert.ok(isValidElement(block));
    const section = block as ReactElement<{ scheme: string }>;
    assert.equal(section.type, Section);
    assert.equal(section.props.scheme, "muted");
  });
});

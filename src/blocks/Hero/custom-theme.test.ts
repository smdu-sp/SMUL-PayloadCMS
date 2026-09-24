import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidElement, type ReactElement } from "react";

import { BlockThemeScope, Section } from "../../components/ui";
import { HeroBlock } from "./Component";

describe("Hero custom theme", () => {
  it("scopes every color role consumed by the Hero", () => {
    const block = HeroBlock({
      appearance: {
        alignment: "left",
        colors: {
          accent: "#006644",
          action: "#0055aa",
          background: "#ffffff",
          foreground: "#222222",
        },
        scheme: "custom",
      },
      blockType: "hero",
      title: "Hero local",
      variant: "default",
    });

    assert.ok(isValidElement(block));
    const scopedBlock = block as ReactElement<{
      children: ReactElement<{ scheme: string }>;
      palette: Record<string, string>;
    }>;
    assert.equal(scopedBlock.type, BlockThemeScope);
    assert.deepEqual(scopedBlock.props.palette, {
      accent: "#006644",
      action: "#0055aa",
      background: "#ffffff",
      foreground: "#222222",
    });
    assert.equal(scopedBlock.props.children.type, Section);
    assert.equal(scopedBlock.props.children.props.scheme, "default");
  });

  it("ignores stored custom colors after switching to a preset", () => {
    const block = HeroBlock({
      appearance: {
        alignment: "center",
        colors: { background: "#ff0000", foreground: "#00ff00" },
        scheme: "brand",
      },
      blockType: "hero",
      title: "Hero institucional",
      variant: "centered",
    });

    assert.ok(isValidElement(block));
    const section = block as ReactElement<{ scheme: string }>;
    assert.equal(section.type, Section);
    assert.equal(section.props.scheme, "brand");
  });
});

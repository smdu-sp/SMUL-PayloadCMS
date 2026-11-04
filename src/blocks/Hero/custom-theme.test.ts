import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidElement, type ReactElement } from "react";

import { BlockThemeScope, Section } from "../../components/ui";
import { HeroBlock, resolveHeroMediaVisibility } from "./Component";
import { HeroBlock as HeroSchema } from "./config";

describe("Hero custom theme", () => {
  it("uses one explicit image choice while preserving media on older Pages", () => {
    const legacy = { hasBackgroundImage: true, hasSideImage: true, variant: "split" as const };

    assert.deepEqual(resolveHeroMediaVisibility(legacy), { hasBackground: true, split: true });
    assert.deepEqual(resolveHeroMediaVisibility({ ...legacy, imageMode: "background" }), {
      hasBackground: true,
      split: false,
    });
    assert.deepEqual(resolveHeroMediaVisibility({ ...legacy, imageMode: "side" }), {
      hasBackground: false,
      split: true,
    });
    assert.deepEqual(resolveHeroMediaVisibility({ ...legacy, imageMode: "none" }), {
      hasBackground: false,
      split: false,
    });
  });

  it("keeps old media fields available when their Pages have no image mode", () => {
    const fields = HeroSchema.fields as Array<{
      admin?: { condition?: (data: unknown, siblings: Record<string, unknown>) => boolean; hidden?: boolean };
      name?: string;
      required?: boolean;
    }>;
    const field = (name: string) => fields.find((entry) => entry.name === name);

    assert.equal(field("imageMode")?.required, undefined);
    assert.equal(field("variant")?.admin?.hidden, true);
    assert.equal(field("image")?.admin?.condition?.({}, { variant: "split" }), true);
    assert.equal(field("background")?.admin?.condition?.({}, { background: { image: 1 } }), true);
    assert.equal(field("image")?.admin?.condition?.({}, { imageMode: "side" }), true);
    assert.equal(field("background")?.admin?.condition?.({}, { imageMode: "background" }), true);
    assert.equal(field("image")?.admin?.condition?.({}, { imageMode: "background", variant: "split" }), false);
    assert.equal(field("background")?.admin?.condition?.({}, { imageMode: "side", background: { image: 1 } }), false);
    assert.equal(field("image")?.admin?.condition?.({}, { imageMode: "none", variant: "split" }), false);
  });

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

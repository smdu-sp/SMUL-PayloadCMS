import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidElement, type ReactElement } from "react";

import { BlockThemeScope, ColorScope, MediaColorScope } from "../../components/ui";
import { FullWidthImageBannerBlock } from "./Component";

const desktopImage = { alt: "Banner de teste", url: "/banner.webp" } as never;

describe("FullWidthImageBanner custom theme", () => {
  it("applies every color role consumed by the media content", () => {
    const block = FullWidthImageBannerBlock({
      appearance: {
        colors: {
          accent: "#006644",
          action: "#0055aa",
          background: "#ffffff",
          foreground: "#222222",
        },
        scheme: "custom",
      },
      blockType: "fullWidthImageBanner",
      content: {
        actions: [{ label: "Continuar", type: "external", url: "/continuar" }],
        eyebrow: "Destaque",
        title: "Banner local",
      },
      desktopImage,
      overlay: "dark",
    });

    assert.ok(isValidElement(block));
    const scopedBlock = block as ReactElement<{
      children: ReactElement<{ children: ReactElement; paint: boolean; scheme: string }>;
      palette: Record<string, string>;
    }>;
    assert.equal(scopedBlock.type, BlockThemeScope);
    assert.deepEqual(scopedBlock.props.palette, {
      accent: "#006644",
      action: "#0055aa",
      background: "#ffffff",
      foreground: "#222222",
    });
    assert.equal(scopedBlock.props.children.type, ColorScope);
    assert.equal(scopedBlock.props.children.props.scheme, "default");
    assert.equal(scopedBlock.props.children.props.paint, false);
  });

  it("ignores stored custom colors while the default media recipe is selected", () => {
    const block = FullWidthImageBannerBlock({
      appearance: {
        colors: { background: "#ff0000", foreground: "#00ff00" },
        scheme: "default",
      },
      blockType: "fullWidthImageBanner",
      content: { title: "Banner padrao" },
      desktopImage,
      overlay: "light",
    });

    assert.ok(isValidElement(block));
    const mediaScope = block as ReactElement<{ mode: string; paint: boolean }>;
    assert.equal(mediaScope.type, MediaColorScope);
    assert.equal(mediaScope.props.mode, "light");
    assert.equal(mediaScope.props.paint, false);
  });
});

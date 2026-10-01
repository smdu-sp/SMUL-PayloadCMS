import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Link from "next/link";
import { isValidElement, type ReactElement } from "react";

import { BlockThemeScope, ColorScope, MediaColorScope } from "../../components/ui";
import { FullWidthImageBannerBlock } from "./Component";

const desktopImage = { alt: "Banner de teste", url: "/banner.webp" } as never;

describe("FullWidthImageBanner custom theme", () => {
  it("applies the custom background consumed by the overlay", () => {
    const block = FullWidthImageBannerBlock({
      appearance: {
        colors: {
          background: "#ffffff",
        },
        scheme: "custom",
      },
      blockType: "fullWidthImageBanner",
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
      background: "#ffffff",
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
      desktopImage,
      overlay: "light",
    });

    assert.ok(isValidElement(block));
    const mediaScope = block as ReactElement<{ mode: string; paint: boolean }>;
    assert.equal(mediaScope.type, MediaColorScope);
    assert.equal(mediaScope.props.mode, "light");
    assert.equal(mediaScope.props.paint, false);
  });

  it("renders the whole image as a link without a text label", () => {
    const block = FullWidthImageBannerBlock({
      blockType: "fullWidthImageBanner",
      desktopImage,
      link: {
        enabled: true,
        newTab: true,
        type: "external",
        url: "https://example.gov.br/servico",
      },
      overlay: "none",
    });
    assert.ok(isValidElement(block));
    const mediaScope = block as ReactElement<{ children: ReactElement }>;
    const linkedImage = mediaScope.props.children as ReactElement<{
      "aria-label": string;
      children: ReactElement;
      href: string;
      target?: string;
    }>;
    assert.equal(linkedImage.type, Link);
    assert.equal(linkedImage.props.href, "https://example.gov.br/servico");
    assert.equal(linkedImage.props.target, "_blank");
    assert.equal(linkedImage.props["aria-label"], "Abrir banner: Banner de teste");
    assert.equal(linkedImage.props.children.type, "div");
  });

  it("does not create a link when the association is disabled", () => {
    const block = FullWidthImageBannerBlock({
      blockType: "fullWidthImageBanner",
      desktopImage,
      link: {
        enabled: false,
        type: "external",
        url: "https://example.gov.br/ignorado",
      },
      overlay: "none",
    });

    assert.ok(isValidElement(block));
    const mediaScope = block as ReactElement<{ children: ReactElement }>;
    assert.equal(mediaScope.props.children.type, "div");
  });
});

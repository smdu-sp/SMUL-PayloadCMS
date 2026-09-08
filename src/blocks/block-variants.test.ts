import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  normalizeActionBannerAppearance,
  normalizeActionBannersVariant,
} from "./ActionBanners/Component";
import { normalizeAlertBoxType } from "./AlertBox/Component";
import { normalizeCTAVariant } from "./CTA/Component";
import { normalizeCardsVariant } from "./Cards/Component";
import { normalizeFAQVariant } from "./FAQ/Component";
import { HeroBlock } from "./Hero/config";
import { normalizeHeroVariant } from "./Hero/Component";
import { normalizeIconGridVariant } from "./IconGrid/Component";
import { ImageTextBlock } from "./ImageText/config";
import { normalizeImageTextVariant } from "./ImageText/Component";
import { normalizeRichTextVariant } from "./RichText/Component";

describe("block variant fallbacks", () => {
  it("keeps known Hero variants and maps the legacy image variant to split", () => {
    assert.equal(normalizeHeroVariant("default"), "default");
    assert.equal(normalizeHeroVariant("centered"), "centered");
    assert.equal(normalizeHeroVariant("split"), "split");
    assert.equal(normalizeHeroVariant("image"), "split");
    assert.equal(normalizeHeroVariant("unknown"), "default");
    assert.equal(normalizeHeroVariant(undefined), "default");
  });

  it("adds a safe presentation group to Hero and ImageText blocks without arbitrary numeric controls", () => {
    const heroPresentation = HeroBlock.fields.find(
      (field) => "name" in field && field.name === "imagePresentation",
    );
    const imageTextPresentation = ImageTextBlock.fields.find(
      (field) => "name" in field && field.name === "imagePresentation",
    );

    assert.ok(heroPresentation && "type" in heroPresentation && heroPresentation.type === "group");
    assert.ok(
      imageTextPresentation && "type" in imageTextPresentation && imageTextPresentation.type === "group",
    );

    for (const presentation of [heroPresentation, imageTextPresentation]) {
      assert.ok(presentation && "fields" in presentation);
      const nestedTypes = presentation.fields
        .filter((field) => "type" in field)
        .map((field) => field.type);
      assert.ok(!nestedTypes.includes("number"));
      assert.ok(!nestedTypes.includes("text"));
    }
  });

  it("keeps known CTA variants and maps legacy values without breaking rendering", () => {
    assert.equal(normalizeCTAVariant("default"), "default");
    assert.equal(normalizeCTAVariant("brand"), "brand");
    assert.equal(normalizeCTAVariant("compact"), "compact");
    assert.equal(normalizeCTAVariant("primary"), "brand");
    assert.equal(normalizeCTAVariant("secondary"), "default");
    assert.equal(normalizeCTAVariant("unknown"), "default");
  });

  it("keeps ImageText variants and maps legacy image positions", () => {
    assert.equal(normalizeImageTextVariant("image-left"), "image-left");
    assert.equal(normalizeImageTextVariant("image-right"), "image-right");
    assert.equal(normalizeImageTextVariant("left"), "image-left");
    assert.equal(normalizeImageTextVariant("right"), "image-right");
    assert.equal(normalizeImageTextVariant("unknown"), "image-left");
  });

  it("keeps RichText variants and maps legacy widths", () => {
    assert.equal(normalizeRichTextVariant("default"), "default");
    assert.equal(normalizeRichTextVariant("narrow"), "narrow");
    assert.equal(normalizeRichTextVariant("content"), "narrow");
    assert.equal(normalizeRichTextVariant("wide"), "default");
    assert.equal(normalizeRichTextVariant("unknown"), "default");
  });

  it("keeps Cards variants and falls back to the general card list", () => {
    assert.equal(normalizeCardsVariant("default"), "default");
    assert.equal(normalizeCardsVariant("modalities"), "modalities");
    assert.equal(normalizeCardsVariant("unknown"), "default");
  });

  it("normalizes newly added structural block variants", () => {
    assert.equal(normalizeIconGridVariant("default"), "default");
    assert.equal(normalizeIconGridVariant("compact"), "compact");
    assert.equal(normalizeIconGridVariant("unknown"), "default");
    assert.equal(normalizeFAQVariant("default"), "default");
    assert.equal(normalizeFAQVariant("compact"), "compact");
    assert.equal(normalizeFAQVariant("unknown"), "default");
    assert.equal(normalizeAlertBoxType("info"), "info");
    assert.equal(normalizeAlertBoxType("warning"), "warning");
    assert.equal(normalizeAlertBoxType("unknown"), "info");
  });

  it("normalizes Action Banners variants and token-based appearances", () => {
    assert.equal(normalizeActionBannersVariant("grid"), "grid");
    assert.equal(normalizeActionBannersVariant("stacked"), "stacked");
    assert.equal(normalizeActionBannersVariant("unknown"), "grid");
    assert.equal(normalizeActionBannerAppearance("primary"), "primary");
    assert.equal(normalizeActionBannerAppearance("brand"), "brand");
    assert.equal(normalizeActionBannerAppearance("accent"), "accent");
    assert.equal(normalizeActionBannerAppearance("yellow"), "primary");
  });
});

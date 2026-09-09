import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  normalizeActionBannerAppearance,
  normalizeActionBannersVariant,
} from "./ActionBanners/Component";
import { normalizeAlertBoxType } from "./AlertBox/Component";
import {
  normalizeCTASpacing,
  normalizeCTATone,
  normalizeCTAVariant,
} from "./CTA/Component";
import {
  normalizeCardsSpacing,
  normalizeCardsTone,
  normalizeCardsVariant,
} from "./Cards/Component";
import { normalizeFAQVariant } from "./FAQ/Component";
import {
  normalizeBannerContentPosition,
  normalizeBannerImageHeight,
  normalizeBannerImageFit,
  normalizeCustomBannerImageHeight,
} from "./FullWidthImageBanner/Component";
import { HeroBlock } from "./Hero/config";
import {
  normalizeHeroAlignment,
  normalizeHeroTone,
  normalizeHeroVariant,
} from "./Hero/Component";
import {
  normalizeIconGridSpacing,
  normalizeIconGridTone,
  normalizeIconGridVariant,
} from "./IconGrid/Component";
import { ImageTextBlock } from "./ImageText/config";
import {
  normalizeImageTextSpacing,
  normalizeImageTextTone,
  normalizeImageTextVariant,
} from "./ImageText/Component";
import {
  normalizeRichTextSpacing,
  normalizeRichTextVariant,
  normalizeRichTextWidth,
} from "./RichText/Component";

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

  it("normalizes SPEC-033 full-width banner presentation presets", () => {
    assert.equal(normalizeBannerImageHeight("auto"), "auto");
    assert.equal(normalizeBannerImageHeight("compact"), "compact");
    assert.equal(normalizeBannerImageHeight("medium"), "medium");
    assert.equal(normalizeBannerImageHeight("large"), "large");
    assert.equal(normalizeBannerImageHeight("custom"), "custom");
    assert.equal(normalizeBannerImageHeight("unknown"), "auto");
    assert.equal(normalizeBannerImageHeight(undefined, "compact"), "compact");
    assert.equal(normalizeBannerImageHeight(undefined, "default"), "medium");
    assert.equal(normalizeBannerImageHeight(undefined, "immersive"), "large");
    assert.equal(normalizeCustomBannerImageHeight(420), 420);
    assert.equal(normalizeCustomBannerImageHeight(120), 160);
    assert.equal(normalizeCustomBannerImageHeight(1000), 900);
    assert.equal(normalizeCustomBannerImageHeight(undefined), null);
    assert.equal(normalizeBannerContentPosition("right"), "right");
    assert.equal(normalizeBannerContentPosition("unknown"), "left");
    assert.equal(normalizeBannerImageFit("contain"), "contain");
    assert.equal(normalizeBannerImageFit("stretch"), "cover");
  });

  it("normalizes SPEC-036 controlled block styling appearance attributes", () => {
    // Hero tone & alignment
    assert.equal(normalizeHeroTone("brand"), "brand");
    assert.equal(normalizeHeroTone("surface"), "surface");
    assert.equal(normalizeHeroTone("muted"), "muted");
    assert.equal(normalizeHeroTone("default"), "default");
    assert.equal(normalizeHeroTone("invalid"), "brand");
    assert.equal(normalizeHeroTone(undefined), "brand");

    assert.equal(normalizeHeroAlignment("center"), "center");
    assert.equal(normalizeHeroAlignment("left"), "left");
    assert.equal(normalizeHeroAlignment("invalid"), "left");
    assert.equal(normalizeHeroAlignment(undefined, true), "center");

    // CTA tone & spacing
    assert.equal(normalizeCTATone("brand"), "brand");
    assert.equal(normalizeCTATone("accent"), "accent");
    assert.equal(normalizeCTATone("muted"), "muted");
    assert.equal(normalizeCTATone("invalid", "accent"), "accent");
    assert.equal(normalizeCTATone(undefined, "brand"), "brand");

    assert.equal(normalizeCTASpacing("compact"), "compact");
    assert.equal(normalizeCTASpacing("spacious"), "spacious");
    assert.equal(normalizeCTASpacing("invalid", "compact"), "compact");
    assert.equal(normalizeCTASpacing(undefined), "default");

    // RichText width & spacing
    assert.equal(normalizeRichTextWidth("narrow"), "narrow");
    assert.equal(normalizeRichTextWidth("wide"), "wide");
    assert.equal(normalizeRichTextWidth("default"), "default");
    assert.equal(normalizeRichTextWidth("unknown", "narrow"), "narrow");
    assert.equal(normalizeRichTextWidth(undefined, "default"), "default");

    assert.equal(normalizeRichTextSpacing("compact"), "compact");
    assert.equal(normalizeRichTextSpacing("spacious"), "spacious");
    assert.equal(normalizeRichTextSpacing(undefined), "default");

    // Cards tone & spacing
    assert.equal(normalizeCardsTone("surface"), "surface");
    assert.equal(normalizeCardsTone("muted"), "muted");
    assert.equal(normalizeCardsTone("default"), "default");
    assert.equal(normalizeCardsTone("invalid", "muted"), "muted");
    assert.equal(normalizeCardsTone(undefined), "default");

    assert.equal(normalizeCardsSpacing("compact"), "compact");
    assert.equal(normalizeCardsSpacing("spacious"), "spacious");
    assert.equal(normalizeCardsSpacing("unknown"), "default");

    // ImageText tone & spacing
    assert.equal(normalizeImageTextTone("surface"), "surface");
    assert.equal(normalizeImageTextTone("muted"), "muted");
    assert.equal(normalizeImageTextTone("default"), "default");
    assert.equal(normalizeImageTextTone("unknown"), "default");

    assert.equal(normalizeImageTextSpacing("compact"), "compact");
    assert.equal(normalizeImageTextSpacing("spacious"), "spacious");
    assert.equal(normalizeImageTextSpacing("unknown"), "default");

    // IconGrid tone & spacing
    assert.equal(normalizeIconGridTone("surface"), "surface");
    assert.equal(normalizeIconGridTone("muted"), "muted");
    assert.equal(normalizeIconGridTone("default"), "default");
    assert.equal(normalizeIconGridTone("unknown"), "default");

    assert.equal(normalizeIconGridSpacing("compact"), "compact");
    assert.equal(normalizeIconGridSpacing("spacious"), "spacious");
    assert.equal(normalizeIconGridSpacing("unknown"), "default");
  });
});

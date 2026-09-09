import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { seedShowcaseLayout } from "./seed-showcase";

describe("complete block showcase seed", () => {
  it("contains every block currently registered in Pages", () => {
    const layout = seedShowcaseLayout(101, 202);

    assert.deepEqual(
      layout.map(({ blockType }) => blockType),
      [
        "hero",
        "richText",
        "imageText",
        "cards",
        "actionBanners",
        "fullWidthImageBanner",
        "faqAccordion",
        "alertBox",
        "iconGrid",
        "cta",
      ],
    );
  });

  it("uses seeded media and self-references the showcase page", () => {
    const layout = seedShowcaseLayout(101, 202, 303);
    const serialized = JSON.stringify(layout);

    assert.match(serialized, /"image":101/);
    assert.match(serialized, /"icon":101/);
    assert.match(serialized, /"desktopImage":303/);
    assert.match(serialized, /"page":202/);
  });

  it("falls back to the shared demo media for the banner image", () => {
    const serialized = JSON.stringify(seedShowcaseLayout(101, 202));

    assert.match(serialized, /"desktopImage":101/);
  });

  it("uses explanatory copy instead of placeholder text", () => {
    const serialized = JSON.stringify(seedShowcaseLayout(101, 202));

    assert.doesNotMatch(serialized, /lorem ipsum/i);
    assert.match(serialized, /finalidade|indicado|organiza|apresenta|combina/i);
  });
});

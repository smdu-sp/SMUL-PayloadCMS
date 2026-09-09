import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getFocalPointStyle,
  getImagePresentationClassName,
} from "./image-presentation";

describe("image presentation helpers", () => {
  it("keeps full width stable on mobile and creates ratio classes only when requested", () => {
    const sizes = ["small", "medium", "large", "full"] as const;
    const ratios = ["original", "1:1", "4:3", "16:9", "portrait"] as const;

    for (const size of sizes) {
      for (const ratio of ratios) {
        const className = getImagePresentationClassName({
          size,
          aspectRatio: ratio,
          fit: "cover",
        });

        assert.match(className, /w-full/);

        if (ratio === "original") {
          assert.doesNotMatch(className, /aspect-/);
          assert.doesNotMatch(className, /object-/);
        } else {
          assert.match(className, /aspect-/);
          assert.match(className, /object-cover|object-contain/);
        }
      }
    }
  });

  it("respects focal points only for covered crops and keeps missing media safe", () => {
    assert.deepEqual(
      getFocalPointStyle({ focalX: 25, focalY: 80 }, { size: "full", aspectRatio: "4:3", fit: "contain" }),
      {},
    );

    assert.deepEqual(
      getFocalPointStyle({ focalX: 25, focalY: 80 }, { size: "full", aspectRatio: "original", fit: "cover" }),
      {},
    );

    assert.deepEqual(
      getFocalPointStyle({ focalX: 25 }, { size: "full", aspectRatio: "16:9", fit: "cover" }),
      {},
    );

    assert.deepEqual(
      getFocalPointStyle({ focalX: 25, focalY: 80 }, { size: "full", aspectRatio: "16:9", fit: "cover" }),
      { objectPosition: "25% 80%" },
    );
  });

  it("allows block-specific size classes while keeping shared ratio and fit presets", () => {
    const className = getImagePresentationClassName(
      { size: "small", aspectRatio: "1:1", fit: "cover" },
      { sizeClassNames: { small: "w-28 max-w-full mx-auto" } },
    );

    assert.match(className, /w-28/);
    assert.match(className, /aspect-square/);
    assert.match(className, /object-cover/);
    assert.doesNotMatch(className, /lg:max-w-xs/);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getFocalPointStyle,
  getImagePresentationAspectRatio,
  getImagePresentationClassName,
  getImagePresentationFitClassName,
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

  it("applies per-occurrence crop focus and rotation without changing Media", () => {
    const presentation = {
      size: "full",
      aspectRatio: "16:9",
      fit: "cover",
      canvas: {
        crop: { x: 20, y: 10, width: 50, height: 50 },
        focalPoint: { x: 45, y: 35 },
        rotation: 90,
      },
    } as const;

    const style = getFocalPointStyle({ width: 1200, height: 800 }, presentation);
    assert.equal(style.objectPosition, "45% 35%");
    assert.match(String(style.transform), /rotate\(90deg\)/);
    assert.equal(getImagePresentationAspectRatio(presentation), 16 / 9);
  });

  it("uses a free crop as the frame ratio when the original ratio is selected", () => {
    assert.equal(
      getImagePresentationAspectRatio({
        aspectRatio: "original",
        canvas: {
          crop: { x: 0, y: 25, width: 100, height: 50 },
          focalPoint: { x: 50, y: 50 },
          rotation: 0,
        },
      }, { width: 1200, height: 800 }),
      3,
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

  it("returns fit classes separately for fill-based renderers", () => {
    assert.equal(
      getImagePresentationFitClassName({ size: "full", aspectRatio: "16:9", fit: "contain" }),
      "object-contain",
    );
    assert.equal(
      getImagePresentationFitClassName({ size: "full", aspectRatio: "original", fit: "cover" }),
      "",
    );
  });
});

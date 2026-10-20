import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_IMAGE_CANVAS,
  getCropCenter,
  getImageCanvasZoom,
  normalizeImageCanvasValue,
  rotateImageCanvasValue,
  validateImageCanvasValue,
} from "./image-presentation.ts";

describe("non-destructive image presentation", () => {
  it("normalizes missing and unsafe values without changing the media asset", () => {
    assert.deepEqual(normalizeImageCanvasValue(undefined), DEFAULT_IMAGE_CANVAS);
    assert.deepEqual(
      normalizeImageCanvasValue({
        crop: { x: 98, y: -2, width: 40, height: 1 },
        focalPoint: { x: 120, y: -10 },
        rotation: 45,
      }),
      {
        crop: { x: 95, y: 0, width: 5, height: 5 },
        focalPoint: { x: 100, y: 0 },
        rotation: 0,
      },
    );
  });

  it("validates the persisted percentage contract", () => {
    assert.equal(validateImageCanvasValue(DEFAULT_IMAGE_CANVAS), true);
    assert.match(
      String(validateImageCanvasValue({
        crop: { x: 90, y: 0, width: 20, height: 100 },
        focalPoint: { x: 50, y: 50 },
        rotation: 0,
      })),
      /area de corte/i,
    );
  });

  it("rotates crop and focal coordinates with the occurrence", () => {
    const rotated = rotateImageCanvasValue({
      crop: { x: 10, y: 20, width: 30, height: 40 },
      focalPoint: { x: 25, y: 70 },
      rotation: 0,
    }, "clockwise");

    assert.deepEqual(rotated, {
      crop: { x: 40, y: 10, width: 40, height: 30 },
      focalPoint: { x: 30, y: 25 },
      rotation: 90,
    });
  });

  it("derives focus and bounded zoom from the selected crop", () => {
    assert.deepEqual(
      getCropCenter({ x: 10, y: 20, width: 40, height: 20 }),
      { x: 30, y: 30 },
    );
    assert.equal(getImageCanvasZoom({
      ...DEFAULT_IMAGE_CANVAS,
      crop: { x: 25, y: 25, width: 50, height: 50 },
    }), 2);
  });
});

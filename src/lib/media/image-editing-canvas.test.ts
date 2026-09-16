import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateImageCanvasOperations } from "./image-editing-canvas.ts";

describe("image editing canvas", () => {
  it("accepts bounded operations without an arbitrary CSS or pixel crop", () => {
    assert.deepEqual(validateImageCanvasOperations({ rotate: 90, resize: { width: 1200 }, aspectRatio: "16:9" }), {
      rotate: 90,
      resize: { width: 1200 },
      aspectRatio: "16:9",
    });
  });

  it("rejects invalid operations before reading or writing media", () => {
    assert.throws(() => validateImageCanvasOperations({ rotate: 45 }));
    assert.throws(() => validateImageCanvasOperations({ resize: { width: 10001 } }));
    assert.throws(() => validateImageCanvasOperations({ focalPoint: { x: 101, y: 50 } }));
  });
});
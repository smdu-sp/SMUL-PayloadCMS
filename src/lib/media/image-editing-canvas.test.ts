import assert from "node:assert/strict";
import { describe, it } from "node:test";
import sharp from "sharp";
import { canUseImageEditingCanvas } from "../../access/roles.ts";
import {
  cropToPixels,
  processImageTransform,
  normalizeAltText,
  validateCanvasTransformPayload,
} from "./image-editing-canvas.ts";

describe("image editing canvas", () => {
  it("converts percentage crop coordinates to exact pixels", () => {
    assert.deepEqual(cropToPixels({ x: 10, y: 20, width: 50, height: 40, unit: "%" }, 1000, 500), {
      left: 100,
      top: 100,
      width: 500,
      height: 200,
    });
  });

  it("creates a transformed buffer without mutating the original buffer", async () => {
    const original = await sharp({ create: { width: 100, height: 50, channels: 3, background: "red" } }).png().toBuffer();
    const originalSnapshot = Buffer.from(original);
    const result = await processImageTransform(original, {
      originalMediaId: "1",
      crop: { x: 0, y: 0, width: 50, height: 100, unit: "%" },
      resize: { width: 20 },
      rotate: 90,
      focalPoint: { x: 50, y: 50 },
      altText: "Recorte da imagem",
    });
    assert.deepEqual(original, originalSnapshot);
    assert.equal(result.metrics.width, 20);
    assert.equal(result.metrics.height, 10);
    assert.notDeepEqual(result.buffer, original);
  });

  it("uses swapped dimensions when rotating before cropping", async () => {
    const original = await sharp({ create: { width: 100, height: 50, channels: 3, background: "red" } }).png().toBuffer();
    const result = await processImageTransform(original, {
      originalMediaId: "1",
      crop: { x: 0, y: 0, width: 100, height: 50, unit: "px" },
      resize: {},
      rotate: 90,
      focalPoint: { x: 50, y: 50 },
      altText: "Imagem girada",
    });
    assert.equal(result.metrics.width, 50);
    assert.equal(result.metrics.height, 100);
  });

  it("rejects malformed or unauthorized transform data before processing", () => {
    assert.equal(canUseImageEditingCanvas(null), false);
    assert.equal(canUseImageEditingCanvas({ role: "editor" }), false);
    assert.throws(() => validateCanvasTransformPayload({ rotate: 45 }));
    assert.doesNotThrow(() => validateCanvasTransformPayload({
      originalMediaId: "1",
      crop: { x: 0, y: 0, width: 100, height: 100, unit: "%" },
      resize: {},
      rotate: 0,
      focalPoint: { x: 50, y: 50 },
      altText: "",
    }));
    assert.throws(() => validateCanvasTransformPayload({
      originalMediaId: "1",
      crop: { x: 0, y: 0, width: 100, height: 100, unit: "%" },
      resize: {},
      rotate: 0,
      focalPoint: { x: 101, y: 50 },
    }));
  });

  it("normalizes alternative text for duplicate detection", () => {
    assert.equal(normalizeAltText("  Foto da Fachada  "), "foto da fachada");
    assert.equal(normalizeAltText("foto   da fachada"), "foto da fachada");
    assert.equal(normalizeAltText("FÓTO DA FACHADA"), "foto da fachada");
  });

  it("ignores the current media asset when checking duplicate alt text", () => {
    const media = [
      { id: 1, alt: "Foto da Fachada" },
      { id: 2, alt: "Outro texto" },
    ];

    assert.equal(hasDuplicateAltText(media, "foto da fachada", 1), false);
    assert.equal(hasDuplicateAltText(media, "foto da fachada", 99), true);
  });
});
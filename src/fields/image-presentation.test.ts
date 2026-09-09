import assert from "node:assert/strict";
import type { Field } from "payload";
import { describe, it } from "node:test";

import {
  createImagePresentationFields,
  imagePresentationAspectRatios,
  imagePresentationFits,
  imagePresentationSizes,
} from "./image-presentation";

describe("image presentation fields", () => {
  it("returns only closed select presets for size, ratio and fit", () => {
    const fields: Field[] = createImagePresentationFields({
      defaultSize: "medium",
      defaultAspectRatio: "4:3",
      defaultFit: "contain",
    });

    assert.equal(fields.length, 3);

    for (const field of fields) {
      assert.equal(field.type, "select");
      assert.ok(Array.isArray(field.options));
      assert.ok(field.options.length > 0);
      const options = field.options ?? [];
      assert.ok(!options.some((option) => typeof option === "string"));
    }

    const size = fields.find((field) => field.name === "size");
    const aspectRatio = fields.find((field) => field.name === "aspectRatio");
    const fit = fields.find((field) => field.name === "fit");

    assert.ok(size);
    assert.ok(aspectRatio);
    assert.ok(fit);

    assert.deepEqual(size.defaultValue, "medium");
    assert.deepEqual(aspectRatio.defaultValue, "4:3");
    assert.deepEqual(fit.defaultValue, "contain");

    assert.deepEqual(imagePresentationSizes, ["small", "medium", "large", "full"]);
    assert.deepEqual(imagePresentationAspectRatios, ["original", "1:1", "4:3", "16:9", "portrait"]);
    assert.deepEqual(imagePresentationFits, ["cover", "contain"]);
  });

  it("accepts approved values and rejects values outside the allowed presets", () => {
    const fields: Field[] = createImagePresentationFields();
    const sizeField = fields.find((field) => field.name === "size");
    const ratioField = fields.find((field) => field.name === "aspectRatio");
    const fitField = fields.find((field) => field.name === "fit");

    assert.ok(sizeField?.validate);
    assert.ok(ratioField?.validate);
    assert.ok(fitField?.validate);

    assert.equal(sizeField.validate("large", {} as never), true);
    assert.equal(ratioField.validate("16:9", {} as never), true);
    assert.equal(fitField.validate("cover", {} as never), true);

    assert.equal(sizeField.validate("tiny", {} as never), "Escolha um tamanho de exibição aprovado.");
    assert.equal(ratioField.validate("21:9", {} as never), "Escolha uma proporção aprovada.");
    assert.equal(fitField.validate("fill", {} as never), "Escolha um ajuste aprovado.");
  });
});

import assert from "node:assert/strict";
import type { Field } from "payload";
import { describe, it } from "node:test";

import {
  createImagePresentationFields,
  imagePresentationAspectRatios,
  imagePresentationFits,
  imagePresentationSizes,
} from "./image-presentation";

type NamedField = Field & {
  defaultValue?: unknown;
  name: string;
  validate?: (value: unknown, options: never) => unknown;
};

function findNamedField(fields: Field[], name: string): NamedField | undefined {
  return fields.find(
    (field): field is NamedField => "name" in field && field.name === name,
  );
}

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

    const size = findNamedField(fields, "size");
    const aspectRatio = findNamedField(fields, "aspectRatio");
    const fit = findNamedField(fields, "fit");

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
    const sizeField = findNamedField(fields, "size");
    const ratioField = findNamedField(fields, "aspectRatio");
    const fitField = findNamedField(fields, "fit");

    assert.ok(sizeField?.validate);
    assert.ok(ratioField?.validate);
    assert.ok(fitField?.validate);

    assert.equal(sizeField.validate("large", {} as never), true);
    assert.equal(ratioField.validate("16:9", {} as never), true);
    assert.equal(fitField.validate("cover", {} as never), true);

    assert.equal(sizeField.validate("tiny", {} as never), "Escolha um tamanho de exibicao aprovado.");
    assert.equal(ratioField.validate("21:9", {} as never), "Escolha uma proporcao aprovada.");
    assert.equal(fitField.validate("fill", {} as never), "Escolha um ajuste aprovado.");
  });

  it("can be constrained to block-specific presentation presets", () => {
    const fields: Field[] = createImagePresentationFields({
      sizes: ["small", "medium", "large"],
      aspectRatios: ["original", "1:1", "4:3", "16:9"],
      defaultSize: "medium",
      defaultAspectRatio: "original",
    });
    const sizeField = findNamedField(fields, "size");
    const ratioField = findNamedField(fields, "aspectRatio");

    assert.ok(sizeField);
    assert.ok(ratioField);
    assert.equal(sizeField.validate?.("full", {} as never), "Escolha um tamanho de exibicao aprovado.");
    assert.equal(ratioField.validate?.("portrait", {} as never), "Escolha uma proporcao aprovada.");
    assert.equal(ratioField.validate?.("square", {} as never), "Escolha uma proporcao aprovada.");
    assert.equal(ratioField.validate?.("1:1", {} as never), true);
  });
});

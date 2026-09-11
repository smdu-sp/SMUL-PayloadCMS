import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  STANDARD_ICONS,
  STANDARD_ICON_LABELS,
  STANDARD_ICON_OPTIONS,
  isStandardIcon,
  normalizeStandardIcon,
  validateStandardIcon,
} from "./icons.ts";

describe("domain icons catalog", () => {
  it("contains every standard icon required by SPEC-035", () => {
    assert.deepEqual(STANDARD_ICONS, [
      "info",
      "warning",
      "document",
      "building",
      "location",
      "phone",
      "email",
      "check",
      "arrow",
      "external-link",
    ]);
  });

  it("maps human-readable labels and CMS options for each icon", () => {
    assert.equal(STANDARD_ICON_OPTIONS.length, STANDARD_ICONS.length);

    for (const name of STANDARD_ICONS) {
      assert.ok(STANDARD_ICON_LABELS[name], `Missing label for ${name}`);
      const option = STANDARD_ICON_OPTIONS.find((opt) => opt.value === name);
      assert.ok(option, `Missing option for ${name}`);
      assert.equal(option.label, STANDARD_ICON_LABELS[name]);
    }
  });

  it("validates standard icon names and rejects arbitrary strings or SVG markup", () => {
    assert.equal(isStandardIcon("location"), true);
    assert.equal(isStandardIcon("warning"), true);

    assert.equal(isStandardIcon("arbitrary-icon"), false);
    assert.equal(isStandardIcon("<svg><path/></svg>"), false);
    assert.equal(isStandardIcon(null), false);
    assert.equal(isStandardIcon(undefined), false);
    assert.equal(isStandardIcon(123), false);

    assert.equal(validateStandardIcon("location"), true);
    assert.equal(
      validateStandardIcon("<svg>"),
      "Selecione um ícone padrão válido do catálogo.",
    );
  });

  it("normalizes icon names with fallback", () => {
    assert.equal(normalizeStandardIcon("phone"), "phone");
    assert.equal(normalizeStandardIcon("invalid-icon"), "info");
    assert.equal(normalizeStandardIcon(undefined, "document"), "document");
  });
});

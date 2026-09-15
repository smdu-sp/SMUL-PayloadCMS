import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isHexColor } from "./colors";
import { DEFAULT_THEME, resolveThemeColors } from "./default-theme";
import { readFileSync } from "node:fs";
import { mapThemeToCssVariables } from "./map-theme-to-css-variables";

describe("theme mapping", () => {
  it("maps valid branding colors to css variables", () => {
    const variables = mapThemeToCssVariables({
      branding: {
        primaryColor: "#00529C",
        secondaryColor: "#103b3f",
        accentColor: "#fff4cc",
      },
    });

    assert.equal(variables["--color-primary"], "#00529c");
    assert.equal(variables["--color-brand"], "#00529c");
    assert.equal(variables["--color-secondary"], "#103b3f");
    assert.equal(variables["--color-accent"], "#fff4cc");
  });

  it("falls back to SMUL defaults for invalid branding values", () => {
    const variables = mapThemeToCssVariables({
      branding: {
        primaryColor: "url(javascript:alert(1))",
        secondaryColor: "<script>",
        accentColor: "",
      },
    });

    assert.deepEqual(variables, mapThemeToCssVariables(null));
    assert.equal(variables["--color-primary"], DEFAULT_THEME.primaryColor);
  });

  it("restores all default tokens after clearing legacy overrides", () => {
    const resetBranding = { primaryColor: null, secondaryColor: null, accentColor: null };
    assert.deepEqual(resolveThemeColors(resetBranding), DEFAULT_THEME);
    assert.deepEqual(mapThemeToCssVariables({ branding: resetBranding }), mapThemeToCssVariables(null));
    assert.deepEqual(resolveThemeColors({ primaryColor: "#ABC" }), {
      ...DEFAULT_THEME,
      primaryColor: "#abc",
    });
  });

  it("keeps code defaults aligned with the standalone CSS fallback", () => {
    const css = readFileSync(new URL("../../styles/tokens.css", import.meta.url), "utf8");
    for (const [field, token] of [
      ["primaryColor", "primary"],
      ["secondaryColor", "secondary"],
      ["accentColor", "accent"],
    ] as const) {
      assert.ok(css.includes(`--color-${token}: ${DEFAULT_THEME[field]};`));
    }
  });

  it("accepts only short or long hex colors", () => {
    assert.equal(isHexColor("#fff"), true);
    assert.equal(isHexColor("#ffffff"), true);
    assert.equal(isHexColor("rgb(0, 0, 0)"), false);
    assert.equal(isHexColor("#ffff"), false);
  });
});

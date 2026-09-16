import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getContrastRatio, hasMinimumContrast, isHexColor } from "./colors";
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
        backgroundColor: "#fafafa",
        headlineColor: "#112233",
        paragraphColor: "#334455",
        buttonColor: "#445566",
        buttonTextColor: "#fefefe",
        strokeColor: "#111111",
        mainColor: "#eeeeee",
        highlightColor: "#667788",
        secondaryIllustrationColor: "#778899",
        tertiaryColor: "#8899aa",
      },
    });

    assert.equal(variables["--color-background"], "#fafafa");
    assert.equal(variables["--color-page"], "#fafafa");
    assert.equal(variables["--color-foreground"], "#334455");
    assert.equal(variables["--color-text"], "#334455");
    assert.equal(variables["--color-primary"], "#445566");
    assert.equal(variables["--color-brand"], "#445566");
    assert.equal(variables["--color-action"], "#445566");
    assert.equal(variables["--color-action-foreground"], "#fefefe");
    assert.equal(variables["--color-heading"], "#112233");
    assert.equal(variables["--color-headline"], "#112233");
    assert.equal(variables["--color-paragraph"], "#334455");
    assert.equal(variables["--color-link"], "#445566");
    assert.equal(variables["--color-secondary"], "#778899");
    assert.equal(variables["--color-secondary-accent"], "#778899");
    assert.equal(variables["--color-accent"], "#667788");
    assert.equal(variables["--color-highlight"], "#667788");
    assert.equal(variables["--color-tertiary-accent"], "#8899aa");
    assert.equal(variables["--color-illustration-stroke"], "#111111");
    assert.equal(variables["--color-illustration-main"], "#eeeeee");
  });

  it("ignores persisted legacy colors when resolving the current palette", () => {
    const variables = mapThemeToCssVariables({
      branding: {
        primaryColor: "#00529C",
        secondaryColor: "#103b3f",
        accentColor: "#fff4cc",
      },
    });

    assert.deepEqual(variables, mapThemeToCssVariables(null));
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
    const resetBranding = {
      accentColor: null,
      actionColor: null,
      actionForegroundColor: null,
      backgroundColor: null,
      buttonColor: null,
      buttonTextColor: null,
      headlineColor: null,
      highlightColor: null,
      linkColor: null,
      mainColor: null,
      paragraphColor: null,
      primaryColor: null,
      secondaryAccentColor: null,
      secondaryIllustrationColor: null,
      secondaryColor: null,
      strokeColor: null,
      tertiaryAccentColor: null,
      tertiaryColor: null,
    };
    assert.deepEqual(resolveThemeColors(resetBranding), DEFAULT_THEME);
    assert.deepEqual(mapThemeToCssVariables({ branding: resetBranding }), mapThemeToCssVariables(null));
    assert.deepEqual(resolveThemeColors({ primaryColor: "#ABC" }), DEFAULT_THEME);
  });

  it("keeps code defaults aligned with the standalone CSS fallback", () => {
    const css = readFileSync(new URL("../../styles/tokens.css", import.meta.url), "utf8");
    for (const [field, token] of [
      ["backgroundColor", "background"],
      ["primaryColor", "primary"],
      ["secondaryColor", "secondary"],
      ["accentColor", "accent"],
      ["tertiaryAccentColor", "accent-pink"],
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

  it("validates WCAG contrast ratios for custom color pairs", () => {
    assert.equal(hasMinimumContrast("#0a3299", "#ffffff"), true);
    assert.equal(hasMinimumContrast("#5cd6c9", "#ffffff"), false);
    assert.ok((getContrastRatio("#000", "#fff") ?? 0) >= 21);
  });
});

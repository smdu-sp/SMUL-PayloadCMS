import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getContrastRatio, hasMinimumContrast, isHexColor } from "./colors";
import { DEFAULT_PALETTE, SYSTEM_COLORS } from "./default-theme";
import { resolveSemanticTheme, validateBasePalette } from "./semantic-theme";
import { mapThemeToCssVariables } from "./map-theme-to-css-variables";

describe("global semantic theme", () => {
  it("keeps the five base inputs independent and derives paired roles", () => {
    const theme = resolveSemanticTheme({ background: "#111111", foreground: "#ffffff", brand: "#ffff00", action: "#ff00ff", accent: "#00ff00" });
    assert.equal(theme.brand, "#ffff00");
    assert.equal(theme.action, "#ff00ff");
    assert.equal(theme.heading, theme.foreground);
    for (const [bg, fg] of [[theme.background, theme.foreground], [theme.surface, theme.surfaceForeground], [theme.muted, theme.mutedForeground], [theme.brand, theme.brandForeground], [theme.action, theme.actionForeground], [theme.accent, theme.accentForeground]]) {
      assert.ok(hasMinimumContrast(fg, bg), bg);
    }
    assert.equal(theme.focus, SYSTEM_COLORS.focus);
    assert.equal(theme.info, SYSTEM_COLORS.info);
    const variables = mapThemeToCssVariables(theme);
    assert.equal(variables["--color-brand"], "#ffff00");
    assert.equal(variables["--color-action"], "#ff00ff");
    assert.equal(variables["--color-surface-foreground"], theme.surfaceForeground);
    assert.equal(variables["--block-foreground"], "#ffffff");
    assert.equal(variables["--block-border"], theme.border);
    assert.equal(Object.keys(variables).length, 26);
    for (const name of ["primary", "secondary", "headline", "paragraph", "highlight", "link", "illustration-main"]) {
      assert.equal(variables[`--color-${name}`], undefined);
    }
  });
  it("resets the five inputs to institutional defaults without aliases", () => {
    const reset = { background: null, foreground: null, brand: null, action: null, accent: null };
    assert.deepEqual(resolveSemanticTheme(reset), resolveSemanticTheme());
    assert.equal(resolveSemanticTheme().brand, DEFAULT_PALETTE.brand);
    assert.deepEqual(resolveSemanticTheme({ brand: "<script>", action: "url(evil)" }), resolveSemanticTheme());
  });
  it("validates pairs and protects rendering from malformed data", () => {
    assert.equal(validateBasePalette({}), true);
    assert.notEqual(validateBasePalette({ background: "#fff", foreground: "#fff" }), true);
    assert.notEqual(validateBasePalette({ brand: "red" }), true);
    assert.ok(hasMinimumContrast(resolveSemanticTheme({ background: "#fff", foreground: "#fff" }).foreground, "#fff"));
    assert.equal(resolveSemanticTheme({}, { heading: "#000" }).heading, "#000");
    assert.equal(resolveSemanticTheme({}, { heading: "#fff" }).heading, DEFAULT_PALETTE.foreground);
  });
  it("accepts only short or long hex and computes contrast", () => {
    assert.equal(isHexColor("#fff"), true);
    assert.equal(isHexColor("#ffffff"), true);
    assert.equal(isHexColor("rgb(0, 0, 0)"), false);
    assert.equal(isHexColor("#ffff"), false);
    assert.ok((getContrastRatio("#000", "#fff") ?? 0) >= 21);
  });
});

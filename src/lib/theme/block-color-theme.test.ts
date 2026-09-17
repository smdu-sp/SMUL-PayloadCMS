import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { colorSchemes, mapBlockColorThemeToCssVariables, normalizeColorScheme, resolveBlockColorTheme, validateColorOverrides } from "./block-color-theme";
import { hasMinimumContrast } from "./colors";
import { resolveSemanticTheme } from "./semantic-theme";

describe("complete color recipes", () => {
  const themes = [
    resolveSemanticTheme(),
    resolveSemanticTheme({ background: "#171022", foreground: "#f9f3ff", brand: "#f7d000", action: "#fc78dd", accent: "#4cff9f" }),
    resolveSemanticTheme({ background: "#fafafa", foreground: "#222", brand: "#ddd", action: "#fff", accent: "#fff" }),
  ];
  it("resolves six readable roles for every scheme and palette", () => {
    for (const global of themes) for (const scheme of colorSchemes) {
      const scope = resolveBlockColorTheme(global, scheme);
      assert.equal(Object.keys(scope).length, 6);
      for (const fg of [scope.foreground, scope.heading, scope.accent]) assert.ok(hasMinimumContrast(fg, scope.background), scheme);
      assert.ok(hasMinimumContrast(scope.actionForeground, scope.action), scheme);
      assert.ok(hasMinimumContrast(scope.action, scope.background, 3), scheme);
      assert.equal(Object.keys(mapBlockColorThemeToCssVariables(scope)).length, 6);
    }
  });
  it("keeps neutral surfaces independent of dark global foreground", () => {
    const global = themes[1];
    assert.equal(resolveBlockColorTheme(global, "surface").foreground, global.surfaceForeground);
    assert.equal(resolveBlockColorTheme(global, "muted").foreground, global.mutedForeground);
    assert.notEqual(resolveBlockColorTheme(global, "surface").foreground, global.foreground);
  });
  it("does not preserve primary or secondary scheme aliases", () => {
    assert.equal(normalizeColorScheme("primary"), "default");
    assert.equal(normalizeColorScheme("secondary"), "default");
    assert.equal(normalizeColorScheme("inverse"), "inverse");
    assert.equal(normalizeColorScheme("unknown", "surface"), "surface");
  });
  it("uses the same pipeline for partial custom surfaces and actions", () => {
    const scope = resolveBlockColorTheme(themes[1], "brand", { background: "#fff", foreground: "#123", accent: "#345" });
    assert.equal(scope.background, "#fff");
    assert.equal(scope.foreground, "#123");
    assert.equal(scope.heading, "#123");
    assert.equal(scope.accent, "#345");
    assert.ok(hasMinimumContrast(scope.actionForeground, scope.action));
    assert.equal(validateColorOverrides(themes[1], "surface", { foreground: "#fff" }) === true, false);
    assert.equal(validateColorOverrides(themes[1], "default", { foreground: "#fff" }), true);
    assert.deepEqual(resolveBlockColorTheme(themes[0], "surface", { background: "url(evil)" }), resolveBlockColorTheme(themes[0], "surface"));
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveBlockColorTheme } from "./block-color-theme";
import { getContrastRatio } from "./colors";
import {
  ACCESSIBILITY_THEME_CSS,
  ACCESSIBLE_PALETTES,
  ACCESSIBLE_SEMANTIC_THEMES,
  normalizeAccessibilityThemeMode,
} from "./accessible-palettes";

describe("accessible color palettes", () => {
  it("keeps the approved document values in code", () => {
    assert.deepEqual(ACCESSIBLE_PALETTES.highContrast, {
      background: "#000000",
      foreground: "#FFFFFF",
      brand: "#FFB000",
      action: "#00FFFF",
      accent: "#FF00FF",
    });
    assert.deepEqual(ACCESSIBLE_PALETTES.colorBlind, {
      background: "#FFFFFF",
      foreground: "#212121",
      brand: "#0072B2",
      action: "#D55E00",
      accent: "#E69F00",
    });
  });

  it("normalizes persisted preferences safely", () => {
    assert.equal(normalizeAccessibilityThemeMode("highContrast"), "highContrast");
    assert.equal(normalizeAccessibilityThemeMode("colorBlind"), "colorBlind");
    assert.equal(normalizeAccessibilityThemeMode("<script>"), "default");
  });

  it("resolves readable text for every accessible block scheme", () => {
    for (const theme of Object.values(ACCESSIBLE_SEMANTIC_THEMES)) {
      for (const scheme of ["default", "surface", "muted", "brand", "accent", "inverse"] as const) {
        const block = resolveBlockColorTheme(theme, scheme);
        assert.ok(
          (getContrastRatio(block.foreground, block.background) ?? 0) >= 4.5,
          `${scheme}: ${block.foreground} sobre ${block.background}`,
        );
      }
    }
  });

  it("generates global overrides for the frontend and admin", () => {
    assert.match(ACCESSIBILITY_THEME_CSS, /data-accessibility-theme="highContrast"/);
    assert.match(ACCESSIBILITY_THEME_CSS, /data-accessibility-theme="colorBlind"/);
    assert.match(ACCESSIBILITY_THEME_CSS, /--color-background:#000000 !important/);
    assert.match(ACCESSIBILITY_THEME_CSS, /--admin-sidebar-bg:#000000 !important/);
    assert.match(ACCESSIBILITY_THEME_CSS, /data-color-scheme="brand"/);
  });
});

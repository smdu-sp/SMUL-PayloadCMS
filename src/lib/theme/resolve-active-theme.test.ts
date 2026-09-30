import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getRelationshipId,
  resolveActiveThemeConfiguration,
} from "./resolve-active-theme.ts";

describe("active theme resolution", () => {
  it("prefers a populated active theme over the embedded compatibility theme", () => {
    const result = resolveActiveThemeConfiguration({
      activeTheme: {
        id: 12,
        colors: { background: "#000000", foreground: "#ffffff" },
        typography: { bodyUrl: "https://fonts.googleapis.com/css2?family=Inter" },
      },
      theme: {
        colors: { background: "#ffffff", foreground: "#000000" },
      },
    });

    assert.equal(result.source, "active");
    assert.equal(result.colors?.background, "#000000");
    assert.equal(result.typography?.bodyUrl, "https://fonts.googleapis.com/css2?family=Inter");
  });

  it("preserves the embedded theme when no populated alternative is available", () => {
    const legacy = {
      colors: { background: "#ffffff", foreground: "#1e293b" },
      typography: { headingUrl: "https://fonts.googleapis.com/css2?family=Montserrat" },
    };

    assert.deepEqual(resolveActiveThemeConfiguration({ theme: legacy }), {
      ...legacy,
      source: "legacy",
    });
    assert.deepEqual(
      resolveActiveThemeConfiguration({ activeTheme: 3, theme: legacy }),
      { ...legacy, source: "legacy" },
    );
  });

  it("returns code defaults when settings contain no theme", () => {
    assert.deepEqual(resolveActiveThemeConfiguration(null), { source: "default" });
  });

  it("normalizes relationship ids for deletion protection", () => {
    assert.equal(getRelationshipId(4), 4);
    assert.equal(getRelationshipId("theme-id"), "theme-id");
    assert.equal(getRelationshipId({ id: 9 }), 9);
    assert.equal(getRelationshipId(null), null);
  });
});

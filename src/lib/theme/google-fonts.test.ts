import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getTypographyStylesheets,
  mapTypographyToCssVariables,
  resolveGoogleFont,
  resolveTypography,
  validateGoogleFontUrl,
} from "./google-fonts";

describe("global Google Fonts typography", () => {
  it("accepts one CSS v2 family and forces display swap", () => {
    const font = resolveGoogleFont(
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700",
    );

    assert.equal(font?.family, "Roboto");
    assert.match(font?.href ?? "", /display=swap/);
    assert.equal(validateGoogleFontUrl(font?.href), true);
  });

  it("rejects unsafe, restricted or ambiguous URLs", () => {
    for (const value of [
      "https://example.com/font.css",
      "http://fonts.googleapis.com/css2?family=Roboto",
      "https://fonts.googleapis.com/css2?family=Roboto&family=Inter",
      "https://fonts.googleapis.com/css2?family=Roboto&text=abc",
      "javascript:alert(1)",
    ]) {
      assert.equal(resolveGoogleFont(value), null, value);
      assert.notEqual(validateGoogleFontUrl(value), true, value);
    }
  });

  it("maps body and heading roles to the existing CSS token hierarchy", () => {
    const typography = resolveTypography({
      bodyUrl: "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700",
      headingUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700",
    });
    const variables = mapTypographyToCssVariables(typography);

    assert.match(variables["--font-family-sans"], /^"Source Sans 3"/);
    assert.match(variables["--font-family-heading"], /^"Montserrat"/);
    assert.deepEqual(getTypographyStylesheets(typography), [
      typography.body?.href,
      typography.heading?.href,
    ]);
  });

  it("makes headings inherit a configured body font", () => {
    const variables = mapTypographyToCssVariables(resolveTypography({
      bodyUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700",
    }));

    assert.equal(
      variables["--font-family-heading"],
      variables["--font-family-sans"],
    );
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveOfficialHttpsUrl, validateOfficialHttpsUrl } from "./official-url";

describe("official URLs", () => {
  it("accepts HTTPS and rejects unsafe or malformed destinations", () => {
    assert.equal(resolveOfficialHttpsUrl("https://example.gov.br/servico"), "https://example.gov.br/servico");
    assert.equal(resolveOfficialHttpsUrl("http://example.gov.br"), null);
    assert.equal(resolveOfficialHttpsUrl("javascript:alert(1)"), null);
    assert.equal(validateOfficialHttpsUrl("https://example.gov.br"), true);
    assert.notEqual(validateOfficialHttpsUrl("sem-url"), true);
  });
});

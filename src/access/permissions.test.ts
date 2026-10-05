import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PERMISSIONS } from "./permissions.ts";

describe("permission catalog", () => {
  it("contains unique, namespaced permissions", () => {
    assert.equal(new Set(PERMISSIONS).size, PERMISSIONS.length);

    for (const permission of PERMISSIONS) {
      assert.match(permission, /^[a-z][A-Za-z]*\.[A-Za-z]+$/);
    }
  });

  it("contains the permissions enforced by the CMS", () => {
    assert.ok(PERMISSIONS.includes("admin.access"));
    assert.ok(PERMISSIONS.includes("pages.preview"));
    assert.ok(PERMISSIONS.includes("users.assignRole"));
    assert.ok(PERMISSIONS.includes("auditLogs.read"));
  });
});

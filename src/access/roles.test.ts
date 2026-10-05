import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { normalizeRole, roleOptions, USER_ROLES } from "./roles.ts";

describe("CMS roles", () => {
  it("normalizes only the registered roles", () => {
    assert.equal(normalizeRole("admin"), "admin");
    assert.equal(normalizeRole("editor"), "editor");
    assert.equal(normalizeRole(null), null);
    assert.equal(normalizeRole(undefined), null);
    assert.equal(normalizeRole("viewer"), null);
    assert.equal(normalizeRole(""), null);
  });

  it("keeps labels and role values in one catalog", () => {
    assert.deepEqual(USER_ROLES, ["admin", "editor"]);
    assert.deepEqual(
      roleOptions.map(({ value }) => value),
      USER_ROLES,
    );
  });
});

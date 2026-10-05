import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PERMISSIONS } from "./permissions.ts";
import { rolePermissions } from "./role-permissions.ts";

describe("role permission matrix", () => {
  it("grants every registered permission to Admin", () => {
    assert.deepEqual(rolePermissions.admin, [...PERMISSIONS]);
  });

  it("grants Editor editorial permissions only", () => {
    assert.ok(rolePermissions.editor.includes("pages.update"));
    assert.ok(rolePermissions.editor.includes("pages.publish"));
    assert.ok(rolePermissions.editor.includes("pages.preview"));
    assert.ok(rolePermissions.editor.includes("media.update"));
    assert.ok(rolePermissions.editor.includes("header.update"));
    assert.ok(rolePermissions.editor.includes("footer.update"));
    assert.equal(
      (rolePermissions.editor as readonly string[]).includes("pages.delete"),
      false,
    );
    assert.equal(
      (rolePermissions.editor as readonly string[]).includes("users.update"),
      false,
    );
    assert.equal(
      (rolePermissions.editor as readonly string[]).includes("themes.update"),
      false,
    );
    assert.equal(
      (rolePermissions.editor as readonly string[]).includes("auditLogs.read"),
      false,
    );
  });
});

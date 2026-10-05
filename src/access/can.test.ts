import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { can } from "./can.ts";

describe("can", () => {
  const admin = { role: "admin" };
  const editor = { role: "editor" };

  it("evaluates permissions through the role matrix", () => {
    assert.equal(can(admin, "pages.delete"), true);
    assert.equal(can(editor, "pages.delete"), false);
    assert.equal(can(editor, "pages.update"), true);
    assert.equal(can(editor, "pages.publish"), true);
    assert.equal(can(editor, "users.update"), false);
    assert.equal(can(admin, "users.assignRole"), true);
    assert.equal(can(editor, "users.assignRole"), false);
  });

  it("fails closed for missing and unknown roles", () => {
    assert.equal(can(null, "admin.access"), false);
    assert.equal(can(undefined, "admin.access"), false);
    assert.equal(can({}, "admin.access"), false);
    assert.equal(can({ role: null }, "admin.access"), false);
    assert.equal(can({ role: "viewer" }, "admin.access"), false);
  });
});

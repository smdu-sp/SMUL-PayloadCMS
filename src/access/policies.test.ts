import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Access, FieldAccess } from "payload";

import { AuditLogs } from "../collections/AuditLogs.ts";
import { Media } from "../collections/Media.ts";
import { Pages } from "../collections/Pages.ts";
import { Themes } from "../collections/Themes.ts";
import { Users } from "../collections/Users.ts";
import { Footer } from "../globals/Footer.ts";
import { Header } from "../globals/Header.ts";
import { SiteSettings } from "../globals/SiteSettings.ts";
import { canReadAuditLogs } from "./policies/audit-logs.ts";
import { canReadPages, canUpdatePage } from "./policies/pages.ts";
import { canPreviewContent } from "./policies/preview.ts";
import { canAssignRole, canReadUsers } from "./policies/users.ts";

type TestUser = {
  id?: number | string;
  role?: unknown;
};

const accessArgs = (user?: TestUser | null) =>
  ({ req: { user } }) as Parameters<Access>[0];
const fieldArgs = (user?: TestUser | null) =>
  ({ req: { user } }) as Parameters<FieldAccess>[0];

describe("authorization policies", () => {
  const admin = { id: 1, role: "admin" };
  const editor = { id: 2, role: "editor" };

  it("preserves public reads and limits anonymous Page reads", () => {
    assert.deepEqual(canReadPages(accessArgs(null)), {
      _status: { equals: "published" },
    });
    assert.equal(Media.access?.read?.(accessArgs(null)), true);
    assert.equal(Themes.access?.read?.(accessArgs(null)), true);
    assert.equal(Header.access?.read?.(accessArgs(null)), true);
    assert.equal(Footer.access?.read?.(accessArgs(null)), true);
    assert.equal(SiteSettings.access?.read?.(accessArgs(null)), true);
  });

  it("allows Editor content work but denies destructive and sensitive actions", () => {
    assert.equal(Pages.access?.create?.(accessArgs(editor)), true);
    assert.equal(Pages.access?.update?.(accessArgs(editor)), true);
    assert.equal(Pages.access?.delete?.(accessArgs(editor)), false);
    assert.equal(Media.access?.create?.(accessArgs(editor)), true);
    assert.equal(Media.access?.update?.(accessArgs(editor)), true);
    assert.equal(Media.access?.delete?.(accessArgs(editor)), false);
    assert.equal(Header.access?.update?.(accessArgs(editor)), true);
    assert.equal(Footer.access?.update?.(accessArgs(editor)), true);
    assert.equal(SiteSettings.access?.update?.(accessArgs(editor)), false);
    assert.equal(Themes.access?.read?.(accessArgs(editor)), false);
    assert.equal(canReadUsers(accessArgs(editor)), false);
    assert.equal(canAssignRole(fieldArgs(editor)), false);
    assert.equal(canReadAuditLogs(accessArgs(editor)), false);
    assert.equal(canPreviewContent(editor), true);
  });

  it("allows Admin sensitive actions", () => {
    assert.equal(Pages.access?.delete?.(accessArgs(admin)), true);
    assert.equal(Media.access?.delete?.(accessArgs(admin)), true);
    assert.equal(Themes.access?.create?.(accessArgs(admin)), true);
    assert.equal(Users.access?.read?.(accessArgs(admin)), true);
    assert.equal(canAssignRole(fieldArgs(admin)), true);
    assert.equal(AuditLogs.access?.read?.(accessArgs(admin)), true);
  });

  it("wires schemas to policies instead of role checks", () => {
    assert.equal(Pages.access?.read, canReadPages);
    assert.equal(Pages.access?.update, canUpdatePage);
    assert.equal(Users.access?.read, canReadUsers);
    assert.equal(AuditLogs.access?.read, canReadAuditLogs);
  });

  it("fails closed for null and unknown roles", () => {
    for (const user of [{ role: null }, { role: "viewer" }, {}]) {
      assert.equal(Pages.access?.create?.(accessArgs(user)), false);
      assert.equal(Users.access?.read?.(accessArgs(user)), false);
      assert.equal(canPreviewContent(user), false);
    }
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Access, FieldAccess } from "payload";

import {
  auditLogsAdminOnly,
  adminFieldOnly,
  adminOnly,
  adminOrEditor,
  canHardDeletePages,
  canEditContent,
  canManagePageLifecycle,
  canManageRestrictedSettings,
  canManageUsers,
  canPublishPages,
  canReadAuditLogs,
  denyAll,
  editorOrAdmin,
  getUserRole,
  isAdmin,
  isEditor,
  pageHardDeleteAdminOnly,
  pageLifecycleEditorOrAdmin,
  pagePublisherOrAdmin,
  publishedOrLoggedIn,
} from "./roles";
import { AuditLogs } from "../collections/AuditLogs";
import { Media } from "../collections/Media";
import { Pages } from "../collections/Pages";
import { Themes } from "../collections/Themes";
import { Users } from "../collections/Users";
import { Footer } from "../globals/Footer";
import { Header } from "../globals/Header";
import { SiteSettings } from "../globals/SiteSettings";

type TestUser = {
  id?: number | string;
  role?: "admin" | "editor" | null;
};

const accessArgs = (user?: TestUser | null, id?: number | string) =>
  ({
    id,
    req: {
      user,
    },
  }) as Parameters<Access>[0];

const fieldArgs = (user?: TestUser | null) =>
  ({
    req: {
      user,
    },
  }) as Parameters<FieldAccess>[0];

describe("CMS roles and permissions", () => {
  it("recognizes the initial role set", () => {
    assert.equal(getUserRole({ role: "admin" }), "admin");
    assert.equal(getUserRole({ role: "editor" }), "editor");
    assert.equal(getUserRole({ role: null }), null);
  });

  it("allows admins to manage sensitive CMS areas", () => {
    const admin = { id: 1, role: "admin" as const };

    assert.equal(isAdmin(admin), true);
    assert.equal(isEditor(admin), false);
    assert.equal(canHardDeletePages(admin), true);
    assert.equal(canManagePageLifecycle(admin), true);
    assert.equal(canManageRestrictedSettings(admin), true);
    assert.equal(canManageUsers(admin), true);
    assert.equal(canPublishPages(admin), true);
    assert.equal(canReadAuditLogs(admin), true);
    assert.equal(adminOnly(accessArgs(admin)), true);
    assert.equal(adminFieldOnly(fieldArgs(admin)), true);
  });

  it("allows editors to edit content but not sensitive areas", () => {
    const editor = { id: 2, role: "editor" as const };

    assert.equal(canEditContent(editor), true);
    assert.equal(canHardDeletePages(editor), false);
    assert.equal(canManagePageLifecycle(editor), true);
    assert.equal(canManageRestrictedSettings(editor), false);
    assert.equal(canManageUsers(editor), false);
    assert.equal(canPublishPages(editor), true);
    assert.equal(canReadAuditLogs(editor), false);
    assert.equal(editorOrAdmin(accessArgs(editor)), true);
    assert.equal(adminOrEditor(accessArgs(editor)), true);
    assert.equal(adminOnly(accessArgs(editor)), false);
    assert.equal(adminFieldOnly(fieldArgs(editor)), false);
  });

  it("rejects unauthenticated writes and limits public page reads to published docs", () => {
    assert.equal(adminOnly(accessArgs(null)), false);
    assert.equal(adminOrEditor(accessArgs(null)), false);
    assert.equal(editorOrAdmin(accessArgs(null)), false);
    assert.equal(pagePublisherOrAdmin(accessArgs(null)), false);
    assert.equal(pageLifecycleEditorOrAdmin(fieldArgs(null)), false);
    assert.equal(denyAll(accessArgs(null)), false);
    assert.deepEqual(publishedOrLoggedIn(accessArgs(null)), {
      _status: {
        equals: "published",
      },
    });
  });

  it("keeps existing users without role administratively compatible", () => {
    const legacyUser = { id: 1, role: null };

    assert.equal(isAdmin(legacyUser), true);
    assert.equal(adminOnly(accessArgs(legacyUser)), true);
  });

  it("applies the approved matrix to collections and globals", () => {
    const admin = { id: 1, role: "admin" as const };
    const editor = { id: 2, role: "editor" as const };

    assert.equal(Pages.access?.create?.(accessArgs(editor)), true);
    assert.equal(Pages.access?.update?.(accessArgs(editor)), true);
    assert.equal(Pages.access?.delete?.(accessArgs(editor)), false);
    assert.equal(Pages.access?.delete?.(accessArgs(admin)), true);
    assert.equal(pageLifecycleEditorOrAdmin(fieldArgs(editor)), true);
    assert.equal(pageLifecycleEditorOrAdmin(fieldArgs(admin)), true);

    assert.equal(Media.access?.create?.(accessArgs(editor)), true);
    assert.equal(Media.access?.update?.(accessArgs(editor)), true);
    assert.equal(Media.access?.delete?.(accessArgs(editor)), false);

    assert.equal(Themes.access?.read?.(accessArgs(null)), true);
    assert.equal(Themes.access?.create?.(accessArgs(editor)), false);
    assert.equal(Themes.access?.update?.(accessArgs(editor)), false);
    assert.equal(Themes.access?.delete?.(accessArgs(editor)), false);
    assert.equal(Themes.access?.create?.(accessArgs(admin)), true);

    assert.equal(Users.access?.read?.(accessArgs(editor)), false);
    assert.equal(Users.access?.create?.(accessArgs(editor)), false);
    assert.equal(Users.access?.update?.(accessArgs(editor)), false);
    assert.equal(Users.access?.delete?.(accessArgs(editor)), false);

    assert.equal(Header.access?.update?.(accessArgs(editor)), true);
    assert.equal(Footer.access?.update?.(accessArgs(editor)), true);
    assert.equal(SiteSettings.access?.update?.(accessArgs(editor)), false);
    assert.equal(AuditLogs.access?.read?.(accessArgs(editor)), false);
    assert.equal(AuditLogs.access?.create?.(accessArgs(editor)), false);
    assert.equal(AuditLogs.access?.update?.(accessArgs(editor)), false);
    assert.equal(AuditLogs.access?.delete?.(accessArgs(editor)), false);
  });

  it("keeps API and Local API callers behind the same access functions", () => {
    const admin = { id: 1, role: "admin" as const };
    const editor = { id: 2, role: "editor" as const };

    assert.equal(Pages.access?.update, pagePublisherOrAdmin);
    assert.equal(Pages.access?.delete, pageHardDeleteAdminOnly);
    assert.equal(Users.access?.read, adminOnly);
    assert.equal(SiteSettings.access?.update, adminOnly);
    assert.equal(AuditLogs.access?.read, auditLogsAdminOnly);

    assert.equal(pagePublisherOrAdmin(accessArgs(editor)), true);
    assert.equal(Pages.access?.delete?.(accessArgs(admin)), true);
    assert.equal(pageLifecycleEditorOrAdmin(fieldArgs(admin)), true);
    assert.equal(pageLifecycleEditorOrAdmin(fieldArgs(editor)), true);
    assert.equal(auditLogsAdminOnly(accessArgs(admin)), true);
    assert.equal(auditLogsAdminOnly(accessArgs(editor)), false);
    assert.equal(AuditLogs.access?.create?.(accessArgs(admin)), false);
  });
});

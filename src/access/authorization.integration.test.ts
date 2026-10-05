import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { REST_DELETE, REST_POST } from "@payloadcms/next/routes";
import {
  buildConfig,
  getPayload,
  type CollectionConfig,
  type Payload,
} from "payload";

import type { User } from "../payload-types.ts";
import {
  canReadAuditLogs,
  denyAuditLogMutation,
} from "./policies/audit-logs.ts";
import {
  canCreateMedia,
  canDeleteMedia,
  canReadMedia,
  canUpdateMedia,
} from "./policies/media.ts";
import {
  canCreatePage,
  canDeletePage,
  canReadPages,
  canUpdatePage,
} from "./policies/pages.ts";
import {
  canCreateTheme,
  canDeleteTheme,
  canReadThemes,
  canUpdateTheme,
} from "./policies/themes.ts";
import {
  canAssignRole,
  canCreateUser,
  canDeleteUser,
  canReadUsers,
  canUpdateUser,
} from "./policies/users.ts";

const testCollections: CollectionConfig[] = [
  {
    slug: "authorization-auth",
    auth: true,
    fields: [
      {
        name: "role",
        type: "select",
        required: true,
        options: ["admin", "editor"],
      },
    ],
  },
  {
    slug: "authorization-pages",
    access: {
      create: canCreatePage,
      delete: canDeletePage,
      read: canReadPages,
      update: canUpdatePage,
    },
    fields: [{ name: "title", type: "text", required: true }],
    versions: { drafts: true },
  },
  {
    slug: "authorization-media",
    access: {
      create: canCreateMedia,
      delete: canDeleteMedia,
      read: canReadMedia,
      update: canUpdateMedia,
    },
    fields: [{ name: "name", type: "text", required: true }],
  },
  {
    slug: "authorization-users",
    access: {
      create: canCreateUser,
      delete: canDeleteUser,
      read: canReadUsers,
      update: canUpdateUser,
    },
    fields: [
      { name: "name", type: "text", required: true },
      {
        name: "role",
        type: "select",
        required: true,
        access: { create: canAssignRole, update: canAssignRole },
        options: ["admin", "editor"],
      },
    ],
  },
  {
    slug: "authorization-themes",
    access: {
      create: canCreateTheme,
      delete: canDeleteTheme,
      read: canReadThemes,
      update: canUpdateTheme,
    },
    fields: [{ name: "name", type: "text", required: true }],
  },
  {
    slug: "authorization-audit-logs",
    access: {
      create: denyAuditLogMutation,
      delete: denyAuditLogMutation,
      read: canReadAuditLogs,
      update: denyAuditLogMutation,
    },
    fields: [{ name: "event", type: "text", required: true }],
  },
];

const admin = {
  collection: "users",
  id: 1,
  role: "admin",
} as User;
const editor = {
  collection: "users",
  id: 2,
  role: "editor",
} as User;
const nullRole = {
  collection: "users",
  id: 3,
  role: null,
} as unknown as User;
const invalidRole = {
  collection: "users",
  id: 4,
  role: "viewer",
} as unknown as User;

type IntegrationPayload = {
  create: (options: Record<string, unknown>) => Promise<Record<string, unknown>>;
  delete: (options: Record<string, unknown>) => Promise<unknown>;
  find: (options: Record<string, unknown>) => Promise<{ totalDocs: number }>;
  login: (options: Record<string, unknown>) => Promise<{ token?: string | null }>;
  update: (options: Record<string, unknown>) => Promise<Record<string, unknown>>;
};

describe("Payload Local API authorization enforcement", () => {
  let api: IntegrationPayload;
  let editorToken: string;
  let payload: Payload;
  let restDelete: ReturnType<typeof REST_DELETE>;
  let restPost: ReturnType<typeof REST_POST>;

  before(async () => {
    const config = await buildConfig({
      collections: testCollections,
      db: sqliteAdapter({
        client: { url: "file::memory:" },
        push: true,
      }),
      secret: "authorization-integration-test-secret",
    });

    payload = await getPayload({ config });
    api = payload as unknown as IntegrationPayload;
    restDelete = REST_DELETE(config);
    restPost = REST_POST(config);

    await api.create({
      collection: "authorization-auth",
      data: {
        email: "editor@example.test",
        password: "editor-integration-password",
        role: "editor",
      },
      overrideAccess: true,
    });
    const login = await api.login({
      collection: "authorization-auth",
      data: {
        email: "editor@example.test",
        password: "editor-integration-password",
      },
    });

    assert.ok(login.token);
    editorToken = login.token;
  });

  after(async () => {
    await payload.destroy();
  });

  it("enforces Page create, update, publish and delete", async () => {
    await assert.rejects(() =>
      api.create({
        collection: "authorization-pages",
        data: { title: "Anonymous" },
        overrideAccess: false,
      }),
    );

    const editorPage = await api.create({
      collection: "authorization-pages",
      data: { title: "Editor draft" },
      draft: true,
      overrideAccess: false,
      user: editor,
    });
    const publishedPage = await api.update({
      collection: "authorization-pages",
      data: { _status: "published", title: "Editor published" },
      id: editorPage.id,
      overrideAccess: false,
      user: editor,
    });

    assert.equal(publishedPage._status, "published");
    await assert.rejects(() =>
      api.delete({
        collection: "authorization-pages",
        id: editorPage.id,
        overrideAccess: false,
        user: editor,
      }),
    );

    const adminPage = await api.create({
      collection: "authorization-pages",
      data: { title: "Admin page" },
      overrideAccess: false,
      user: admin,
    });
    await api.delete({
      collection: "authorization-pages",
      id: adminPage.id,
      overrideAccess: false,
      user: admin,
    });
  });

  it("enforces Media create, update and delete", async () => {
    const medium = await api.create({
      collection: "authorization-media",
      data: { name: "Editor media" },
      overrideAccess: false,
      user: editor,
    });
    await api.update({
      collection: "authorization-media",
      data: { name: "Updated media" },
      id: medium.id,
      overrideAccess: false,
      user: editor,
    });
    await assert.rejects(() =>
      api.delete({
        collection: "authorization-media",
        id: medium.id,
        overrideAccess: false,
        user: editor,
      }),
    );
    await api.delete({
      collection: "authorization-media",
      id: medium.id,
      overrideAccess: false,
      user: admin,
    });
  });

  it("restricts Users and role assignment to Admin", async () => {
    const managedUser = await api.create({
      collection: "authorization-users",
      data: { name: "Managed user", role: "editor" },
      overrideAccess: true,
    });
    await assert.rejects(() =>
      api.find({
        collection: "authorization-users",
        overrideAccess: false,
        user: editor,
      }),
    );
    const adminRead = await api.find({
      collection: "authorization-users",
      overrideAccess: false,
      user: admin,
    });

    assert.equal(adminRead.totalDocs, 1);
    await assert.rejects(() =>
      api.update({
        collection: "authorization-users",
        data: { role: "admin" },
        id: managedUser.id,
        overrideAccess: false,
        user: editor,
      }),
    );
    const promoted = await api.update({
      collection: "authorization-users",
      data: { role: "admin" },
      id: managedUser.id,
      overrideAccess: false,
      user: admin,
    });
    assert.equal(promoted.role, "admin");
  });

  it("restricts Themes and AuditLogs to Admin", async () => {
    await api.create({
      collection: "authorization-themes",
      data: { name: "Theme" },
      overrideAccess: true,
    });
    await api.create({
      collection: "authorization-audit-logs",
      data: { event: "created" },
      overrideAccess: true,
    });

    await assert.rejects(() =>
      api.find({
        collection: "authorization-themes",
        overrideAccess: false,
        user: editor,
      }),
    );
    const adminThemes = await api.find({
      collection: "authorization-themes",
      overrideAccess: false,
      user: admin,
    });
    await assert.rejects(() =>
      api.find({
        collection: "authorization-audit-logs",
        overrideAccess: false,
        user: editor,
      }),
    );
    const adminLogs = await api.find({
      collection: "authorization-audit-logs",
      overrideAccess: false,
      user: admin,
    });

    assert.equal(adminThemes.totalDocs, 1);
    assert.equal(adminLogs.totalDocs, 1);
  });

  it("fails closed for null and invalid roles", async () => {
    for (const user of [nullRole, invalidRole]) {
      await assert.rejects(() =>
        api.create({
          collection: "authorization-pages",
          data: { title: "Denied" },
          overrideAccess: false,
          user,
        }),
      );
    }
  });

  it("enforces the same policies through REST", async () => {
    const anonymousResponse = await restPost(
      new Request("http://localhost/api/authorization-pages", {
        body: JSON.stringify({ title: "Anonymous REST" }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }),
      { params: Promise.resolve({ slug: ["authorization-pages"] }) },
    );
    assert.equal(anonymousResponse.status, 403);

    const createResponse = await restPost(
      new Request("http://localhost/api/authorization-pages", {
        body: JSON.stringify({ title: "Editor REST" }),
        headers: {
          Authorization: `JWT ${editorToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      }),
      { params: Promise.resolve({ slug: ["authorization-pages"] }) },
    );
    assert.equal(createResponse.status, 201);
    const created = (await createResponse.json()) as { doc: { id: number | string } };

    const deleteResponse = await restDelete(
      new Request(
        `http://localhost/api/authorization-pages/${String(created.doc.id)}`,
        {
          headers: { Authorization: `JWT ${editorToken}` },
          method: "DELETE",
        },
      ),
      {
        params: Promise.resolve({
          slug: ["authorization-pages", String(created.doc.id)],
        }),
      },
    );
    assert.equal(deleteResponse.status, 403);
  });
});

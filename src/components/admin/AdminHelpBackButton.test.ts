import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveAdminBackHref } from "./AdminHelpBackButton";

describe("AdminHelpBackButton", () => {
  it("resolves collection and global destinations without reading browser globals", () => {
    assert.equal(resolveAdminBackHref("/admin/collections/pages/1"), "/admin/collections/pages");
    assert.equal(resolveAdminBackHref("/admin/globals/site-settings"), "/admin/globals/site-settings");
    assert.equal(resolveAdminBackHref("/admin/ajuda"), "/admin");
  });
});

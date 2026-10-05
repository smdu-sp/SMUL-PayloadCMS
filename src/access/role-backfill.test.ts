import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createRoleBackfillPlan } from "./role-backfill.ts";

describe("role backfill", () => {
  it("does nothing when every user already has a valid role", () => {
    assert.deepEqual(
      createRoleBackfillPlan(
        [
          { id: 1, role: "admin" },
          { id: 2, role: "editor" },
        ],
        undefined,
      ),
      [],
    );
  });

  it("requires explicit mappings for every invalid user", () => {
    const users = [
      { id: 1, email: "admin@example.test", role: null },
      { id: 2, login: "editor", role: "viewer" },
    ];
    const mapping = JSON.stringify({
      "email:admin@example.test": "admin",
      "login:editor": "editor",
    });

    assert.deepEqual(createRoleBackfillPlan(users, mapping), [
      { id: 1, role: "admin" },
      { id: 2, role: "editor" },
    ]);
  });

  it("rejects missing, invalid, conflicting and unused mappings", () => {
    const user = { id: 1, email: "user@example.test", role: null };

    assert.throws(() => createRoleBackfillPlan([user], undefined));
    assert.throws(() =>
      createRoleBackfillPlan([user], JSON.stringify({ "id:1": "viewer" })),
    );
    assert.throws(() =>
      createRoleBackfillPlan(
        [user],
        JSON.stringify({
          "id:1": "admin",
          "email:user@example.test": "editor",
        }),
      ),
    );
    assert.throws(() =>
      createRoleBackfillPlan(
        [user],
        JSON.stringify({ "id:1": "admin", "id:999": "editor" }),
      ),
    );
  });
});

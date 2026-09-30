import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { APIError, type Field } from "payload";

import { Themes, preventDeletingActiveTheme } from "./Themes.ts";

const fieldByName = (name: string): Field | undefined =>
  Themes.fields.find((field) => "name" in field && field.name === name);

describe("alternative themes collection", () => {
  it("stores a unique name and the shared controlled theme fields", () => {
    const name = fieldByName("name");

    assert.equal(Themes.slug, "themes");
    assert.equal(name?.type, "text");
    assert.equal("required" in (name ?? {}) ? name.required : false, true);
    assert.equal("unique" in (name ?? {}) ? name.unique : false, true);
    assert.deepEqual(
      Themes.fields
        .filter((field) => "name" in field)
        .map((field) => ("name" in field ? field.name : null)),
      ["name", "colors", "typography", "resetThemeColors"],
    );
  });

  it("blocks deletion while the theme is active", async () => {
    const req = {
      payload: {
        findGlobal: async () => ({ activeTheme: 7 }),
      },
    };

    await assert.rejects(
      preventDeletingActiveTheme({ id: 7, req } as unknown as Parameters<typeof preventDeletingActiveTheme>[0]),
      (error: unknown) => error instanceof APIError && error.status === 409,
    );
  });

  it("allows deletion after another theme is selected", async () => {
    const req = {
      payload: {
        findGlobal: async () => ({ activeTheme: { id: 8 } }),
      },
    };

    await assert.doesNotReject(() =>
      preventDeletingActiveTheme({ id: 7, req } as unknown as Parameters<typeof preventDeletingActiveTheme>[0]),
    );
  });
});

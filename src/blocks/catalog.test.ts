import assert from "node:assert/strict";
import { it } from "node:test";

import { Pages } from "../collections/Pages";
import { pageBlockSlugs } from "./catalog";

it("keeps the editorial block catalog aligned with Payload slugs and order", () => {
  const layout = Pages.fields.find(
    (field) => "name" in field && field.name === "layout",
  );

  assert.equal(layout?.type, "blocks");
  if (layout?.type !== "blocks") return;

  assert.deepEqual(layout.blocks.map((block) => block.slug), pageBlockSlugs);
});

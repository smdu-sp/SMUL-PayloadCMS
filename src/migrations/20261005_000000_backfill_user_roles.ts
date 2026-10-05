import type { MigrateUpArgs } from "@payloadcms/db-sqlite";

import {
  createRoleBackfillPlan,
  type BackfillUser,
} from "../access/role-backfill.ts";

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { docs } = await payload.find({
    collection: "users",
    depth: 0,
    overrideAccess: true,
    pagination: false,
    req,
  });
  const updates = createRoleBackfillPlan(
    docs as BackfillUser[],
    process.env.CMS_USER_ROLE_BACKFILL,
  );

  for (const update of updates) {
    await payload.update({
      collection: "users",
      data: { role: update.role },
      id: update.id,
      overrideAccess: true,
      req,
    });
  }
}

export async function down(): Promise<void> {
  throw new Error(
    "O backfill de roles nao possui rollback automatico. Restaure o backup revisado da base.",
  );
}

import * as migration_20261005_000000_backfill_user_roles from "./20261005_000000_backfill_user_roles";

export const migrations = [
  {
    name: "20261005_000000_backfill_user_roles",
    up: migration_20261005_000000_backfill_user_roles.up,
    down: migration_20261005_000000_backfill_user_roles.down,
  },
];

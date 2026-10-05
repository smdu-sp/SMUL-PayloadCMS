import type { Permission } from "./permissions.ts";
import { rolePermissions } from "./role-permissions.ts";
import { normalizeRole } from "./roles.ts";

type UserWithRole = {
  role?: unknown;
};

function roleFromUser(user: unknown): unknown {
  return user && typeof user === "object"
    ? (user as UserWithRole).role
    : undefined;
}

export function can(user: unknown, permission: Permission): boolean {
  const role = normalizeRole(roleFromUser(user));

  if (!role) {
    return false;
  }

  return (rolePermissions[role] as readonly Permission[]).includes(permission);
}

import { PERMISSIONS, type Permission } from "./permissions.ts";
import type { UserRole } from "./roles.ts";

export const rolePermissions = {
  admin: [...PERMISSIONS],
  editor: [
    "admin.access",
    "pages.read",
    "pages.create",
    "pages.update",
    "pages.publish",
    "pages.preview",
    "media.read",
    "media.create",
    "media.update",
    "header.read",
    "header.update",
    "footer.read",
    "footer.update",
  ],
} as const satisfies Record<UserRole, readonly Permission[]>;

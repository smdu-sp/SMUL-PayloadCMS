export const USER_ROLES = ["admin", "editor"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const roleOptions = [
  { label: "Administrador", value: "admin" },
  { label: "Editor", value: "editor" },
] as const satisfies ReadonlyArray<{ label: string; value: UserRole }>;

export function normalizeRole(role: unknown): UserRole | null {
  return typeof role === "string" && USER_ROLES.includes(role as UserRole)
    ? (role as UserRole)
    : null;
}

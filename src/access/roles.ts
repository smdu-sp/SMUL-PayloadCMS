import type { Access, FieldAccess } from "payload";

export const roleOptions = [
  { label: "Administrador", value: "admin" },
  { label: "Editor", value: "editor" },
] as const;

export type UserRole = (typeof roleOptions)[number]["value"];

type UserWithRole = {
  id?: number | string;
  role?: UserRole | null;
};

export const getUserRole = (user?: UserWithRole | null): UserRole | null =>
  user?.role === "admin" || user?.role === "editor" ? user.role : null;

export const isAdmin = (user?: UserWithRole | null): boolean => {
  if (!user) {
    return false;
  }

  const role = getUserRole(user);
  return role === "admin" || role === null;
};

export const isEditor = (user?: UserWithRole | null): boolean =>
  getUserRole(user) === "editor";

export const canEditContent = (user?: UserWithRole | null): boolean =>
  isAdmin(user) || isEditor(user);

export const canPublishPages = (user?: UserWithRole | null): boolean =>
  canEditContent(user);

export const canHardDeletePages = (user?: UserWithRole | null): boolean =>
  isAdmin(user);

export const canManagePageLifecycle = (user?: UserWithRole | null): boolean =>
  canEditContent(user);

export const canManageRestrictedSettings = (user?: UserWithRole | null): boolean =>
  isAdmin(user);

export const canManageUsers = (user?: UserWithRole | null): boolean =>
  isAdmin(user);

export const canUseImageEditingCanvas = (user?: UserWithRole | null): boolean =>
  isAdmin(user);

export const canReadAuditLogs = (user?: UserWithRole | null): boolean =>
  isAdmin(user);

const accessUser = (user: unknown): UserWithRole | null | undefined =>
  user as UserWithRole | null | undefined;

export const adminOnly: Access = ({ req }: Parameters<Access>[0]) =>
  isAdmin(accessUser(req.user));

export const imageEditingCanvasAdminOnly: Access = ({ req }: Parameters<Access>[0]) =>
  canUseImageEditingCanvas(accessUser(req.user));

export const denyAll: Access = () => false;

export const editorOrAdmin: Access = ({ req }: Parameters<Access>[0]) =>
  canEditContent(accessUser(req.user));

export const adminOrEditor = editorOrAdmin;

export const pagePublisherOrAdmin: Access = ({ req }: Parameters<Access>[0]) =>
  canPublishPages(accessUser(req.user));

export const pageHardDeleteAdminOnly: Access = ({ req }: Parameters<Access>[0]) =>
  canHardDeletePages(accessUser(req.user));

export const pageLifecycleEditorOrAdmin: FieldAccess = ({ req }: Parameters<FieldAccess>[0]) =>
  canManagePageLifecycle(accessUser(req.user));

export const auditLogsAdminOnly: Access = ({ req }: Parameters<Access>[0]) =>
  canReadAuditLogs(accessUser(req.user));

export const publishedOrLoggedIn: Access = ({ req }: Parameters<Access>[0]) => {
  if (canEditContent(accessUser(req.user))) {
    return true;
  }

  return {
    _status: {
      equals: "published",
    },
  };
};

export const adminFieldOnly: FieldAccess = ({ req }: Parameters<FieldAccess>[0]) =>
  isAdmin(accessUser(req.user));

import type { Access, FieldAccess } from "payload";

import { can } from "../can.ts";

export const canAccessAdmin = ({ req }: Parameters<Access>[0]): boolean =>
  can(req.user, "admin.access");

export const canReadUsers: Access = ({ req }) =>
  can(req.user, "users.read");
export const canCreateUser: Access = ({ req }) =>
  can(req.user, "users.create");
export const canUpdateUser: Access = ({ req }) =>
  can(req.user, "users.update");
export const canDeleteUser: Access = ({ req }) =>
  can(req.user, "users.delete");
export const canAssignRole: FieldAccess = ({ req }) =>
  can(req.user, "users.assignRole");

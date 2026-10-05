import type { Access } from "payload";

import { can } from "../can.ts";

export const canReadThemes: Access = ({ req }) =>
  req.user ? can(req.user, "themes.read") : true;
export const canCreateTheme: Access = ({ req }) =>
  can(req.user, "themes.create");
export const canUpdateTheme: Access = ({ req }) =>
  can(req.user, "themes.update");
export const canDeleteTheme: Access = ({ req }) =>
  can(req.user, "themes.delete");

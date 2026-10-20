import type { Access } from "payload";

import { can } from "../can.ts";

export const canReadMedia: Access = () => true;
export const canCreateMedia: Access = ({ req }) =>
  can(req.user, "media.create");
export const canUpdateMedia: Access = ({ req }) =>
  can(req.user, "media.update");
export const canDeleteMedia: Access = ({ req }) =>
  can(req.user, "media.delete");

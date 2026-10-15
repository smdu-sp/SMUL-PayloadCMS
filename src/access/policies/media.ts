import type { Access } from "payload";

import { can } from "../can.ts";

export const canReadMedia: Access = () => true;
export const canCreateMedia: Access = ({ req }) =>
  can(req.user, "media.create");
export const canUpdateMedia: Access = ({ req }) =>
  can(req.user, "media.update");
export const canDeleteMedia: Access = ({ req }) =>
  can(req.user, "media.delete");

export const canUseImageEditingCanvas = (user: unknown): boolean =>
  can(user, "media.editCanvas");

export const canEditMediaCanvas: Access = ({ req }) =>
  canUseImageEditingCanvas(req.user);

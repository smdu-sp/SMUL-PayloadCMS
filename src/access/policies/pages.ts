import type { Access, FieldAccess } from "payload";

import { can } from "../can.ts";

export const canReadPages: Access = ({ req }) => {
  if (can(req.user, "pages.read")) {
    return true;
  }

  return {
    _status: {
      equals: "published",
    },
  };
};

export const canCreatePage: Access = ({ req }) =>
  can(req.user, "pages.create");

export const canUpdatePage: Access = ({ req }) =>
  can(req.user, "pages.update");

export const canDeletePage: Access = ({ req }) =>
  can(req.user, "pages.delete");

export const canPublishPage: Access = ({ req }) =>
  can(req.user, "pages.publish");

export const canManagePageLifecycle: FieldAccess = ({ req }) =>
  can(req.user, "pages.update");

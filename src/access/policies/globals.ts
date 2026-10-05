import type { Access } from "payload";

import { can } from "../can.ts";

export const canReadHeader: Access = () => true;
export const canUpdateHeader: Access = ({ req }) =>
  can(req.user, "header.update");

export const canReadFooter: Access = () => true;
export const canUpdateFooter: Access = ({ req }) =>
  can(req.user, "footer.update");

export const canReadSiteSettings: Access = () => true;
export const canUpdateSiteSettings: Access = ({ req }) =>
  can(req.user, "siteSettings.update");

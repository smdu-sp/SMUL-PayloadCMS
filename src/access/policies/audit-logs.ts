import type { Access } from "payload";

import { can } from "../can.ts";

export const canReadAuditLogs: Access = ({ req }) =>
  can(req.user, "auditLogs.read");

export const denyAuditLogMutation: Access = () => false;

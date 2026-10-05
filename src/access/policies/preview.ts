import { can } from "../can.ts";

export function canPreviewContent(user: unknown): boolean {
  return can(user, "pages.preview");
}

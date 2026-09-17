import { getPayload } from "payload";

import config from "@payload-config";
import { resolveSemanticTheme, type GlobalSemanticTheme } from "./semantic-theme";

export type Theme = GlobalSemanticTheme;

export async function getTheme(): Promise<Theme> {
  const payload = await getPayload({ config });

  try {
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
    });
    return resolveSemanticTheme(settings.theme?.colors);
  } catch {
    return resolveSemanticTheme();
  }
}

import { getPayload } from "payload";

import config from "@payload-config";
import { resolveActiveThemeConfiguration } from "./resolve-active-theme";
import { resolveSemanticTheme, type GlobalSemanticTheme } from "./semantic-theme";

export type Theme = GlobalSemanticTheme;

export async function getTheme(): Promise<Theme> {
  const payload = await getPayload({ config });

  try {
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 1,
    });
    return resolveSemanticTheme(resolveActiveThemeConfiguration(settings).colors);
  } catch {
    return resolveSemanticTheme();
  }
}

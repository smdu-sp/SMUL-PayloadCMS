import { getPayload } from "payload";

import config from "@payload-config";
import type { Footer, Header } from "../../payload-types";

export type SiteShellData = {
  footer: Footer | null;
  header: Header | null;
};

export async function getSiteShell(): Promise<SiteShellData> {
  try {
    const payload = await getPayload({ config });
    const [header, footer] = await Promise.all([
      payload.findGlobal({ slug: "header", depth: 2 }).catch(() => null),
      payload.findGlobal({ slug: "footer", depth: 1 }).catch(() => null),
    ]);

    return { footer, header };
  } catch {
    return { footer: null, header: null };
  }
}

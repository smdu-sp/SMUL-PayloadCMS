import { revalidatePath } from "next/cache";
import type { GlobalAfterChangeHook } from "payload";

export function revalidateSiteShell(): void {
  try {
    revalidatePath("/", "layout");
  } catch {
    // Seeds and CLI scripts run outside the Next.js request/cache context.
  }
}

export const revalidateSiteShellGlobal: GlobalAfterChangeHook = () => {
  revalidateSiteShell();
};

import type { Page } from "../payload-types";
import { LivePreviewPage } from "./LivePreviewPage";
import { RenderBlocks } from "./RenderBlocks";

export function PageContent({ page, draft }: { page: Page; draft: boolean }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {draft ? (
        <LivePreviewPage initialData={page} />
      ) : (
        <RenderBlocks blocks={page.layout} />
      )}
    </main>
  );
}

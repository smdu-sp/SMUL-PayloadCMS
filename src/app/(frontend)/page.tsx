import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { RenderBlocks } from "../../components/RenderBlocks";
import { LivePreviewPage } from "../../components/admin/LivePreviewPage";
import { HOME_SLUG } from "../../domain/slug";
import {
  getPage,
  getSiteSettings,
  resolvePageMetadata,
} from "../../lib/payload/get-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled } = await draftMode();
  const page = await getPage(HOME_SLUG, { draft: isEnabled });

  if (!page) {
    return {};
  }

  const siteSettings = await getSiteSettings();

  return resolvePageMetadata(page, siteSettings, { draft: isEnabled });
}

export default async function Home() {
  const { isEnabled } = await draftMode();
  const page = await getPage(HOME_SLUG, { draft: isEnabled });

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {isEnabled ? (
        <LivePreviewPage initialData={page} />
      ) : (
        <RenderBlocks blocks={page.layout} />
      )}
    </main>
  );
}

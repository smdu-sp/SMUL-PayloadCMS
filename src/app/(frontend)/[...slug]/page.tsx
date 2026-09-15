import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { RenderBlocks } from "../../../components/RenderBlocks";
import { LivePreviewPage } from "../../../components/admin/LivePreviewPage";
import { HOME_SLUG, pathToPageSlug } from "../../../domain/slug";
import {
  getPage,
  getSiteSettings,
  resolvePageMetadata,
} from "../../../lib/payload/get-page";

export const dynamic = "force-dynamic";

type Args = {
  params: Promise<{
    slug: string[];
  }>;
};

async function getRoutePage({ params }: Args, draft: boolean) {
  const { slug } = await params;
  const pageSlug = pathToPageSlug(slug);

  if (pageSlug === HOME_SLUG) {
    return null;
  }

  return getPage(pageSlug, { draft });
}

export async function generateMetadata(args: Args): Promise<Metadata> {
  const { isEnabled } = await draftMode();
  const page = await getRoutePage(args, isEnabled);

  if (!page) {
    return {};
  }

  const siteSettings = await getSiteSettings();

  return resolvePageMetadata(page, siteSettings, { draft: isEnabled });
}

export default async function Page(args: Args) {
  const { isEnabled } = await draftMode();
  const page = await getRoutePage(args, isEnabled);

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

import { notFound } from "next/navigation";

import { PageContent } from "../../../components/PageContent";
import { HOME_SLUG, pathToPageSlug } from "../../../domain/slug";
import {
  getPageRouteMetadata,
  getPageRouteState,
} from "../../../lib/payload/page-route";

export const dynamic = "force-dynamic";

type Args = {
  params: Promise<{
    slug: string[];
  }>;
};

async function getRouteSlug({ params }: Args): Promise<string | null> {
  const { slug } = await params;
  const pageSlug = pathToPageSlug(slug);
  return pageSlug === HOME_SLUG ? null : pageSlug;
}

export async function generateMetadata(args: Args) {
  const slug = await getRouteSlug(args);
  return slug ? getPageRouteMetadata(slug) : {};
}

export default async function Page(args: Args) {
  const slug = await getRouteSlug(args);
  if (!slug) notFound();

  const { page, draft } = await getPageRouteState(slug);

  if (!page) {
    notFound();
  }

  return <PageContent page={page} draft={draft} />;
}

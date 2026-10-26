import { notFound } from "next/navigation";

import { PageContent } from "../../components/PageContent";
import { HOME_SLUG } from "../../domain/slug";
import {
  getPageRouteMetadata,
  getPageRouteState,
} from "../../lib/payload/page-route";

export const dynamic = "force-dynamic";

export const generateMetadata = () => getPageRouteMetadata(HOME_SLUG);

export default async function Home() {
  const { page, draft } = await getPageRouteState(HOME_SLUG);

  if (!page) {
    notFound();
  }

  return <PageContent page={page} draft={draft} />;
}

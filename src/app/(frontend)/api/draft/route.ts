import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

import config from "@payload-config";
import { canPreviewContent } from "../../../../access/policies/preview";
import { pageSlugToPath, pathToPageSlug } from "../../../../domain/slug";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const collection = url.searchParams.get("collection");
  const slug = url.searchParams.get("slug");
  const token = url.searchParams.get("token");

  if (collection !== "pages" || !slug || !token) {
    return new Response("Preview invalido.", { status: 400 });
  }

  const payload = await getPayload({ config });
  const auth = await payload.auth({
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });

  if (!auth.user) {
    return new Response("Preview nao autorizado.", { status: 401 });
  }

  if (!canPreviewContent(auth.user)) {
    return new Response("Preview proibido para este perfil.", { status: 403 });
  }

  const pageSlug = pathToPageSlug(slug);
  const page = await payload.find({
    collection: "pages",
    depth: 0,
    draft: true,
    limit: 1,
    overrideAccess: false,
    user: auth.user,
    where: {
      slug: {
        equals: pageSlug,
      },
    },
  });

  if (!page.docs[0]) {
    return new Response("Pagina nao encontrada.", { status: 404 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(pageSlugToPath(pageSlug));
}

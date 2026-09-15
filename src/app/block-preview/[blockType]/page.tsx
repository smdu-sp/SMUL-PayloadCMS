import { RenderBlocks } from "../../../components/RenderBlocks";
import { getPage } from "../../../lib/payload/get-page";
import type { Page } from "../../../payload-types"; // ajuste se o path for outro

export const dynamic = "force-dynamic";

type Args = {
  params: Promise<{
    blockType: string;
  }>;
};

type PageBlock = NonNullable<Page["layout"]>[number];

export default async function BlockPreviewPage({ params }: Args) {
  const { blockType } = await params;

  // Mesma fonte da página pública /seed
  const page = await getPage("seed", { draft: false });

  if (!page?.layout?.length) {
    return (
      <div className="p-6 font-sans text-sm text-gray-500">
        Página <strong>/seed</strong> não encontrada no Payload. Execute o
        script de seed.
      </div>
    );
  }

  const block = page.layout.find(
    (b: PageBlock) => b.blockType === blockType,
  );

  if (!block) {
    return (
      <div className="p-6 font-sans text-sm text-gray-500">
        Bloco <code>{blockType}</code> não encontrado no catálogo da página
        /seed.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      <RenderBlocks blocks={[block]} />
    </main>
  );
}
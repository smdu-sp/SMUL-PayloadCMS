import { readFile } from "node:fs/promises";
import { getPayload } from "payload";

import config from "../payload.config.ts";
import { seedShowcaseLayout } from "./seed-showcase.ts";

const payload = await getPayload({ config });

const demoImageAlt = "Imagem demonstrativa usada no catálogo de Blocks";
const existingDemoImage = await payload.find({
  collection: "media",
  depth: 0,
  limit: 1,
  where: {
    alt: {
      equals: demoImageAlt,
    },
  },
});

const demoImage = existingDemoImage.docs[0] ?? await payload.create({
  collection: "media",
  data: {
    alt: demoImageAlt,
    caption:
      "Imagem neutra criada pelo seed para demonstrar campos de mídia e ícones.",
    usage: "content",
  },
  file: {
    data: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      "base64",
    ),
    mimetype: "image/png",
    name: "seed-catalogo-blocks.png",
    size: 68,
  },
});

const bannerImageAlt = "Imagem demonstrativa usada no banner full-width";
const existingBannerImage = await payload.find({
  collection: "media",
  depth: 0,
  limit: 1,
  where: {
    alt: {
      equals: bannerImageAlt,
    },
  },
});

const bannerImageData = await readFile(new URL("../../media/300", import.meta.url));
const bannerImage = existingBannerImage.docs[0] ?? await payload.create({
  collection: "media",
  data: {
    alt: bannerImageAlt,
    caption:
      "Imagem criada pelo seed para demonstrar o banner full-width adaptado a proporcao da midia.",
    usage: "background",
  },
  file: {
    data: bannerImageData,
    mimetype: "image/jpeg",
    name: "seed-banner-full-width.jpg",
    size: bannerImageData.byteLength,
  },
});

const existingSeedPages = await payload.find({
  collection: "pages",
  depth: 0,
  draft: true,
  limit: 1,
  where: {
    slug: {
      equals: "seed",
    },
  },
});

const baseSeedPageData = {
  lifecycleStatus: "active" as const,
  title: "Seed — catálogo completo de Blocks",
  slug: "seed",
  seo: {
    metaTitle: "Seed — catálogo completo de Blocks",
    metaDescription:
      "Página demonstrativa com explicações sobre todos os Blocks disponíveis no catálogo editorial.",
    noFollow: true,
    noIndex: true,
  },
  _status: "published" as const,
};

const existingSeedPage = existingSeedPages.docs[0];
const seedPage = existingSeedPage
  ? await payload.update({
      collection: "pages",
      id: existingSeedPage.id,
      data: baseSeedPageData,
      draft: false,
    })
  : await payload.create({
      collection: "pages",
      data: baseSeedPageData,
      draft: false,
    });

await payload.update({
  collection: "pages",
  id: seedPage.id,
  data: {
    layout: seedShowcaseLayout(demoImage.id, seedPage.id, bannerImage.id),
  },
  draft: false,
});

await payload.destroy();

console.log("Seed concluído: a página /seed foi criada ou atualizada.");

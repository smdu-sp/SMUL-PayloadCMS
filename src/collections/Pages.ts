import type { CollectionConfig } from "payload";
import { ActionBannersBlock } from "../blocks/ActionBanners/config.ts";
import { AlertBoxBlock } from "../blocks/AlertBox/config.ts";
import { CardsBlock } from "../blocks/Cards/config.ts";
import { CTABlock } from "../blocks/CTA/config.ts";
import { FAQBlock } from "../blocks/FAQ/config.ts";
import { FullWidthImageBannerBlock } from "../blocks/FullWidthImageBanner/config.ts";
import { HeroBlock } from "../blocks/Hero/config.ts";
import { IconGridBlock } from "../blocks/IconGrid/config.ts";
import { ImageTextBlock } from "../blocks/ImageText/config.ts";
import { RichTextBlock } from "../blocks/RichText/config.ts";
import {
  editorOrAdmin,
  pageHardDeleteAdminOnly,
  pageLifecycleEditorOrAdmin,
  pagePublisherOrAdmin,
  publishedOrLoggedIn,
} from "../access/roles.ts";
import { normalizePageSlug, validatePageSlug } from "../domain/slug.ts";
import { createSeoFields } from "../fields/seo.ts";
import { createPageAuditLog } from "../lib/audit/page-audit.ts";
import {
  revalidateChangedPage,
  revalidateDeletedPage,
} from "../lib/payload/revalidate-page.ts";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const getPageLivePreviewUrl = (data: Record<string, unknown>): string | null => {
  if (typeof data.slug !== "string" || !data.slug.trim()) {
    return null;
  }

  const url = new URL("/api/live-preview", serverUrl);
  url.searchParams.set("slug", data.slug);
  return url.toString();
};

export const Pages: CollectionConfig = {
  slug: "pages",
  disableBulkDelete: true,
  disableBulkEdit: true,
  access: {
    create: editorOrAdmin,
    read: publishedOrLoggedIn,
    update: pagePublisherOrAdmin,
    delete: pageHardDeleteAdminOnly,
  },
  labels: {
    singular: "Página",
    plural: "Páginas",
  },
  admin: {
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    description:
      "Crie e organize paginas editoriais do portal. Use rascunho, preview e publicacao para controlar o ciclo editorial.",
    livePreview: {
      breakpoints: [
        { name: "mobile", label: "Celular", width: 390, height: 844 },
        { name: "tablet", label: "Tablet", width: 768, height: 1024 },
        { name: "desktop", label: "Desktop", width: 1440, height: 900 },
      ],
      url: ({ data }) => getPageLivePreviewUrl(data),
    },
    preview: (doc, { token }) => {
      if (!token || typeof doc.slug !== "string") {
        return null;
      }

      const params = new URLSearchParams({
        collection: "pages",
        slug: doc.slug,
        token,
      });

      return `${serverUrl}/api/draft?${params.toString()}`;
    },
    useAsTitle: "title",
  },
  hooks: {
    afterChange: [createPageAuditLog, revalidateChangedPage],
    afterDelete: [revalidateDeletedPage],
  },
  versions: {
    drafts: {
      autosave: false,
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Título",
      required: true,
      admin: {
        description:
          "Nome exibido no CMS e usado como referencia principal da pagina.",
      },
    },
    {
      name: "slug",
      type: "text",
      label: "Endereco da pagina",
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          'Use "home" para a pagina inicial. Para paginas internas, use letras minusculas, numeros e hifens. O valor "/" tambem vira "home".',
      },
      hooks: {
        beforeValidate: [({ value }) => normalizePageSlug(value)],
      },
      validate: validatePageSlug,
    },
    {
      name: "lifecycleStatus",
      type: "select",
      label: "Status do conteudo",
      required: true,
      defaultValue: "active",
      access: {
        create: pageLifecycleEditorOrAdmin,
        update: pageLifecycleEditorOrAdmin,
      },
      admin: {
        description:
          "Use Ativo para conteudo publicavel. Use Inativo para remover a pagina da navegacao e do acesso publico sem apagar historico.",
        position: "sidebar",
      },
      options: [
        { label: "Ativo", value: "active" },
        { label: "Inativo", value: "inactive" },
      ],
    },
    {
      name: "layout",
      type: "blocks",
      label: "Blocos de conteudo",
      blocks: [
        HeroBlock,
        RichTextBlock,
        ImageTextBlock,
        CardsBlock,
        CTABlock,
        IconGridBlock,
        FAQBlock,
        AlertBoxBlock,
        ActionBannersBlock,
        FullWidthImageBannerBlock,
      ],
      admin: {
        description:
          "Monte a pagina escolhendo blocos prontos, agrupados por Conteúdo, Mídia e Ações. As aparências usam opções controladas pelo Design System; nenhum bloco executa contador ou timer automático nesta fase.",
        initCollapsed: true,
      },
    },
    {
      name: "seo",
      type: "group",
      label: "SEO e compartilhamento",
      admin: {
        description:
          "Configure titulo, resumo, OpenGraph, robots e URL canonica para buscadores quando forem diferentes do conteudo principal.",
      },
      fields: createSeoFields({
        includeCanonical: true,
        includeRobots: true,
      }),
    },
  ],
};

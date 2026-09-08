import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ActionBannersBlock } from "./blocks/ActionBanners/config";
import { AlertBoxBlock } from "./blocks/AlertBox/config";
import { CardsBlock } from "./blocks/Cards/config";
import { CTABlock } from "./blocks/CTA/config";
import { FAQBlock } from "./blocks/FAQ/config";
import { FullWidthImageBannerBlock } from "./blocks/FullWidthImageBanner/config";
import { HeroBlock } from "./blocks/Hero/config";
import { IconGridBlock } from "./blocks/IconGrid/config";
import { ImageTextBlock } from "./blocks/ImageText/config";
import { RichTextBlock } from "./blocks/RichText/config";
import { AuditLogs } from "./collections/AuditLogs";
import { Media, mediaUsageOptions } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Users } from "./collections/Users";
import { Footer } from "./globals/Footer";
import { Header } from "./globals/Header";
import { SiteSettings } from "./globals/SiteSettings";
import type { Page } from "./payload-types";

type PageBlock = NonNullable<Page["layout"]>[number];

const richText = (text: string) => ({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text,
            type: "text",
            version: 1,
          },
        ],
        direction: null,
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: null,
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
});

const externalLink = (label: string) => ({
  label,
  newTab: true,
  type: "external" as const,
  url: "https://example.gov.br",
});

const scenarios: Record<string, PageBlock[]> = {
  home: [
    {
      blockType: "hero",
      description: "Abertura editorial sem regra de dominio.",
      id: "home-hero",
      title: "Pagina inicial",
      variant: "centered",
    },
    {
      blockType: "richText",
      content: richText("Introducao institucional."),
      id: "home-rich-text",
      variant: "default",
    },
    {
      blockType: "cards",
      id: "home-modalities",
      items: [{ description: "Modalidade editorial.", id: "home-card", title: "Modalidade" }],
      title: "Modalidades",
      variant: "modalities",
    },
    {
      banners: [
        {
          appearance: "brand",
          button: externalLink("Abrir servico"),
          id: "home-banner",
          title: "Servico oficial",
        },
      ],
      blockType: "actionBanners",
      id: "home-action-banners",
      variant: "grid",
    },
  ] as unknown as PageBlock[],
  benefits: [
    {
      blockType: "imageText",
      content: richText("Destaque de midia equivalente."),
      id: "benefits-media",
      image: 1,
      title: "Beneficios",
      variant: "image-left",
    },
    {
      blockType: "richText",
      content: richText("Contexto quando necessario."),
      id: "benefits-rich-text",
      variant: "narrow",
    },
    {
      blockType: "cards",
      id: "benefits-grid",
      items: [{ description: "Beneficio representado em card.", id: "benefit", title: "Beneficio" }],
      title: "Grade de beneficios",
      variant: "default",
    },
    {
      action: externalLink("Continuar"),
      blockType: "cta",
      id: "benefits-cta",
      title: "Proximo passo",
      variant: "compact",
    },
  ] as unknown as PageBlock[],
  faq: [
    {
      blockType: "richText",
      content: richText("Informacao introdutoria."),
      id: "faq-rich-text",
      variant: "default",
    },
    {
      blockType: "faqAccordion",
      id: "faq-list",
      items: [{ answer: richText("Resposta."), id: "faq-item", question: "Pergunta?" }],
      title: "Duvidas frequentes",
      variant: "default",
    },
    {
      blockType: "cards",
      id: "faq-info-cards",
      items: [{ description: "Passo editorial.", id: "step", title: "Passo" }],
      title: "Passos informativos",
      variant: "default",
    },
    {
      blockType: "alertBox",
      content: richText("Aviso importante."),
      id: "faq-alert",
      title: "Atencao",
      type: "info",
    },
  ] as unknown as PageBlock[],
  modality: [
    {
      blockType: "richText",
      content: richText("Descricao da modalidade sem classificacao automatica."),
      id: "modality-rich-text",
      variant: "narrow",
    },
    {
      blockType: "iconGrid",
      id: "modality-icon-grid",
      items: [{ description: "Documento ou etapa.", id: "modality-icon" }],
      title: "Resumo",
      variant: "compact",
    },
    {
      blockType: "imageText",
      content: richText("Orientacao complementar."),
      id: "modality-image-text",
      image: 1,
      title: "Como funciona",
      variant: "image-right",
    },
    {
      action: externalLink("Finalizar"),
      blockType: "cta",
      id: "modality-final-cta",
      title: "CTA final",
      variant: "brand",
    },
  ] as unknown as PageBlock[],
};

const registeredBlockSlugs = () => {
  const layout = Pages.fields.find(
    (field) => "name" in field && field.name === "layout",
  );

  assert.ok(layout && "blocks" in layout && Array.isArray(layout.blocks));
  return layout.blocks.map((block) => block.slug);
};

describe("SPEC-029 CMS foundation validation", () => {
  it("composes the four mapped page scenarios with approved blocks", () => {
    assert.deepEqual(
      Object.fromEntries(
        Object.entries(scenarios).map(([name, layout]) => [
          name,
          layout.map((block) => block.blockType),
        ]),
      ),
      {
        benefits: ["imageText", "richText", "cards", "cta"],
        faq: ["richText", "faqAccordion", "cards", "alertBox"],
        home: ["hero", "richText", "cards", "actionBanners"],
        modality: ["richText", "iconGrid", "imageText", "cta"],
      },
    );

    const slugs = registeredBlockSlugs();
    for (const layout of Object.values(scenarios)) {
      for (const block of layout) {
        assert.ok(slugs.includes(block.blockType), `${block.blockType} must be registered`);
      }
    }
  });

  it("keeps all approved blocks registered and editor-identifiable", () => {
    const configuredBlocks = [
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
    ];

    assert.deepEqual(registeredBlockSlugs(), configuredBlocks.map((block) => block.slug));

    for (const block of configuredBlocks) {
      assert.ok(block.labels?.singular, `${block.slug} needs an editorial label`);
      assert.ok(block.admin?.group, `${block.slug} needs an admin group`);
    }
  });

  it("keeps global Header and Footer content configurable", () => {
    const headerFieldNames = Header.fields.map((field) => "name" in field ? field.name : "");
    const footerFieldNames = Footer.fields.map((field) => "name" in field ? field.name : "");

    assert.deepEqual(headerFieldNames, ["logo", "navigation"]);
    assert.deepEqual(footerFieldNames, [
      "phone",
      "email",
      "address",
      "inPersonService",
      "socialLinks",
      "institutionalLinks",
    ]);
  });

  it("covers media roles needed by the mapped layouts", () => {
    const values = mediaUsageOptions.map((option) => option.value);

    assert.deepEqual(values, [
      "content",
      "background",
      "logo",
      "icon",
      "infographic",
      "document",
    ]);
    assert.equal(typeof Media.access?.read, "function");
  });

  it("keeps preview, live preview, publish, SEO, validation and permissions wired", () => {
    assert.ok(Pages.versions && typeof Pages.versions === "object" && Pages.versions.drafts);
    assert.equal(typeof Pages.admin?.preview, "function");
    assert.equal(typeof Pages.admin?.livePreview?.url, "function");
    assert.ok(Pages.fields.some((field) => "name" in field && field.name === "seo"));
    assert.ok(SiteSettings.fields.some((field) => "name" in field && field.name === "defaultSEO"));
    assert.equal(typeof Pages.access?.create, "function");
    assert.equal(typeof Users.access?.read, "function");
    assert.equal(typeof AuditLogs.access?.read, "function");
  });
});

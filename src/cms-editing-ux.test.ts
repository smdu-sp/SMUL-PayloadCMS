import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Field } from "payload";

import { CardsBlock } from "./blocks/Cards/config";
import { CTABlock } from "./blocks/CTA/config";
import { HeroBlock } from "./blocks/Hero/config";
import { ImageTextBlock } from "./blocks/ImageText/config";
import { RichTextBlock } from "./blocks/RichText/config";
import {
  adminHelpBlockGuides,
  adminHelpSections,
} from "./admin/help-content";
import { Pages } from "./collections/Pages";
import { Media } from "./collections/Media";
import { Users } from "./collections/Users";
import { createLinkFields } from "./fields/link";
import { createSeoFields } from "./fields/seo";
import { Footer } from "./globals/Footer";
import { Header } from "./globals/Header";
import { SiteSettings } from "./globals/SiteSettings";
import { createSocialLinkFields } from "./globals/shared/social-link";
import {
  adminHelpNavLink,
  adminHelpView,
  adminIconsNavLink,
  adminIconsView,
} from "./payload.config";

type FieldLike = Field & {
  admin?: {
    condition?: unknown;
    description?: string;
  };
  label?: string;
  name?: string;
};

const fieldByName = (fields: Field[], name: string): FieldLike => {
  const field = fields.find((candidate) => "name" in candidate && candidate.name === name);

  assert.ok(field, `Expected field ${name} to exist`);
  return field as FieldLike;
};

const adminDescription = (field: FieldLike): string | undefined =>
  typeof field.admin?.description === "string"
    ? field.admin.description
    : undefined;

describe("CMS editing UX", () => {
  it("exposes user documentation from the Admin", () => {
    assert.equal(
      adminHelpNavLink,
      "/components/admin/AdminHelpNavLink#AdminHelpNavLink",
    );
    assert.equal(adminHelpView.path, "/ajuda");
    assert.equal(
      adminHelpView.Component,
      "/components/admin/AdminHelpPage#AdminHelpPage",
    );
  });

  it("exposes standard icon system from the Admin navigation (SPEC-035)", () => {
    assert.equal(
      adminIconsNavLink,
      "/components/admin/AdminIconsNavLink#AdminIconsNavLink",
    );
    assert.equal(adminIconsView.path, "/icones");
    assert.equal(
      adminIconsView.Component,
      "/components/admin/AdminIconsPage#AdminIconsPage",
    );
  });

  it("covers the minimum Admin help topics for editors and admins", () => {
    const titles = adminHelpSections.map((section) => section.title);
    const body = adminHelpSections.flatMap((section) => section.body).join(" ");

    assert.deepEqual(titles, [
      "Primeiros passos",
      "Criando uma pagina",
      "Entendendo Blocks",
      "Adicionando imagens",
      "Links internos e externos",
      "Estilos disponiveis",
      "Draft, Preview, Publish e Unpublish",
      "Desativacao",
      "SEO",
      "Boas praticas",
    ]);
    assert.match(body, /Editor/);
    assert.match(body, /Admin/);
    assert.match(body, /rascunho/);
    assert.match(body, /Preview/);
    assert.match(body, /Publish/);
    assert.match(body, /Unpublish/);
  });

  it("documents every approved Page Block for Admin users", () => {
    assert.deepEqual(
      adminHelpBlockGuides.map((block) => block.name),
      [
        "Destaque principal",
        "Texto editorial",
        "Midia e texto / imagem de destaque",
        "Cards e grades de beneficios",
        "Chamada para acao",
        "Grade de icones e informacoes",
        "Perguntas frequentes",
        "Caixa de aviso",
        "Faixas de acao",
      ],
    );

    for (const block of adminHelpBlockGuides) {
      assert.ok(block.fields.length > 0);
      assert.ok(block.purpose);
      assert.ok(block.useWhen);
      assert.ok(block.avoidWhen);
    }
  });

  it("keeps Pages easy to identify and preview", () => {
    assert.equal(Pages.disableBulkDelete, true);
    assert.equal(Pages.disableBulkEdit, true);
    assert.equal(Pages.admin?.useAsTitle, "title");
    assert.deepEqual(Pages.admin?.defaultColumns, ["title", "slug", "_status", "updatedAt"]);

    const previewUrl = Pages.admin?.preview?.(
      { slug: "entenda-a-lei" },
      { token: "preview-token" } as Parameters<NonNullable<typeof Pages.admin.preview>>[1],
    );

    assert.equal(
      previewUrl,
      "http://localhost:3000/api/draft?collection=pages&slug=entenda-a-lei&token=preview-token",
    );
  });

  it("wires CMS access control to roles", () => {
    const role = fieldByName(Users.fields, "role");

    assert.equal(Users.access?.create, Users.access?.update);
    assert.equal(typeof Users.access?.read, "function");
    assert.equal(typeof Pages.access?.create, "function");
    assert.equal(typeof Pages.access?.read, "function");
    assert.equal(typeof Media.access?.create, "function");
    assert.equal(Header.access?.read?.({ req: {} } as Parameters<NonNullable<typeof Header.access.read>>[0]), true);
    assert.equal(Footer.access?.read?.({ req: {} } as Parameters<NonNullable<typeof Footer.access.read>>[0]), true);
    assert.equal(SiteSettings.access?.read?.({ req: {} } as Parameters<NonNullable<typeof SiteSettings.access.read>>[0]), true);
    assert.equal(role.label, "Perfil de acesso");
    assert.equal("defaultValue" in role ? role.defaultValue : undefined, "admin");
  });

  it("adds editor-facing descriptions to page structure fields", () => {
    const slug = fieldByName(Pages.fields, "slug");
    const lifecycleStatus = fieldByName(Pages.fields, "lifecycleStatus");
    const layout = fieldByName(Pages.fields, "layout");
    const seo = fieldByName(Pages.fields, "seo");

    assert.equal(slug.label, "Endereco da pagina");
    assert.equal(lifecycleStatus.label, "Status do conteudo");
    assert.equal("defaultValue" in lifecycleStatus ? lifecycleStatus.defaultValue : undefined, "active");
    assert.match(adminDescription(slug) ?? "", /home/);
    assert.match(adminDescription(lifecycleStatus) ?? "", /Inativo/);
    assert.match(adminDescription(layout) ?? "", /blocos prontos/i);
    assert.match(adminDescription(seo) ?? "", /buscadores/i);
  });

  it("uses reusable SEO fields with robots controls on Pages", () => {
    const seo = fieldByName(Pages.fields, "seo");
    const names =
      "fields" in seo && Array.isArray(seo.fields)
        ? seo.fields.map((field) => "name" in field ? String(field.name) : "")
        : [];

    assert.deepEqual(names.slice(0, 6), [
      "metaTitle",
      "metaDescription",
      "socialImage",
      "canonical",
      "noIndex",
      "noFollow",
    ]);
  });

  it("describes block variants without exposing implementation vocabulary", () => {
    const variants = [
      fieldByName(HeroBlock.fields, "variant"),
      fieldByName(RichTextBlock.fields, "variant"),
      fieldByName(ImageTextBlock.fields, "variant"),
      fieldByName(CTABlock.fields, "variant"),
    ];

    for (const variant of variants) {
      assert.notEqual(variant.label, "Variacao");
      assert.ok(adminDescription(variant));
    }
  });

  it("keeps irrelevant link fields conditional and documented", () => {
    const fields = createLinkFields(true);
    const page = fieldByName(fields, "page");
    const url = fieldByName(fields, "url");

    assert.equal(page.label, "Pagina interna");
    assert.equal(url.label, "URL externa");
    assert.ok("admin" in page && page.admin?.condition);
    assert.ok("admin" in url && url.admin?.condition);
    assert.ok(adminDescription(page));
    assert.ok(adminDescription(url));
  });

  it("keeps SEO fields reusable and explicit", () => {
    const fields = createSeoFields({
      includeCanonical: true,
      includeRobots: true,
    });
    const canonical = fieldByName(fields, "canonical");
    const noIndex = fieldByName(fields, "noIndex");
    const noFollow = fieldByName(fields, "noFollow");

    assert.equal(canonical.label, "URL canonica");
    assert.equal(noIndex.label, "Nao indexar");
    assert.equal(noFollow.label, "Nao seguir links");
    assert.ok("validate" in canonical);
  });

  it("documents global settings and media fields for non-technical editors", () => {
    assert.ok(Media.admin?.description);
    assert.ok(Header.admin?.description);
    assert.ok(Footer.admin?.description);
    assert.ok(SiteSettings.admin?.description);

    const branding = fieldByName(SiteSettings.fields, "branding");
    const alt = fieldByName(Media.fields, "alt");
    const usage = fieldByName(Media.fields, "usage");

    assert.equal(branding.label, "Cores institucionais");
    assert.equal(usage.label, "Uso principal");
    assert.match(adminDescription(branding) ?? "", /CSS livre/);
    assert.match(adminDescription(alt) ?? "", /leitores de tela/);
    assert.match(adminDescription(usage) ?? "", /SVG/);
  });

  it("keeps Media upload policy centralized", () => {
    const upload = typeof Media.upload === "object" ? Media.upload : {};

    assert.deepEqual("mimeTypes" in upload ? upload.mimeTypes : [], [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ]);
    assert.equal("displayPreview" in upload ? upload.displayPreview : false, true);
    assert.equal("focalPoint" in upload ? upload.focalPoint : false, true);
    assert.equal("imageSizes" in upload, false);
  });

  it("keeps reusable Footer content configurable in Globals", () => {
    const phone = fieldByName(Footer.fields, "phone");
    const email = fieldByName(Footer.fields, "email");
    const address = fieldByName(Footer.fields, "address");
    const socialLinks = fieldByName(Footer.fields, "socialLinks");
    const institutionalLinks = fieldByName(Footer.fields, "institutionalLinks");

    assert.equal(phone.label, "Telefone");
    assert.equal(email.label, "E-mail");
    assert.equal(address.label, "Endereco fisico");
    assert.equal(socialLinks.label, "Redes sociais");
    assert.equal(institutionalLinks.label, "Links institucionais");
    assert.match(adminDescription(address) ?? "", /canais oficiais/);
    assert.match(adminDescription(socialLinks) ?? "", /institucionais ativos/);
  });

  it("keeps Global links compatible with existing Payload tables", () => {
    const navigation = fieldByName(Header.fields, "navigation");
    const institutionalLinks = fieldByName(Footer.fields, "institutionalLinks");
    const officialLinks = fieldByName(SiteSettings.fields, "officialLinks");
    const getNestedNames = (field: FieldLike): string[] =>
      "fields" in field && Array.isArray(field.fields)
        ? field.fields.map((nested) => "name" in nested ? String(nested.name) : "")
        : [];

    assert.deepEqual(getNestedNames(navigation), ["label", "page"]);
    assert.deepEqual(getNestedNames(institutionalLinks), ["label", "url"]);
    assert.deepEqual(getNestedNames(officialLinks), ["label", "url"]);
  });

  it("validates reusable social links without creating generic key value content", () => {
    const fields = createSocialLinkFields();
    const label = fieldByName(fields, "label");
    const url = fieldByName(fields, "url");
    const validate = "validate" in url ? url.validate : undefined;

    assert.equal(label.label, "Nome da rede");
    assert.equal(url.label, "URL oficial");
    assert.equal(typeof validate, "function");
  });

  it("keeps Cards variants closed and editor-facing", () => {
    const items = fieldByName(CardsBlock.fields, "items");
    const variant = fieldByName(CardsBlock.fields, "variant");
    const options = "options" in variant ? variant.options : [];
    const values = Array.isArray(options)
      ? options.map((option) => typeof option === "object" && "value" in option ? option.value : option)
      : [];

    assert.equal(CardsBlock.labels?.singular, "Cards e grades de benefícios");
    assert.deepEqual(values, ["default", "modalities"]);
    assert.match(adminDescription(variant) ?? "", /modalidades/);
    assert.match(adminDescription(items) ?? "", /1 a 12 cards/);
  });

  it("keeps Cards free of arbitrary layout variants", () => {
    const variant = fieldByName(CardsBlock.fields, "variant");
    const options = "options" in variant ? variant.options : [];
    const values = Array.isArray(options)
      ? options.map((option) => typeof option === "object" && "value" in option ? option.value : option)
      : [];

    assert.equal(
      CardsBlock.fields.find(
      (field) => "name" in field && field.name === "variant",
      ),
      variant,
    );
    assert.equal(values.includes("custom"), false);
    assert.equal(values.includes("layout"), false);
  });
});

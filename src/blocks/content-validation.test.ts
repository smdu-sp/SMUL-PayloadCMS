import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Field } from "payload";

import { createLinkFields } from "../fields/link";
import {
  closedSelect,
  requiredRichText,
  requiredText,
  requiredTextarea,
} from "../fields/editorial-validation";
import { ActionBannersBlock } from "./ActionBanners/config";
import { AlertBoxBlock } from "./AlertBox/config";
import { CardsBlock } from "./Cards/config";
import { CarouselBlock } from "./Carousel/config";
import { CTABlock } from "./CTA/config";
import { FAQBlock } from "./FAQ/config";
import { FullWidthImageBannerBlock } from "./FullWidthImageBanner/config";
import { GalleryBlock } from "./Gallery/config";
import { HeroBlock } from "./Hero/config";
import { IconGridBlock } from "./IconGrid/config";
import { ImageBlock } from "./ImageBlock/config";
import { ImageTextBlock } from "./ImageText/config";
import { RichTextBlock } from "./RichText/config";

const blocks = [
  HeroBlock,
  RichTextBlock,
  ImageBlock,
  GalleryBlock,
  CarouselBlock,
  ImageTextBlock,
  CardsBlock,
  CTABlock,
  IconGridBlock,
  FAQBlock,
  AlertBoxBlock,
  ActionBannersBlock,
  FullWidthImageBannerBlock,
];

function fieldByName(fields: Field[], name: string): Field {
  const field = fields.find((candidate) => "name" in candidate && candidate.name === name);
  assert.ok(field, `Expected field ${name}`);
  return field;
}

const validationArgs = (siblingData: Record<string, unknown> = {}) =>
  ({ siblingData }) as never;

describe("SPEC-026 content validation", () => {
  it("rejects blank editorial text and structurally empty rich text", async () => {
    assert.equal(await requiredText("Informe o titulo.")("   ", validationArgs()), "Informe o titulo.");
    assert.equal(await requiredTextarea("Informe a descricao.")("", validationArgs()), "Informe a descricao.");

    const emptyLexical = {
      root: {
        children: [{ children: [], type: "paragraph", version: 1 }],
        type: "root",
        version: 1,
      },
    };
    assert.equal(
      await requiredRichText("Informe o conteudo.")(emptyLexical, validationArgs()),
      "Informe o conteudo.",
    );
  });

  it("rejects arbitrary values outside approved appearance enums", async () => {
    const validate = closedSelect(["info", "warning"], "Escolha um tipo aprovado.");
    assert.equal(await validate("custom", validationArgs()), "Escolha um tipo aprovado.");
    assert.equal(await validate("warning", validationArgs()), true);
  });

  it("validates custom overrides against the actual configured theme", async () => {
    const appearance = fieldByName(CTABlock.fields, "appearance");
    assert.ok("validate" in appearance && appearance.validate);
    let reads = 0;
    const req = { payload: { findGlobal: async () => {
      reads++;
      return { theme: { colors: { background: "#111111", foreground: "#ffffff" } } };
    } } };
    const args = { req } as never;
    assert.equal(await appearance.validate({ scheme: "default", colors: { foreground: "#111111" } }, args), true);
    assert.equal(reads, 0);
    assert.equal(await appearance.validate({ scheme: "custom", colors: { brand: "#003399", action: "#0055aa" } }, args), true);
    assert.equal(reads, 1);
    assert.notEqual(await appearance.validate({ scheme: "custom", colors: { brand: "blue" } }, args), true);

    assert.ok("fields" in appearance);
    const scheme = fieldByName(appearance.fields, "scheme");
    assert.ok("options" in scheme && Array.isArray(scheme.options));
    assert.ok(scheme.options.some((option) => typeof option === "object" && "value" in option && option.value === "custom"));

    const colors = fieldByName(appearance.fields, "colors");
    assert.ok("fields" in colors);
    assert.deepEqual(
      colors.fields.map((field) => "name" in field ? field.name : null),
      ["background", "foreground", "brand", "action", "accent"],
    );
    const visibleCTAColorFields = colors.fields.flatMap((field) =>
      field.type === "text" && !field.admin?.hidden ? [field.name] : [],
    );
    assert.deepEqual(visibleCTAColorFields, ["background", "foreground", "action"]);
    for (const field of colors.fields) {
      if (field.type !== "text") assert.fail("Expected a text color field");
      assert.ok(field.admin?.components);
      assert.deepEqual(
        field.admin.components.beforeInput,
        ["/components/admin/HexColorPicker#HexColorPicker"],
      );
    }
    assert.equal(colors.admin?.condition?.({}, { scheme: "custom" }, { user: null } as never), true);
    assert.equal(colors.admin?.condition?.({}, { scheme: "default", colors: { background: "#000000" } }, { user: null } as never), false);

    const contrastStatus = fieldByName(appearance.fields, "contrastStatus");
    assert.equal(contrastStatus.type, "ui");
    assert.deepEqual(
      typeof contrastStatus.admin?.components?.Field === "object"
        ? contrastStatus.admin.components.Field.clientProps
        : null,
      { visibleTokens: ["background", "foreground", "action"] },
    );
    assert.equal(contrastStatus.admin?.condition?.({}, { scheme: "custom" }, { user: null } as never), true);
    assert.equal(contrastStatus.admin?.condition?.({}, { scheme: "default" }, { user: null } as never), false);

    const richTextAppearance = fieldByName(RichTextBlock.fields, "appearance");
    assert.ok("fields" in richTextAppearance);
    const richTextScheme = fieldByName(richTextAppearance.fields, "scheme");
    assert.ok("options" in richTextScheme && Array.isArray(richTextScheme.options));
    assert.deepEqual(
      richTextScheme.options.map((option) => typeof option === "object" ? option.value : option),
      ["default", "surface", "muted", "custom"],
    );
    const richTextColors = fieldByName(richTextAppearance.fields, "colors");
    assert.ok("fields" in richTextColors);
    assert.deepEqual(
      richTextColors.fields.flatMap((field) =>
        field.type === "text" && !field.admin?.hidden ? [field.name] : [],
      ),
      ["background", "foreground"],
    );
    const richTextContrastStatus = fieldByName(richTextAppearance.fields, "contrastStatus");
    assert.equal(richTextContrastStatus.type, "ui");
    assert.deepEqual(
      typeof richTextContrastStatus.admin?.components?.Field === "object"
        ? richTextContrastStatus.admin.components.Field.clientProps
        : null,
      { visibleTokens: ["background", "foreground"] },
    );

    const imageTextAppearance = fieldByName(ImageTextBlock.fields, "appearance");
    assert.ok("fields" in imageTextAppearance);
    const imageTextScheme = fieldByName(imageTextAppearance.fields, "scheme");
    assert.ok("options" in imageTextScheme && Array.isArray(imageTextScheme.options));
    assert.deepEqual(
      imageTextScheme.options.map((option) => typeof option === "object" ? option.value : option),
      ["default", "surface", "muted", "custom"],
    );
    const imageTextColors = fieldByName(imageTextAppearance.fields, "colors");
    assert.ok("fields" in imageTextColors);
    assert.deepEqual(
      imageTextColors.fields.flatMap((field) =>
        field.type === "text" && !field.admin?.hidden ? [field.name] : [],
      ),
      ["background", "foreground"],
    );
    const imageTextContrastStatus = fieldByName(imageTextAppearance.fields, "contrastStatus");
    assert.equal(imageTextContrastStatus.type, "ui");
    assert.deepEqual(
      typeof imageTextContrastStatus.admin?.components?.Field === "object"
        ? imageTextContrastStatus.admin.components.Field.clientProps
        : null,
      { visibleTokens: ["background", "foreground"] },
    );
  });

  it("rejects partially completed optional and required links", async () => {
    const optional = createLinkFields();
    const optionalLabel = fieldByName(optional, "label");
    const optionalPage = fieldByName(optional, "page");
    assert.ok("validate" in optionalLabel && optionalLabel.validate);
    assert.ok("validate" in optionalPage && optionalPage.validate);

    assert.equal(
      await optionalLabel.validate("", validationArgs({ type: "external", url: "https://example.gov" })),
      "Informe o texto visivel do link.",
    );
    assert.equal(
      await optionalPage.validate(null, validationArgs({ type: "internal", label: "Saiba mais" })),
      "Informe o destino interno deste link.",
    );

    const required = createLinkFields(true);
    const requiredLabel = fieldByName(required, "label");
    assert.ok("validate" in requiredLabel && requiredLabel.validate);
    assert.equal(
      await requiredLabel.validate(" ", validationArgs({ type: "internal" })),
      "Informe o texto visivel do link.",
    );
  });

  it("keeps every approved block minimally constrained", () => {
    for (const block of blocks) {
      const validatedFields = block.fields.filter(
        (field) => "validate" in field && typeof field.validate === "function",
      );
      assert.ok(validatedFields.length > 0, `${block.slug} must expose editorial validation`);
    }

    for (const block of [CardsBlock, CarouselBlock, IconGridBlock, FAQBlock, ActionBannersBlock]) {
      const repeatedField = block.fields.find(
        (field) => field.type === "array",
      );
      assert.ok(repeatedField && repeatedField.required && repeatedField.minRows === 1);
    }
  });

  it("validates SPEC-033, SPEC-042, SPEC-043 and SPEC-044 media rules for image blocks, gallery, carousel, cards and banners", async () => {
    const imageBlockMedia = fieldByName(ImageBlock.fields, "media");
    assert.ok("validate" in imageBlockMedia && imageBlockMedia.validate);
    assert.equal(
      await imageBlockMedia.validate(null, validationArgs()),
      "Selecione uma imagem da biblioteca de midia.",
    );

    const galleryImages = fieldByName(GalleryBlock.fields, "images");
    assert.ok("fields" in galleryImages);
    const galleryMedia = fieldByName(galleryImages.fields, "media");
    const galleryBulkImages = fieldByName(GalleryBlock.fields, "bulkImages");
    assert.ok("validate" in galleryMedia && galleryMedia.validate);
    assert.ok("validate" in galleryBulkImages && galleryBulkImages.validate);
    assert.ok("hasMany" in galleryBulkImages && galleryBulkImages.hasMany);
    assert.equal(
      await galleryMedia.validate(null, validationArgs()),
      "Selecione uma imagem para a galeria.",
    );
    assert.equal(
      await galleryBulkImages.validate({ id: 1 } as never, validationArgs()),
      "Selecione uma ou mais imagens da biblioteca.",
    );

    const carouselItems = fieldByName(CarouselBlock.fields, "items");
    assert.ok("fields" in carouselItems);
    const carouselImage = fieldByName(carouselItems.fields, "image");
    assert.ok("validate" in carouselImage && carouselImage.validate);
    assert.equal(
      await carouselImage.validate(null, validationArgs()),
      "Selecione uma imagem para este slide.",
    );

    const bannerImage = fieldByName(FullWidthImageBannerBlock.fields, "desktopImage");
    assert.ok("validate" in bannerImage && bannerImage.validate);
    assert.equal(
      await bannerImage.validate(null, validationArgs()),
      "Selecione uma imagem para o banner desktop.",
    );

    const items = fieldByName(CardsBlock.fields, "items");
    assert.ok("fields" in items);
    const icon = fieldByName(items.fields, "icon");
    const image = fieldByName(items.fields, "image");
    assert.ok("validate" in icon && icon.validate);
    assert.ok("validate" in image && image.validate);

    assert.equal(
      await icon.validate(null, validationArgs({ mediaSource: "icon" })),
      "Selecione um icone para este card.",
    );
    assert.equal(
      await image.validate(null, validationArgs({ mediaSource: "image" })),
      "Selecione uma imagem para este card.",
    );
    assert.equal(
      await image.validate(1, validationArgs({ icon: 2, mediaSource: "icon" })),
      "Use icone ou imagem, nao ambos no mesmo card.",
    );
  });

  it("validates SPEC-035 standard icon system rules for blocks", async () => {
    // 1. Rejects arbitrary values in standardIcon
    const cardsItems = fieldByName(CardsBlock.fields, "items");
    assert.ok("fields" in cardsItems);
    const cardStandardIcon = fieldByName(cardsItems.fields, "standardIcon");
    assert.ok("validate" in cardStandardIcon && cardStandardIcon.validate);

    assert.equal(
      await cardStandardIcon.validate("location", validationArgs()),
      true,
    );
    assert.equal(
      await cardStandardIcon.validate("<svg><path/></svg>", validationArgs()),
      "Escolha um icone padrao aprovado.",
    );
    assert.equal(
      await cardStandardIcon.validate("custom-unapproved", validationArgs()),
      "Escolha um icone padrao aprovado.",
    );

    // 2. IconGridBlock supports standard icons and controlled source
    const gridItems = fieldByName(IconGridBlock.fields, "items");
    assert.ok("fields" in gridItems);
    const gridIconSource = fieldByName(gridItems.fields, "iconSource");
    const gridStandardIcon = fieldByName(gridItems.fields, "standardIcon");
    const gridCustomIcon = fieldByName(gridItems.fields, "icon");

    assert.ok("validate" in gridIconSource && gridIconSource.validate);
    assert.ok("validate" in gridStandardIcon && gridStandardIcon.validate);
    assert.ok("validate" in gridCustomIcon);

    assert.equal(await gridIconSource.validate("standard", validationArgs()), true);
    assert.equal(await gridIconSource.validate("custom", validationArgs()), true);
    assert.equal(await gridIconSource.validate("none", validationArgs()), true);
    assert.equal(
      await gridIconSource.validate("arbitrary", validationArgs()),
      "Escolha uma origem de ícone aprovada.",
    );

    assert.equal(
      await gridStandardIcon.validate("building", validationArgs({ iconSource: "standard" })),
      true,
    );
    assert.equal(
      await gridStandardIcon.validate("<svg>", validationArgs({ iconSource: "standard" })),
      "Escolha um ícone padrão aprovado.",
    );

    // 3. Ensure no block exposes arbitrary text/textarea for raw SVG
    for (const block of blocks) {
      for (const field of block.fields) {
        if ("name" in field) {
          assert.notEqual(field.name, "svg");
        }
      }
    }
  });
});

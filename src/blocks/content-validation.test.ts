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
import { CTABlock } from "./CTA/config";
import { FAQBlock } from "./FAQ/config";
import { FullWidthImageBannerBlock } from "./FullWidthImageBanner/config";
import { HeroBlock } from "./Hero/config";
import { IconGridBlock } from "./IconGrid/config";
import { ImageTextBlock } from "./ImageText/config";
import { RichTextBlock } from "./RichText/config";

const blocks = [
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

    for (const block of [CardsBlock, IconGridBlock, FAQBlock, ActionBannersBlock]) {
      const repeatedField = block.fields.find(
        (field) => field.type === "array",
      );
      assert.ok(repeatedField && repeatedField.required && repeatedField.minRows === 1);
    }
  });

  it("validates SPEC-033 media rules for cards and full-width banners", async () => {
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
});

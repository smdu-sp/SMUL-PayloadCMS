import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Block, Field } from "payload";

import { Pages } from "../collections/Pages";
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
import { blockSummaryLabel } from "./shared/admin";
import { getBlockSummary } from "./shared/get-block-summary";

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

function fieldByName(block: Block, name: string): Field {
  const field = block.fields.find((candidate) => "name" in candidate && candidate.name === name);
  assert.ok(field, `Expected ${block.slug}.${name}`);
  return field;
}

function descriptionOf(field: Field): string {
  const admin = field.admin as { description?: unknown } | undefined;
  return admin && "description" in admin
    ? String(admin.description ?? "")
    : "";
}

describe("SPEC-024 admin UX and block visualization", () => {
  it("gives every registered block an editorial label, group and collapsed summary", () => {
    assert.deepEqual(
      blocks.map((block) => block.admin?.group),
      [
        HeroBlock.admin?.group,
        RichTextBlock.admin?.group,
        ImageTextBlock.admin?.group,
        CardsBlock.admin?.group,
        CTABlock.admin?.group,
        IconGridBlock.admin?.group,
        FAQBlock.admin?.group,
        AlertBoxBlock.admin?.group,
        ActionBannersBlock.admin?.group,
        FullWidthImageBannerBlock.admin?.group,
      ],
    );

    for (const block of blocks) {
      assert.ok(block.labels?.singular);
      assert.equal(block.admin?.components?.Label, blockSummaryLabel);
    }
  });

  it("builds useful summaries for long pages", () => {
    assert.equal(
      getBlockSummary({ blockType: "faqAccordion", title: "Dúvidas", items: [{}, {}] }),
      "Perguntas frequentes — Dúvidas — 2 perguntas",
    );
    assert.equal(
      getBlockSummary({ blockType: "iconGrid", title: "Impedimentos", items: [{}, {}, {}] }),
      "Grade de ícones e informações — Impedimentos — 3 itens",
    );
    assert.equal(
      getBlockSummary({ blockType: "actionBanners", banners: [{}, {}, {}] }),
      "Faixas de ação — 3 chamadas",
    );
  });

  it("uses human appearance labels while preserving design-token values", () => {
    const banners = fieldByName(ActionBannersBlock, "banners");
    assert.ok("fields" in banners);
    const appearance = banners.fields.find(
      (field) => "name" in field && field.name === "appearance",
    );
    assert.ok(appearance && "options" in appearance && Array.isArray(appearance.options));
    assert.deepEqual(
      appearance.options.map((option) => typeof option === "object" ? [option.label, option.value] : option),
      [
        ["Verde — principal", "primary"],
        ["Azul — institucional", "brand"],
        ["Amarelo — apoio", "accent"],
      ],
    );
  });

  it("states that the current hero and page builder do not provide an automatic timer", () => {
    const heroVariant = fieldByName(HeroBlock, "variant");
    const layout = Pages.fields.find((field) => "name" in field && field.name === "layout");
    assert.match(descriptionOf(heroVariant), /timer automatico/);
    assert.ok(layout);
    assert.match(descriptionOf(layout), /timer automático/);
  });
});

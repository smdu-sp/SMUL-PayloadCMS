import type { Block } from "payload";
import {
  createAppearanceGroup,
  createSpacingField,
  createWidthField,
} from "../../fields/block-appearance";
import { closedSelect, requiredRichText } from "../../fields/editorial-validation";
import { createBlockAdmin } from "../shared/admin";

export const RichTextBlock: Block = {
  slug: "richText",
  interfaceName: "RichTextBlock",
  admin: createBlockAdmin("Conteúdo"),
  labels: {
    singular: "Texto editorial",
    plural: "Textos editoriais",
  },
  fields: [
    {
      name: "content",
      type: "richText",
      label: "Conteudo",
      required: true,
      validate: requiredRichText("Escreva o conteudo deste bloco."),
      admin: {
        description:
          "Area para texto, listas, links e subtitulos. A aparencia final segue a tipografia editorial do portal.",
      },
    },
    {
      name: "variant",
      type: "select",
      label: "Modelo de leitura",
      required: true,
      defaultValue: "default",
      validate: closedSelect(
        ["default", "narrow"],
        "Escolha um modelo de leitura aprovado.",
      ),
      admin: {
        description:
          "Padrao usa largura ampla para conteudos variados. Leitura estreita favorece textos corridos longos.",
      },
      options: [
        { label: "Padrao", value: "default" },
        { label: "Leitura estreita", value: "narrow" },
      ],
    },
    createAppearanceGroup([
      createWidthField(["narrow", "default", "wide"], "default"),
      createSpacingField(["compact", "default", "spacious"], "default"),
    ]),
  ],
};

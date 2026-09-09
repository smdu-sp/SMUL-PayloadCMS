import type { Block } from "payload";
import { characterLimitAdmin } from "../../fields/character-limit";
import {
  closedSelect,
  requiredRichText,
  requiredText,
} from "../../fields/editorial-validation";
import { createLinkFields } from "../../fields/link";
import { createBlockAdmin } from "../shared/admin";

export const ImageTextBlock: Block = {
  slug: "imageText",
  interfaceName: "ImageTextBlock",
  admin: createBlockAdmin("Mídia"),
  labels: {
    singular: "Mídia e texto / imagem de destaque",
    plural: "Mídia e texto / imagens de destaque",
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Titulo",
      required: true,
      maxLength: 100,
      validate: requiredText("Informe o titulo da secao com midia."),
      admin: {
        ...characterLimitAdmin(100),
        description:
          "Titulo da secao que acompanha a imagem.",
      },
    },
    {
      name: "content",
      type: "richText",
      label: "Conteudo",
      required: true,
      validate: requiredRichText("Escreva o conteudo que acompanha a midia."),
      admin: {
        description:
          "Texto complementar exibido ao lado da imagem em telas maiores.",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Imagem",
      required: true,
      admin: {
        description:
          "Imagem principal do bloco. Em celulares, ela aparece antes do texto.",
      },
    },
    {
      name: "variant",
      type: "select",
      label: "Posicao da imagem no desktop",
      required: true,
      defaultValue: "image-left",
      validate: closedSelect(
        ["image-left", "image-right"],
        "Escolha uma posicao de imagem aprovada.",
      ),
      admin: {
        description:
          "Escolha o lado da imagem em telas grandes. Em dispositivos moveis, imagem e texto ficam empilhados.",
      },
      options: [
        { label: "Imagem a esquerda", value: "image-left" },
        { label: "Imagem a direita", value: "image-right" },
      ],
    },
    {
      name: "cta",
      type: "group",
      label: "Acao complementar",
      admin: {
        description:
          "Link opcional exibido apos o texto.",
      },
      fields: createLinkFields(),
    },
  ],
};

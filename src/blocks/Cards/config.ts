import type { Block } from "payload";
import {
  closedSelect,
  requiredText,
  requiredTextarea,
} from "../../fields/editorial-validation";
import { createLinkFields } from "../../fields/link";
import { createBlockAdmin } from "../shared/admin";

export const CardsBlock: Block = {
  slug: "cards",
  interfaceName: "CardsBlock",
  admin: createBlockAdmin("Conteúdo"),
  labels: {
    singular: "Cards e grades de benefícios",
    plural: "Cards e grades de benefícios",
  },

imageURL: "/live-preview/cards",
imageAltText: "Prévia do bloco Cards e grades de benefícios",

  fields: [
    {
      name: "title",
      type: "text",
      label: "Titulo da lista",
      admin: {
        description:
          "Titulo opcional exibido antes dos cards.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Resumo da lista",
      admin: {
        description:
          "Texto opcional para explicar o conjunto de cards.",
      },
    },
    {
      name: "variant",
      type: "select",
      label: "Modelo da lista",
      required: true,
      defaultValue: "default",
      validate: closedSelect(
        ["default", "modalities"],
        "Escolha um modelo de cards aprovado.",
      ),
      admin: {
        description:
          "Padrao cobre listas editoriais gerais; modalidades destaca opcoes de regularizacao sem criar outro tipo de bloco.",
      },
      options: [
        { label: "Padrao", value: "default" },
        { label: "Modalidades", value: "modalities" },
      ],
    },
    {
      name: "items",
      type: "array",
      label: "Itens",
      required: true,
      minRows: 1,
      maxRows: 12,
      admin: {
        description:
          "Adicione de 1 a 12 cards. O layout ajusta a quantidade de colunas conforme a largura da tela.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "title",
          type: "text",
          label: "Titulo do card",
          required: true,
          validate: requiredText("Informe o titulo deste card."),
          admin: {
            description:
              "Texto principal do card. Pode quebrar linha sem afetar os demais itens.",
          },
        },
        {
          name: "description",
          type: "textarea",
          label: "Descricao do card",
          required: true,
          validate: requiredTextarea("Informe a descricao deste card."),
          admin: {
            description:
              "Resumo ou orientacao exibida dentro do card.",
          },
        },
        {
          name: "icon",
          type: "upload",
          relationTo: "media",
          label: "Icone",
          admin: {
            description:
              "Opcional. Use imagem simples e com texto alternativo adequado.",
          },
        },
        {
          name: "link",
          type: "group",
          label: "Link do card",
          admin: {
            description:
              "Opcional. Use quando o card deve encaminhar para outra pagina ou servico.",
          },
          fields: createLinkFields(),
        },
      ],
    },
  ],
};

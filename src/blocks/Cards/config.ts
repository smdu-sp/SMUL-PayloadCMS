import type { Block, UploadFieldSingleValidation } from "payload";
import {
  closedSelect,
  requiredText,
  requiredTextarea,
} from "../../fields/editorial-validation";
import { createLinkFields } from "../../fields/link";
import { createBlockAdmin } from "../shared/admin";

const mediaSourceOptions = [
  { label: "Sem midia", value: "none" },
  { label: "Icone", value: "icon" },
  { label: "Imagem", value: "image" },
];

const mediaPositionOptions = [
  { label: "Acima do texto", value: "top" },
  { label: "A esquerda", value: "left" },
  { label: "A direita", value: "right" },
];

const imageSizeOptions = [
  { label: "Pequena", value: "small" },
  { label: "Media", value: "medium" },
  { label: "Grande", value: "large" },
];

const imageAspectOptions = [
  { label: "Original", value: "original" },
  { label: "Quadrada", value: "square" },
  { label: "4:3", value: "4:3" },
  { label: "16:9", value: "16:9" },
];

const fitOptions = [
  { label: "Cobrir", value: "cover" },
  { label: "Conter", value: "contain" },
];

export const CardsBlock: Block = {
  slug: "cards",
  interfaceName: "CardsBlock",
  admin: createBlockAdmin("Conteúdo"),
  labels: {
    singular: "Cards e grades de benefícios",
    plural: "Cards e grades de benefícios",
  },
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
          name: "mediaSource",
          type: "select",
          label: "Tipo de midia",
          defaultValue: "none",
          validate: closedSelect(
            ["none", "icon", "image"],
            "Escolha um tipo de midia aprovado.",
          ),
          options: mediaSourceOptions,
        },
        {
          name: "mediaPosition",
          type: "select",
          label: "Posicao da midia",
          defaultValue: "top",
          validate: closedSelect(
            ["top", "left", "right"],
            "Escolha uma posicao de midia aprovada.",
          ),
          admin: {
            condition: (_, siblingData) => siblingData?.mediaSource !== "none",
          },
          options: mediaPositionOptions,
        },
        {
          name: "imageSize",
          type: "select",
          label: "Tamanho da imagem",
          defaultValue: "medium",
          validate: closedSelect(
            ["small", "medium", "large"],
            "Escolha um tamanho de imagem aprovado.",
          ),
          admin: {
            condition: (_, siblingData) => siblingData?.mediaSource === "image",
          },
          options: imageSizeOptions,
        },
        {
          name: "imageAspect",
          type: "select",
          label: "Proporcao da imagem",
          defaultValue: "original",
          validate: closedSelect(
            ["original", "square", "4:3", "16:9"],
            "Escolha uma proporcao de imagem aprovada.",
          ),
          admin: {
            condition: (_, siblingData) => siblingData?.mediaSource === "image",
          },
          options: imageAspectOptions,
        },
        {
          name: "fit",
          type: "select",
          label: "Enquadramento da imagem",
          defaultValue: "cover",
          validate: closedSelect(
            ["cover", "contain"],
            "Escolha um enquadramento aprovado.",
          ),
          admin: {
            condition: (_, siblingData) => siblingData?.mediaSource === "image",
          },
          options: fitOptions,
        },
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
            condition: (_, siblingData) =>
              !siblingData?.mediaSource || siblingData?.mediaSource === "icon",
            description:
              "Opcional para conteudo antigo; obrigatorio quando Tipo de midia for Icone.",
          },
          validate: ((value, { siblingData }) => {
            const data = siblingData as { image?: unknown; mediaSource?: string };
            if (data.mediaSource === "image" && value) {
              return "Use icone ou imagem, nao ambos no mesmo card.";
            }
            if (data.mediaSource === "icon" && !value) {
              return "Selecione um icone para este card.";
            }
            return true;
          }) satisfies UploadFieldSingleValidation,
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Imagem",
          admin: {
            condition: (_, siblingData) => siblingData?.mediaSource === "image",
            description:
              "Imagem do card. O arquivo original permanece preservado na biblioteca de midia.",
          },
          validate: ((value, { siblingData }) => {
            const data = siblingData as { icon?: unknown; mediaSource?: string };
            if (data.mediaSource === "icon" && value) {
              return "Use icone ou imagem, nao ambos no mesmo card.";
            }
            if (data.mediaSource === "image" && !value) {
              return "Selecione uma imagem para este card.";
            }
            return true;
          }) satisfies UploadFieldSingleValidation,
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

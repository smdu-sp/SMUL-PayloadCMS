import type { Block, UploadFieldSingleValidation } from "payload";
import { characterLimitAdmin } from "../../fields/character-limit";
import {
  createAppearanceGroup,
  createSpacingField,
  createToneField,
} from "../../fields/block-appearance";
import {
  STANDARD_ICONS,
  STANDARD_ICON_OPTIONS,
} from "../../domain/icons";
import {
  closedSelect,
  requiredText,
  requiredTextarea,
} from "../../fields/editorial-validation";
import { createImagePresentationFields } from "../../fields/image-presentation";
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
      maxLength: 100,
      admin: {
        ...characterLimitAdmin(100),
        description:
          "Titulo opcional exibido antes dos cards.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Resumo da lista",
      maxLength: 180,
      admin: {
        ...characterLimitAdmin(180, "textarea"),
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
    createAppearanceGroup([
      createToneField(["default", "surface", "muted"], "default"),
      createSpacingField(["compact", "default", "spacious"], "default"),
    ]),
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
          name: "imagePresentation",
          type: "group",
          label: "Apresentacao da imagem",
          admin: {
            condition: (_, siblingData) => siblingData?.mediaSource === "image",
            description:
              "Define como esta imagem aparece neste card sem alterar o arquivo original na Midia.",
          },
          fields: createImagePresentationFields({
            sizes: ["small", "medium", "large"],
            aspectRatios: ["original", "1:1", "4:3", "16:9"],
            defaultSize: "medium",
            defaultAspectRatio: "original",
            defaultFit: "cover",
            dbNames: {
              size: "sz",
              aspectRatio: "asp",
              fit: "fit",
            },
          }),
        },
        {
          name: "title",
          type: "text",
          label: "Titulo do card",
          required: true,
          maxLength: 80,
          validate: requiredText("Informe o titulo deste card."),
          admin: {
            ...characterLimitAdmin(80),
            description:
              "Texto principal do card. Pode quebrar linha sem afetar os demais itens.",
          },
        },
        {
          name: "description",
          type: "textarea",
          label: "Descricao do card",
          required: true,
          maxLength: 160,
          validate: requiredTextarea("Informe a descricao deste card."),
          admin: {
            ...characterLimitAdmin(160, "textarea"),
            description:
              "Resumo ou orientacao exibida dentro do card.",
          },
        },
        {
          name: "iconSource",
          type: "select",
          label: "Origem do icone",
          defaultValue: "standard",
          validate: closedSelect(
            ["standard", "custom"],
            "Escolha uma origem de icone aprovada.",
          ),
          admin: {
            condition: (_, siblingData) => siblingData?.mediaSource === "icon",
            description: "Escolha um icone padrao do catalogo ou uma midia personalizada.",
          },
          options: [
            { label: "Icone padrao", value: "standard" },
            { label: "Midia personalizada", value: "custom" },
          ],
        },
        {
          name: "standardIcon",
          type: "select",
          label: "Icone padrao",
          defaultValue: "info",
          validate: closedSelect(
            STANDARD_ICONS,
            "Escolha um icone padrao aprovado.",
          ),
          admin: {
            condition: (_, siblingData) =>
              siblingData?.mediaSource === "icon" &&
              (!siblingData?.iconSource || siblingData?.iconSource === "standard"),
            description: "Icone visual do catalogo central aprovado pelo Design System.",
          },
          options: STANDARD_ICON_OPTIONS,
        },
        {
          name: "icon",
          type: "upload",
          relationTo: "media",
          label: "Icone personalizado",
          admin: {
            condition: (_, siblingData) =>
              (!siblingData?.mediaSource || siblingData?.mediaSource === "icon") &&
              siblingData?.iconSource === "custom",
            description:
              "Opcional para conteudo antigo; obrigatorio quando Origem do icone for Midia personalizada.",
          },
          validate: ((value, { siblingData }) => {
            const data = siblingData as {
              iconSource?: string;
              image?: unknown;
              mediaSource?: string;
              standardIcon?: string;
            };
            if (data.mediaSource === "image" && value) {
              return "Use icone ou imagem, nao ambos no mesmo card.";
            }
            if (
              data.mediaSource === "icon" &&
              (data.iconSource === "custom" || (!data.iconSource && !data.standardIcon)) &&
              !value
            ) {
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

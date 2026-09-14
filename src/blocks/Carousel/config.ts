import type { Block, UploadFieldSingleValidation } from "payload";
import { characterLimitAdmin } from "../../fields/character-limit";
import { closedSelect } from "../../fields/editorial-validation";
import { createLinkFields } from "../../fields/link";
import { createBlockAdmin } from "../shared/admin";

const slidesPerViewOptions = [
  { label: "1 slide", value: "1" },
  { label: "2 slides", value: "2" },
  { label: "3 slides", value: "3" },
];

const navigationOptions = [
  { label: "Setas", value: "arrows" },
  { label: "Setas e indicadores", value: "arrows-dots" },
];

const autoplayOptions = [
  { label: "Desligado", value: "off" },
  { label: "Ligado", value: "on" },
];

export const CarouselBlock: Block = {
  slug: "carousel",
  dbName: "car",
  interfaceName: "CarouselBlock",
  admin: createBlockAdmin("Mídia"),
  labels: {
    singular: "Carrossel",
    plural: "Carrosseis",
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Titulo",
      maxLength: 100,
      admin: {
        ...characterLimitAdmin(100),
        description:
          "Opcional. Use para nomear o conjunto sequencial apresentado no carrossel.",
      },
    },
    {
      name: "items",
      type: "array",
      label: "Slides",
      required: true,
      minRows: 1,
      maxRows: 12,
      validate: (value) =>
        Array.isArray(value) && value.length > 0
          ? true
          : "Adicione ao menos um slide ao carrossel.",
      admin: {
        description:
          "Adicione slides em ordem sequencial. Cada slide pode ter imagem, texto e link opcional.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Imagem",
          required: true,
          validate: ((value) =>
            value ? true : "Selecione uma imagem para este slide.") satisfies UploadFieldSingleValidation,
          admin: {
            description:
              "Imagem principal do slide. O arquivo original permanece preservado na biblioteca de midia.",
          },
        },
        {
          name: "title",
          type: "text",
          label: "Titulo do slide",
          maxLength: 90,
          admin: {
            ...characterLimitAdmin(90),
            description: "Opcional. Titulo curto exibido junto da imagem.",
          },
        },
        {
          name: "description",
          type: "textarea",
          label: "Descricao do slide",
          maxLength: 180,
          admin: {
            ...characterLimitAdmin(180, "textarea"),
            description:
              "Opcional. Texto de apoio para explicar o slide sem transformar o carrossel em texto longo.",
            rows: 3,
          },
        },
        {
          name: "link",
          type: "group",
          label: "Link do slide",
          admin: {
            description:
              "Opcional. Use quando o slide deve encaminhar para outra pagina ou servico.",
          },
          fields: createLinkFields(),
        },
      ],
    },
    {
      name: "display",
      type: "group",
      label: "Exibicao",
      fields: [
        {
          name: "slidesPerView",
          type: "select",
          dbName: "spv",
          label: "Slides por visualizacao",
          required: true,
          defaultValue: "1",
          validate: closedSelect(
            ["1", "2", "3"],
            "Escolha uma quantidade de slides aprovada.",
          ),
          options: slidesPerViewOptions,
        },
        {
          name: "navigation",
          type: "select",
          dbName: "nav",
          label: "Navegacao",
          required: true,
          defaultValue: "arrows-dots",
          validate: closedSelect(
            ["arrows", "arrows-dots"],
            "Escolha uma navegacao aprovada.",
          ),
          options: navigationOptions,
        },
      ],
    },
    {
      name: "behavior",
      type: "group",
      label: "Comportamento",
      fields: [
        {
          name: "autoplay",
          type: "select",
          label: "Autoplay",
          required: true,
          defaultValue: "off",
          validate: closedSelect(
            ["off", "on"],
            "Escolha uma opcao de autoplay aprovada.",
          ),
          admin: {
            description:
              "Desligado e o padrao. Quando ligado, o usuario pode pausar e a rotacao para ao interagir.",
          },
          options: autoplayOptions,
        },
      ],
    },
  ],
};

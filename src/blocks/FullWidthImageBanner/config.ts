import type { Block, UploadFieldSingleValidation } from "payload";
import { closedSelect } from "../../fields/editorial-validation";
import { createLinkFields } from "../../fields/link";
import { createBlockAdmin } from "../shared/admin";

const overlayOptions = [
  { label: "Sem sobreposicao", value: "none" },
  { label: "Clara", value: "light" },
  { label: "Escura", value: "dark" },
];

const focalPointOptions = [
  { label: "Centro", value: "center" },
  { label: "Topo", value: "top" },
  { label: "Base", value: "bottom" },
  { label: "Esquerda", value: "left" },
  { label: "Direita", value: "right" },
];

const actionFieldDbNames: Record<string, string> = {
  label: "lbl",
  newTab: "nt",
  page: "pg",
  type: "kind",
  url: "url",
};

const createBannerActionFields = () =>
  createLinkFields(true).map((field) => {
    if ("name" in field && actionFieldDbNames[field.name]) {
      return {
        ...field,
        dbName: actionFieldDbNames[field.name],
      };
    }

    return field;
  });

export const FullWidthImageBannerBlock: Block = {
  slug: "fullWidthImageBanner",
  dbName: "fwib",
  interfaceName: "FullWidthImageBannerBlock",
  admin: createBlockAdmin("Mídia"),
  labels: {
    singular: "Banner de imagem full-width",
    plural: "Banners de imagem full-width",
  },
  fields: [
    {
      name: "desktopImage",
      type: "upload",
      relationTo: "media",
      label: "Imagem desktop",
      required: true,
      validate: ((value) =>
        value ? true : "Selecione uma imagem para o banner desktop.") satisfies UploadFieldSingleValidation,
      admin: {
        description:
          "Imagem principal do banner. O layout controla largura, altura e responsividade.",
      },
    },
    {
      name: "mobileImage",
      type: "upload",
      relationTo: "media",
      label: "Imagem mobile",
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.desktopImage),
        description:
          "Opcional. Use uma composicao alternativa quando a imagem desktop nao for adequada em telas estreitas.",
      },
    },
    {
      name: "content",
      type: "group",
      label: "Conteudo sobreposto",
      admin: {
        description:
          "Opcional. Use apenas quando a mensagem tambem deve existir como texto acessivel sobre a imagem.",
      },
      fields: [
        {
          name: "eyebrow",
          type: "text",
          label: "Chamada superior",
        },
        {
          name: "title",
          type: "text",
          label: "Titulo",
        },
        {
          name: "description",
          type: "textarea",
          label: "Descricao",
        },
        {
          name: "actions",
          type: "array",
          dbName: "acts",
          label: "Acoes",
          maxRows: 2,
          fields: createBannerActionFields(),
        },
      ],
    },
    {
      name: "contentPosition",
      type: "select",
      dbName: "cntPos",
      label: "Posicao do conteudo",
      required: true,
      defaultValue: "left",
      validate: closedSelect(
        ["left", "center", "right"],
        "Escolha uma posicao de conteudo aprovada.",
      ),
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
        { label: "Direita", value: "right" },
      ],
    },
    {
      name: "overlay",
      type: "select",
      label: "Sobreposicao",
      required: true,
      defaultValue: "dark",
      validate: closedSelect(
        ["none", "light", "dark"],
        "Escolha uma sobreposicao aprovada.",
      ),
      options: overlayOptions,
    },
    {
      name: "imageFit",
      type: "select",
      dbName: "imgFit",
      label: "Enquadramento",
      required: true,
      defaultValue: "cover",
      validate: closedSelect(
        ["cover", "contain"],
        "Escolha um enquadramento aprovado.",
      ),
      options: [
        { label: "Cobrir", value: "cover" },
        { label: "Conter", value: "contain" },
      ],
    },
    {
      name: "focalPoint",
      type: "select",
      dbName: "focal",
      label: "Foco visual",
      required: true,
      defaultValue: "center",
      validate: closedSelect(
        ["center", "top", "bottom", "left", "right"],
        "Escolha um foco visual aprovado.",
      ),
      options: focalPointOptions,
    },
    {
      name: "variant",
      type: "select",
      label: "Modelo",
      required: true,
      defaultValue: "default",
      validate: closedSelect(
        ["default", "compact", "immersive"],
        "Escolha um modelo de banner aprovado.",
      ),
      options: [
        { label: "Padrao", value: "default" },
        { label: "Compacto", value: "compact" },
        { label: "Imersivo", value: "immersive" },
      ],
    },
  ],
};

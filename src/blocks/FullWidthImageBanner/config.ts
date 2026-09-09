import type { Block, NumberFieldSingleValidation, UploadFieldSingleValidation } from "payload";
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

const imageHeightOptions = [
  { label: "Automatica", value: "auto" },
  { label: "Compacta", value: "compact" },
  { label: "Media", value: "medium" },
  { label: "Alta", value: "large" },
  { label: "Personalizada", value: "custom" },
];

const validateCustomImageHeight: NumberFieldSingleValidation = (value, { siblingData }) => {
  const data = siblingData as { imageHeight?: unknown };

  if (data.imageHeight !== "custom") return true;
  if (typeof value !== "number") return "Informe a altura personalizada em pixels.";
  if (value < 160 || value > 900) return "Informe uma altura entre 160 e 900 pixels.";

  return true;
};

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
    singular: "Banner de imagem",
    plural: "Banners de imagem",
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
          "Imagem principal do banner. Largura minima: 1200px. Ideal: 1920px para full-width. Formatos recomendados: .webp ou .jpg otimizado.",
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
      name: "imageHeight",
      type: "select",
      dbName: "imgHgt",
      label: "Altura da imagem",
      required: true,
      defaultValue: "auto",
      validate: closedSelect(
        ["auto", "compact", "medium", "large", "custom"],
        "Escolha uma altura de imagem aprovada.",
      ),
      admin: {
        description:
          "Automatica preserva a proporcao original. As demais opcoes definem uma altura fixa responsiva para o banner.",
      },
      options: imageHeightOptions,
    },
    {
      name: "customImageHeight",
      type: "number",
      label: "Altura personalizada (px)",
      min: 160,
      max: 900,
      admin: {
        condition: (_, siblingData) => siblingData?.imageHeight === "custom",
        description:
          "Informe uma altura entre 160 e 900 pixels. O valor controla apenas a apresentacao deste banner.",
        step: 10,
      },
      validate: validateCustomImageHeight,
    },
    {
      name: "imageFit",
      type: "select",
      dbName: "imgFit",
      label: "Enquadramento",
      required: true,
      defaultValue: "cover",
      admin: {
        condition: (_, siblingData) => siblingData?.imageHeight !== "auto",
        description:
          "Usado quando a altura e fixa para controlar se a imagem cobre a area ou aparece inteira.",
      },
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
      admin: {
        condition: (_, siblingData) => siblingData?.imageHeight !== "auto",
        description:
          "Usado quando a altura e fixa para priorizar uma regiao da imagem no corte.",
      },
      validate: closedSelect(
        ["center", "top", "bottom", "left", "right"],
        "Escolha um foco visual aprovado.",
      ),
      options: focalPointOptions,
    },
  ],
};

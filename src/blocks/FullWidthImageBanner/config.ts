import type {
  Block,
  NumberFieldSingleValidation,
  RelationshipFieldSingleValidation,
  SelectFieldSingleValidation,
  TextFieldValidation,
  UploadFieldSingleValidation,
} from "payload";
import {
  createAppearanceGroup,
  createControlledColorAppearanceFields,
  createSchemeField,
} from "../../fields/block-appearance";
import { closedSelect } from "../../fields/editorial-validation";
import { createBlockAdmin } from "../shared/admin";

// Without overlaid content, only the optional overlay consumes a local color.
const fullWidthBannerColorTokens = ["background"] as const;

type BannerLinkSiblingData = {
  enabled?: boolean | null;
  type?: "external" | "internal" | null;
};

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

export const FullWidthImageBannerBlock: Block = {
  slug: "fullWidthImageBanner",
  dbName: "fwib",
  interfaceName: "FullWidthImageBannerBlock",
  admin: createBlockAdmin("Mídia", {
    slug: "full-width-image-banner",
    alt: "Prévia de um banner de imagem em largura total",
  }),
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
      name: "link",
      type: "group",
      label: "Link do banner",
      admin: {
        description:
          "Opcional. Associe a imagem inteira a uma pagina do portal ou a uma URL externa.",
      },
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          label: "Associar banner a um link",
        },
        {
          name: "type",
          type: "select",
          label: "Destino do link",
          admin: {
            condition: (_, siblingData) =>
              (siblingData as BannerLinkSiblingData | undefined)?.enabled === true,
          },
          options: [
            { label: "Pagina interna", value: "internal" },
            { label: "URL externa", value: "external" },
          ],
          validate: ((value, { siblingData }) => {
            const link = siblingData as BannerLinkSiblingData;
            return link.enabled !== true || value === "internal" || value === "external"
              ? true
              : "Escolha o destino do link.";
          }) satisfies SelectFieldSingleValidation,
        },
        {
          name: "page",
          type: "relationship",
          relationTo: "pages",
          label: "Pagina interna",
          admin: {
            condition: (_, siblingData) => {
              const link = siblingData as BannerLinkSiblingData | undefined;
              return link?.enabled === true && link.type === "internal";
            },
            description:
              "Pagina de destino dentro do portal. Mudancas de slug nao quebram este relacionamento.",
          },
          validate: ((value, { siblingData }) => {
            const link = siblingData as BannerLinkSiblingData;
            return link.enabled !== true || link.type !== "internal" || value
              ? true
              : "Selecione a pagina de destino.";
          }) satisfies RelationshipFieldSingleValidation,
        },
        {
          name: "url",
          type: "text",
          label: "URL externa",
          admin: {
            condition: (_, siblingData) => {
              const link = siblingData as BannerLinkSiblingData | undefined;
              return link?.enabled === true && link.type === "external";
            },
            description: "Informe o endereco completo, incluindo http:// ou https://.",
          },
          validate: ((value, { siblingData }) => {
            const link = siblingData as BannerLinkSiblingData;
            if (link.enabled !== true || link.type !== "external") return true;
            if (!value) return "Informe a URL de destino.";

            try {
              const url = new URL(value);
              return url.protocol === "http:" || url.protocol === "https:"
                ? true
                : "Use uma URL iniciada por http:// ou https://.";
            } catch {
              return "Informe uma URL valida.";
            }
          }) satisfies TextFieldValidation,
        },
        {
          name: "newTab",
          type: "checkbox",
          label: "Abrir em nova aba",
          admin: {
            condition: (_, siblingData) =>
              (siblingData as BannerLinkSiblingData | undefined)?.enabled === true,
            description: "Recomendado para links externos.",
          },
        },
      ],
    },
    {
      name: "overlay",
      type: "select",
      label: "Sobreposicao",
      required: true,
      defaultValue: "none",
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
    createAppearanceGroup([
      createSchemeField(["default", "custom"], "default"),
      ...createControlledColorAppearanceFields(fullWidthBannerColorTokens),
    ]),
  ],
};

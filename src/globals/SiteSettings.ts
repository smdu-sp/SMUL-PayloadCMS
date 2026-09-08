import type { GlobalConfig } from "payload";
import { adminOnly } from "../access/roles.ts";
import { createSeoFields } from "../fields/seo.ts";
import { validateOptionalHexColor } from "../lib/theme/colors.ts";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: () => true,
    update: adminOnly,
  },
  label: "Configurações do site",
  admin: {
    description:
      "Configure informacoes gerais, links oficiais, SEO padrao e cores institucionais controladas pelo Design System.",
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      label: "Nome do site",
      required: true,
      admin: {
        description:
          "Nome institucional usado como identificacao principal do portal.",
      },
    },
    {
      name: "deadline",
      type: "date",
      label: "Prazo institucional",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "dd/MM/yyyy",
        },
        description:
          "Data institucional exibida pelo conteudo editorial quando aplicavel. Mantenha este valor alinhado aos atos oficiais.",
      },
    },
    {
      name: "officialLinks",
      type: "array",
      label: "Links oficiais",
      admin: {
        description:
          "Canais oficiais usados pelo portal para encaminhar o usuario. Evite links informais ou temporarios.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "label",
          type: "text",
          label: "Texto do link",
          required: true,
          admin: {
            description: "Texto curto e claro para identificar o canal oficial.",
          },
        },
        {
          name: "url",
          type: "text",
          label: "URL",
          required: true,
          admin: {
            description:
              "Endereco completo do canal oficial, incluindo https://.",
          },
        },
      ],
    },
    {
      name: "branding",
      type: "group",
      label: "Cores institucionais",
      admin: {
        description:
          "Ajuste apenas as cores permitidas pelo Design System. Nao e possivel inserir CSS livre.",
      },
      fields: [
        {
          name: "primaryColor",
          type: "text",
          label: "Cor principal",
          defaultValue: "#0a3299",
          admin: {
            description:
              "Cor principal de botoes, links e destaques. Use hexadecimal curto ou longo, como #0a3299.",
          },
          validate: validateOptionalHexColor,
        },
        {
          name: "secondaryColor",
          type: "text",
          label: "Cor institucional escura",
          defaultValue: "#0a3299",
          admin: {
            description:
              "Cor de fundos fortes, como areas de destaque. Use hexadecimal curto ou longo, como #0a3299.",
          },
          validate: validateOptionalHexColor,
        },
        {
          name: "accentColor",
          type: "text",
          label: "Cor de destaque",
          defaultValue: "#5cd6c9",
          admin: {
            description:
              "Cor suave para superficies de apoio e chamadas secundarias. Use hexadecimal curto ou longo, como #5cd6c9.",
          },
          validate: validateOptionalHexColor,
        },
      ],
    },
    {
      name: "defaultSEO",
      type: "group",
      label: "SEO padrao",
      admin: {
        description:
          "Valores usados quando uma pagina nao possui SEO proprio configurado.",
      },
      fields: createSeoFields(),
    },
  ],
};


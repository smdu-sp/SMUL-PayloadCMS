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
          admin: {
            description:
              "Cor principal de botoes, links e destaques. Use hexadecimal curto ou longo. Deixe vazio para usar o padrao SMUL.",
            hidden: true,
          },
          validate: validateOptionalHexColor,
        },
        {
          name: "secondaryColor",
          type: "text",
          label: "Cor institucional escura",
          admin: {
            description:
              "Cor de fundos fortes, como areas de destaque. Use hexadecimal curto ou longo. Deixe vazio para usar o padrao SMUL.",
            hidden: true,
          },
          validate: validateOptionalHexColor,
        },
        {
          name: "accentColor",
          type: "text",
          label: "Cor de destaque",
          admin: {
            description:
              "Cor suave para superficies de apoio e chamadas secundarias. Use hexadecimal curto ou longo. Deixe vazio para usar o padrao SMUL.",
            hidden: true,
          },
          validate: validateOptionalHexColor,
        },
        {
          type: "collapsible",
          label: "Elements",
          admin: {
            description:
              "Composicao principal do site inspirada no modelo Happy Hues.",
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "backgroundColor",
                  type: "text",
                  label: "Background",
                  admin: {
                    description:
                      "Fundo geral de paginas e secoes. Deixe vazio para usar o padrao SMUL.",
                    width: "50%",
                  },
                  validate: validateOptionalHexColor,
                },
                {
                  name: "headlineColor",
                  type: "text",
                  label: "Headline",
                  admin: {
                    description:
                      "Cor dos titulos editoriais. Deixe vazio para usar o padrao SMUL.",
                    width: "50%",
                  },
                  validate: validateOptionalHexColor,
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "paragraphColor",
                  type: "text",
                  label: "Paragraph",
                  admin: {
                    description:
                      "Cor do texto corrido. Deixe vazio para usar o texto padrao do Design System.",
                    width: "50%",
                  },
                  validate: validateOptionalHexColor,
                },
                {
                  name: "buttonColor",
                  type: "text",
                  label: "Button",
                  admin: {
                    description:
                      "Cor de botoes principais e chamadas clicaveis. Deixe vazio para usar o padrao SMUL.",
                    width: "50%",
                  },
                  validate: validateOptionalHexColor,
                },
              ],
            },
            {
              name: "buttonTextColor",
              type: "text",
              label: "Button text",
              admin: {
                description:
                  "Cor do texto em botoes fortes. Deixe vazio para usar o contraste padrao.",
              },
              validate: validateOptionalHexColor,
            },
          ],
        },
        {
          type: "collapsible",
          label: "Illustration",
          admin: {
            description:
              "Cores de apoio para ilustracoes, detalhes e composicoes visuais.",
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "strokeColor",
                  type: "text",
                  label: "Stroke",
                  admin: {
                    description:
                      "Cor de contornos em ilustracoes e detalhes graficos futuros.",
                    width: "50%",
                  },
                  validate: validateOptionalHexColor,
                },
                {
                  name: "mainColor",
                  type: "text",
                  label: "Main",
                  admin: {
                    description:
                      "Cor principal de ilustracoes e areas graficas futuras.",
                    width: "50%",
                  },
                  validate: validateOptionalHexColor,
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "highlightColor",
                  type: "text",
                  label: "Highlight",
                  admin: {
                    description:
                      "Cor de detalhes, icones e enfases menores. Deixe vazio para usar o padrao SMUL.",
                    width: "50%",
                  },
                  validate: validateOptionalHexColor,
                },
                {
                  name: "secondaryIllustrationColor",
                  type: "text",
                  label: "Secondary",
                  admin: {
                    description:
                      "Cor secundaria para apoio visual e variacoes de enfase.",
                    width: "50%",
                  },
                  validate: validateOptionalHexColor,
                },
              ],
            },
            {
              name: "tertiaryColor",
              type: "text",
              label: "Tertiary",
              admin: {
                description:
                  "Cor terciaria para composicoes futuras e detalhes raros.",
              },
              validate: validateOptionalHexColor,
            },
            {
              name: "actionColor",
              type: "text",
              label: "Acao",
              admin: {
                hidden: true,
              },
              validate: validateOptionalHexColor,
            },
            {
              name: "actionForegroundColor",
              type: "text",
              label: "Texto da acao",
              admin: {
                hidden: true,
              },
              validate: validateOptionalHexColor,
            },
            {
              name: "linkColor",
              type: "text",
              label: "Link",
              admin: {
                hidden: true,
              },
              validate: validateOptionalHexColor,
            },
            {
              name: "secondaryAccentColor",
              type: "text",
              label: "Destaque secundario",
              admin: {
                hidden: true,
              },
              validate: validateOptionalHexColor,
            },
            {
              name: "tertiaryAccentColor",
              type: "text",
              label: "Destaque terciario",
              admin: {
                hidden: true,
              },
              validate: validateOptionalHexColor,
            },
          ],
        },
        {
          name: "resetThemeColors",
          type: "ui",
          admin: {
            components: {
              Field: "/components/admin/ThemeColorReset#ThemeColorReset",
            },
          },
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


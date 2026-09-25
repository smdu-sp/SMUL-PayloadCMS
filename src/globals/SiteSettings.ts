import { validateBasePalette, type PaletteInput } from "../lib/theme/semantic-theme";
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
      name: "theme",
      type: "group",
      label: "Tema",
      fields: [
        {
          name: "colors",
          type: "group",
          label: "Cores do tema",
          validate: (value) => validateBasePalette(value as PaletteInput),
          admin: { description: "Cinco papeis globais. Deixe vazio para usar os defaults institucionais. Os pares de contraste sao resolvidos pelo Design System." },
          fields: [
            {
              name: "background",
              type: "text",
              label: "Fundo principal (Background)",
              validate: validateOptionalHexColor,
              admin: {
                components: {
                  beforeInput: ["/components/admin/HexColorPicker#HexColorPicker"],
                },
                description: "Cor de fundo estrutural das páginas e blocos padrão. Deixe vazio para restaurar o padrão institucional.",
              },
            },
            {
              name: "foreground",
              type: "text",
              label: "Texto principal (Foreground)",
              validate: validateOptionalHexColor,
              admin: {
                components: {
                  beforeInput: ["/components/admin/HexColorPicker#HexColorPicker"],
                },
                description: "Cor utilizada para os textos de leitura básica. Precisa ter alto contraste com a cor de fundo. Deixe vazio para restaurar o padrão institucional.",
              },
            },
            {
              name: "brand",
              type: "text",
              label: "Identidade Institucional (Brand)",
              validate: validateOptionalHexColor,
              admin: {
                components: {
                  beforeInput: ["/components/admin/HexColorPicker#HexColorPicker"],
                },
                description: "Cor institucional forte, aplicada para preencher o fundo de painéis de destaque e áreas de grande peso da marca. Deixe vazio para restaurar o padrão institucional.",
              },
            },
            {
              name: "action",
              type: "text",
              label: "Ação e Interatividade (Action)",
              validate: validateOptionalHexColor,
              admin: {
                components: {
                  beforeInput: ["/components/admin/HexColorPicker#HexColorPicker"],
                },
                description: "Cor focada na conversão e usabilidade, aplicada exclusivamente em botões principais (CTAs), links e áreas clicáveis do portal. Deixe vazio para restaurar o padrão institucional.",
              },
            },
            {
              name: "accent",
              type: "text",
              label: "Detalhes de Apoio (Accent)",
              validate: validateOptionalHexColor,
              admin: {
                components: {
                  beforeInput: ["/components/admin/HexColorPicker#HexColorPicker"],
                },
                description: "Cor gráfica secundária, utilizada para enfeites da interface, destaques menores, badges estruturais e ícones. Deixe vazio para restaurar o padrão institucional.",
              },
            },
          ],
        },
        {
          name: "resetThemeColors",
          type: "ui",
          admin: { components: { Field: "/components/admin/ThemeColorReset#ThemeColorReset" } },
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


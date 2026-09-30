import type { Field } from "payload";

import { validateOptionalHexColor } from "../lib/theme/colors.ts";
import { validateGoogleFontUrl } from "../lib/theme/google-fonts.ts";
import {
  validateBasePalette,
  type PaletteInput,
} from "../lib/theme/semantic-theme.ts";

const colorFields = [
  {
    name: "background",
    label: "Fundo principal (Background)",
    description:
      "Cor de fundo estrutural das paginas e blocos padrao. Deixe vazio para herdar o padrao institucional.",
  },
  {
    name: "foreground",
    label: "Texto principal (Foreground)",
    description:
      "Cor utilizada para os textos de leitura basica. Precisa ter alto contraste com a cor de fundo.",
  },
  {
    name: "brand",
    label: "Identidade institucional (Brand)",
    description:
      "Cor institucional forte aplicada a paineis de destaque e areas de maior peso da marca.",
  },
  {
    name: "action",
    label: "Acao e interatividade (Action)",
    description:
      "Cor aplicada a botoes principais, links e demais areas clicaveis do portal.",
  },
  {
    name: "accent",
    label: "Detalhes de apoio (Accent)",
    description:
      "Cor usada em destaques menores, badges estruturais, icones e detalhes graficos.",
  },
] as const;

export function createThemeFields(): Field[] {
  return [
    {
      name: "colors",
      type: "group",
      label: "Cores do tema",
      validate: (value) => validateBasePalette(value as PaletteInput),
      admin: {
        description:
          "Cinco papeis globais controlados. Campos vazios herdam os defaults institucionais e os pares de contraste sao resolvidos pelo Design System.",
      },
      fields: colorFields.map(({ description, label, name }) => ({
        name,
        type: "text" as const,
        label,
        validate: validateOptionalHexColor,
        admin: {
          components: {
            beforeInput: ["/components/admin/HexColorPicker#HexColorPicker"],
          },
          description,
        },
      })),
    },
    {
      name: "typography",
      type: "group",
      label: "Tipografia",
      admin: {
        description:
          "Fontes carregadas pela API CSS v2 do Google Fonts. Campos vazios usam a tipografia institucional padrao.",
      },
      fields: [
        {
          name: "bodyUrl",
          type: "text",
          label: "Fonte de textos",
          validate: validateGoogleFontUrl,
          admin: {
            description:
              "Cole o link de uma unica familia do Google Fonts, incluindo os pesos usados no portal.",
            placeholder:
              "https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;700&display=swap",
          },
        },
        {
          name: "headingUrl",
          type: "text",
          label: "Fonte de titulos",
          validate: validateGoogleFontUrl,
          admin: {
            description:
              "Opcional. Se vazio, os titulos herdam a fonte de textos.",
            placeholder:
              "https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap",
          },
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
  ];
}

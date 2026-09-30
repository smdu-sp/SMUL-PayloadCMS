import type { GlobalConfig } from "payload";

import { adminOnly } from "../access/roles.ts";
import { createSeoFields } from "../fields/seo.ts";
import { createThemeFields } from "../fields/theme.ts";
import { revalidateSiteShellGlobal } from "../lib/payload/revalidate-site-shell.ts";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: () => true,
    update: adminOnly,
  },
  label: "Configurações do site",
  admin: {
    description:
      "Configure informacoes gerais, links oficiais, SEO padrao e o tema institucional controlado pelo Design System.",
  },
  hooks: {
    afterChange: [revalidateSiteShellGlobal],
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
      name: "activeTheme",
      type: "relationship",
      relationTo: "themes",
      label: "Tema ativo",
      admin: {
        description:
          "Tema aplicado globalmente ao portal. Se vazio, o tema base configurado abaixo continua sendo usado.",
      },
    },
    {
      name: "theme",
      type: "group",
      label: "Tema base",
      admin: {
        description:
          "Configuracao preservada para compatibilidade e usada quando nenhum tema alternativo esta ativo.",
      },
      fields: createThemeFields(),
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

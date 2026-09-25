import type { GlobalConfig } from "payload";
import { adminOrEditor } from "../access/roles.ts";
import { revalidateSiteShellGlobal } from "../lib/payload/revalidate-site-shell.ts";

export const Header: GlobalConfig = {
  slug: "header",
  access: {
    read: () => true,
    update: adminOrEditor,
  },
  label: "Cabeçalho",
  admin: {
    description:
      "Configure a navegacao principal exibida no topo do portal.",
  },
  hooks: {
    afterChange: [revalidateSiteShellGlobal],
  },
  fields: [
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      label: "Logo",
      admin: {
        description:
          "Opcional. Se vazio, o nome do site continua identificando o portal.",
      },
    },
    {
      name: "navigation",
      type: "array",
      label: "Links de navegacao",
      admin: {
        description:
          "Lista de paginas principais exibidas no cabecalho. Mantenha poucos itens para facilitar a leitura.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "label",
          type: "text",
          label: "Texto do menu",
          required: true,
          admin: {
            description: "Texto curto exibido no cabecalho.",
          },
        },
        {
          name: "page",
          type: "relationship",
          relationTo: "pages",
          label: "Pagina",
          required: true,
          filterOptions: {
            _status: { equals: "published" },
            lifecycleStatus: { equals: "active" },
          },
          admin: {
            description:
              "Pagina de destino dentro do portal. Mudancas de slug nao quebram este relacionamento.",
          },
        },
      ],
    },
  ],
};


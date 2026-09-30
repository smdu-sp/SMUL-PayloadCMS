import type {
  ArrayFieldValidation,
  GlobalConfig,
  RelationshipFieldSingleValidation,
} from "payload";
import { adminOrEditor } from "../access/roles.ts";
import { closedSelect } from "../fields/editorial-validation.ts";
import { revalidateSiteShellGlobal } from "../lib/payload/revalidate-site-shell.ts";

const availablePageFilter = {
  _status: { equals: "published" },
  lifecycleStatus: { equals: "active" },
} as const;

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
      name: "navigationMode",
      type: "select",
      label: "Tipo de menu",
      required: true,
      defaultValue: "normal",
      validate: closedSelect(
        ["normal", "submenus"],
        "Escolha um tipo de menu válido.",
      ),
      options: [
        { label: "Normal", value: "normal" },
        { label: "Com submenus", value: "submenus" },
      ],
      admin: {
        description:
          "Normal preserva a navegação atual. Com submenus permite combinar páginas diretas e categorias.",
      },
    },
    {
      name: "enableSearch",
      type: "checkbox",
      label: "Exibir busca no cabeçalho",
      defaultValue: false,
      admin: {
        description:
          "Adiciona um campo de busca por páginas publicadas e ativas do portal.",
      },
    },
    {
      name: "navigation",
      type: "array",
      label: "Links de navegacao",
      admin: {
        condition: (data) => data?.navigationMode !== "submenus",
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
          filterOptions: availablePageFilter,
          admin: {
            description:
              "Pagina de destino dentro do portal. Mudancas de slug nao quebram este relacionamento.",
          },
        },
      ],
    },
    {
      name: "menuItems",
      type: "array",
      label: "Itens do menu com submenus",
      maxRows: 6,
      admin: {
        condition: (data) => data?.navigationMode === "submenus",
        description:
          "Adicione até seis páginas diretas ou categorias. Categorias podem conter até oito links internos.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "type",
          type: "select",
          label: "Tipo do item",
          required: true,
          defaultValue: "page",
          validate: closedSelect(
            ["page", "category"],
            "Escolha página direta ou categoria.",
          ),
          options: [
            { label: "Página direta", value: "page" },
            { label: "Categoria com submenu", value: "category" },
          ],
        },
        {
          name: "label",
          type: "text",
          label: "Texto do menu",
          required: true,
          maxLength: 60,
          admin: {
            description:
              "Texto curto usado no link direto ou como título da categoria.",
          },
        },
        {
          name: "page",
          type: "relationship",
          relationTo: "pages",
          label: "Página",
          filterOptions: availablePageFilter,
          admin: {
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | undefined)?.type === "page",
            description: "Destino interno do item direto.",
          },
          validate: ((value, { siblingData }) =>
            (siblingData as { type?: string } | undefined)?.type !== "page" || value
              ? true
              : "Selecione a página deste item.") satisfies RelationshipFieldSingleValidation,
        },
        {
          name: "links",
          type: "array",
          label: "Links da categoria",
          maxRows: 8,
          admin: {
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | undefined)?.type === "category",
            description:
              "Links internos exibidos no submenu. Categorias vazias não aparecem no portal.",
            initCollapsed: true,
          },
          validate: ((value, { siblingData }) =>
            (siblingData as { type?: string } | undefined)?.type !== "category" ||
            (Array.isArray(value) && value.length > 0)
              ? true
              : "Adicione pelo menos um link à categoria.") satisfies ArrayFieldValidation,
          fields: [
            {
              name: "label",
              type: "text",
              label: "Texto do link",
              required: true,
              maxLength: 80,
            },
            {
              name: "page",
              type: "relationship",
              relationTo: "pages",
              label: "Página",
              required: true,
              filterOptions: availablePageFilter,
              admin: {
                description:
                  "Página publicada e ativa. Mudanças de slug não quebram o relacionamento.",
              },
            },
          ],
        },
      ],
    },
  ],
};


import type { Block } from "payload";
import { closedSelect, requiredText } from "../../fields/editorial-validation";
import { createLinkFields } from "../../fields/link";
import { createBlockAdmin } from "../shared/admin";

export const ActionBannersBlock: Block = {
  slug: "actionBanners",
  interfaceName: "ActionBannersBlock",
  admin: createBlockAdmin("Ações"),
  labels: {
    singular: "Faixas de ação",
    plural: "Faixas de ação",
  },


imageURL: "/live-preview/actionBanners", // ← slug do blockType
  imageAltText: "Prévia do bloco Faixas de ação",
  
  fields: [
    {
      name: "title",
      type: "text",
      label: "Titulo da secao",
      admin: {
        description:
          "Opcional. Use quando o conjunto de faixas precisar de contexto.",
      },
    },
    {
      name: "variant",
      type: "select",
      label: "Modelo de exibicao",
      required: true,
      defaultValue: "grid",
      validate: closedSelect(
        ["grid", "stacked"],
        "Escolha um modelo de faixas aprovado.",
      ),
      admin: {
        description:
          "Grade mostra faixas lado a lado; empilhado favorece chamadas longas.",
      },
      options: [
        { label: "Grade", value: "grid" },
        { label: "Empilhado", value: "stacked" },
      ],
    },
    {
      name: "banners",
      type: "array",
      label: "Faixas",
      required: true,
      minRows: 1,
      maxRows: 6,
      admin: {
        description:
          "Cada faixa deve ter uma acao clara e um tom escolhido do Design System.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "title",
          type: "text",
          label: "Titulo da faixa",
          required: true,
          validate: requiredText("Informe o titulo deste banner."),
          admin: {
            description: "Mensagem curta da faixa de acao.",
          },
        },
        {
          name: "description",
          type: "textarea",
          label: "Descricao da faixa",
          admin: {
            description:
              "Opcional. Use para explicar a acao antes do botao.",
          },
        },
        {
          name: "appearance",
          type: "select",
          label: "Tom visual",
          required: true,
          defaultValue: "primary",
          validate: closedSelect(
            ["primary", "brand", "accent"],
            "Escolha uma aparencia aprovada para este banner.",
          ),
          admin: {
            description:
              "Mapeia a faixa para tokens do Design System, sem cores livres.",
          },
          options: [
            { label: "Verde — principal", value: "primary" },
            { label: "Azul — institucional", value: "brand" },
            { label: "Amarelo — apoio", value: "accent" },
          ],
        },
        {
          name: "button",
          type: "group",
          label: "Botao",
          fields: createLinkFields(true),
        },
      ],
    },
  ],
};

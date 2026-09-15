import type { Block } from "payload";
import { closedSelect, requiredRichText } from "../../fields/editorial-validation";
import { createLinkFields } from "../../fields/link";
import { createBlockAdmin } from "../shared/admin";

export const AlertBoxBlock: Block = {
  slug: "alertBox",
  interfaceName: "AlertBoxBlock",
  admin: createBlockAdmin("Conteúdo"),
  labels: {
    singular: "Caixa de aviso",
    plural: "Caixas de aviso",
  },

imageURL: "/live-preview/alertBox", // ← slug do blockType
  imageAltText: "Prévia do bloco Caixa de aviso",

  fields: [
    {
      name: "title",
      type: "text",
      label: "Titulo do aviso",
      admin: {
        description:
          "Opcional. Use quando o aviso precisar de uma chamada curta.",
      },
    },
    {
      name: "content",
      type: "richText",
      label: "Conteudo do aviso",
      required: true,
      validate: requiredRichText("Escreva o conteudo da caixa de aviso."),
      admin: {
        description:
          "Texto do aviso. Mantenha linguagem orientativa e evite conclusoes definitivas.",
      },
    },
    {
      name: "type",
      type: "select",
      label: "Tipo de aviso",
      required: true,
      defaultValue: "info",
      validate: closedSelect(
        ["info", "warning"],
        "Escolha um tipo de aviso aprovado.",
      ),
      admin: {
        description:
          "Define apenas o tom visual do aviso dentro do Design System.",
      },
      options: [
        { label: "Informativo", value: "info" },
        { label: "Atencao", value: "warning" },
      ],
    },
    {
      name: "link",
      type: "group",
      label: "Link complementar",
      admin: {
        description:
          "Opcional. Use para encaminhar o usuario a uma pagina ou servico oficial.",
      },
      fields: createLinkFields(),
    },
  ],
};

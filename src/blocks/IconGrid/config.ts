import type { Block } from "payload";
import { closedSelect, requiredText } from "../../fields/editorial-validation";
import { createIconFields } from "../../fields/icon";
import { createLinkFields } from "../../fields/link";
import { createBlockAdmin } from "../shared/admin";

export const IconGridBlock: Block = {
  slug: "iconGrid",
  interfaceName: "IconGridBlock",
  admin: createBlockAdmin("Conteúdo"),
  labels: {
    singular: "Grade de ícones e informações",
    plural: "Grades de ícones e informações",
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Titulo da secao",
      required: true,
      validate: requiredText("Informe o titulo da grade de icones."),
      admin: {
        description:
          "Titulo curto que contextualiza o conjunto de itens com icones.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Resumo da secao",
      admin: {
        description:
          "Texto opcional para orientar a leitura antes da grade.",
      },
    },
    {
      name: "variant",
      type: "select",
      label: "Modelo da grade",
      required: true,
      defaultValue: "default",
      validate: closedSelect(
        ["default", "compact"],
        "Escolha um modelo de grade aprovado.",
      ),
      admin: {
        description:
          "Padrao destaca descricoes; compacto favorece listas mais densas.",
      },
      options: [
        { label: "Padrao", value: "default" },
        { label: "Compacto", value: "compact" },
      ],
    },
    {
      name: "items",
      type: "array",
      label: "Itens",
      required: true,
      minRows: 1,
      maxRows: 18,
      admin: {
        description:
          "Adicione itens curtos com icone. Reordene conforme a prioridade editorial.",
        initCollapsed: true,
      },
      fields: [
        ...createIconFields({ allowNone: true, defaultSource: "standard" }),
        {
          name: "description",
          type: "text",
          label: "Texto do item",
          required: true,
          validate: requiredText("Informe a descricao deste item."),
          admin: {
            description:
              "Texto curto exibido junto ao icone. Evite paragrafos longos.",
          },
        },
        {
          name: "link",
          type: "group",
          label: "Link do item",
          admin: {
            description:
              "Opcional. Use apenas quando o item encaminhar para detalhe ou servico.",
          },
          fields: createLinkFields(),
        },
      ],
    },
  ],
};

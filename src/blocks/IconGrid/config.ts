import type { Block } from "payload";
import { characterLimitAdmin } from "../../fields/character-limit";
import {
  createAppearanceGroup,
  createSpacingField,
  createToneField,
} from "../../fields/block-appearance";

import { closedSelect, requiredText } from "../../fields/editorial-validation";
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
      maxLength: 100,
      validate: requiredText("Informe o titulo da grade de icones."),
      admin: {
        ...characterLimitAdmin(100),
        description:
          "Titulo curto que contextualiza o conjunto de itens com icones.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Resumo da secao",
      maxLength: 180,
      admin: {
        ...characterLimitAdmin(180, "textarea"),
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
    createAppearanceGroup([
      createToneField(["default", "surface", "muted"], "default"),
      createSpacingField(["compact", "default", "spacious"], "default"),
    ]),
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
        {
          name: "icon",
          type: "upload",
          relationTo: "media",
          label: "Icone",
          admin: {
            description:
              "Opcional. Use imagens simples e com texto alternativo adequado.",
          },
        },
        {
          name: "description",
          type: "text",
          label: "Texto do item",
          required: true,
          maxLength: 120,
          validate: requiredText("Informe a descricao deste item."),
          admin: {
            ...characterLimitAdmin(120),
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

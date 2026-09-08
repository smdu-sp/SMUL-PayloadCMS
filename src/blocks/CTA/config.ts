import type { Block } from "payload";
import {
  createAppearanceGroup,
  createSpacingField,
  createToneField,
} from "../../fields/block-appearance";
import { closedSelect, requiredText } from "../../fields/editorial-validation";
import { createLinkFields } from "../../fields/link";
import { createBlockAdmin } from "../shared/admin";

export const CTABlock: Block = {
  slug: "cta",
  interfaceName: "CTABlock",
  admin: createBlockAdmin("Ações"),
  labels: {
    singular: "Chamada de acao",
    plural: "Chamadas de acao",
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Titulo",
      required: true,
      validate: requiredText("Informe o titulo da chamada de acao."),
      admin: {
        description:
          "Mensagem curta que encerra uma secao ou orienta o proximo passo.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Descricao",
      admin: {
        description:
          "Texto opcional para explicar o contexto da chamada.",
      },
    },
    {
      name: "action",
      type: "group",
      label: "Link da acao",
      admin: {
        description:
          "Destino obrigatorio da chamada. Use pagina interna ou URL oficial externa.",
      },
      fields: createLinkFields(true),
    },
    {
      name: "variant",
      type: "select",
      label: "Modelo de chamada",
      required: true,
      defaultValue: "default",
      validate: closedSelect(
        ["default", "brand", "compact"],
        "Escolha um modelo de chamada aprovado.",
      ),
      admin: {
        description:
          "Padrao serve para chamadas gerais; Destaque institucional usa fundo forte; Compacta funciona melhor em encerramentos repetidos.",
      },
      options: [
        { label: "Padrao", value: "default" },
        { label: "Destaque institucional", value: "brand" },
        { label: "Compacta", value: "compact" },
      ],
    },
    createAppearanceGroup([
      createToneField(["default", "brand", "accent", "muted"], "default"),
      createSpacingField(["compact", "default", "spacious"], "default"),
    ]),
  ],
};

import type { Block } from "payload";
import { characterLimitAdmin } from "../../fields/character-limit";
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
      maxLength: 100,
      validate: requiredText("Informe o titulo da chamada de acao."),
      admin: {
        ...characterLimitAdmin(100),
        description:
          "Mensagem curta que encerra uma secao ou orienta o proximo passo.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Descricao",
      maxLength: 180,
      admin: {
        ...characterLimitAdmin(180, "textarea"),
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
  ],
};

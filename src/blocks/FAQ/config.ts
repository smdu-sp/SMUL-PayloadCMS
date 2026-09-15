import type { Block } from "payload";
import {
  closedSelect,
  requiredRichText,
  requiredText,
} from "../../fields/editorial-validation";
import { createBlockAdmin } from "../shared/admin";

export const FAQBlock: Block = {
  slug: "faqAccordion",
  interfaceName: "FAQAccordionBlock",
  admin: createBlockAdmin("Conteúdo"),
  labels: {
    singular: "Perguntas frequentes",
    plural: "Perguntas frequentes",
  },

imageURL: "/live-preview/faqAccordion",
  imageAltText: "Prévia do bloco Perguntas frequentes",

  
  fields: [
    {
      name: "title",
      type: "text",
      label: "Titulo da secao",
      required: true,
      validate: requiredText("Informe o titulo das perguntas frequentes."),
      admin: {
        description:
          "Titulo exibido antes da lista de perguntas.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Resumo da secao",
      admin: {
        description:
          "Texto opcional para contextualizar as perguntas.",
      },
    },
    {
      name: "variant",
      type: "select",
      label: "Modelo da lista",
      required: true,
      defaultValue: "default",
      validate: closedSelect(
        ["default", "compact"],
        "Escolha um modelo de perguntas aprovado.",
      ),
      admin: {
        description:
          "Padrao usa mais espacamento; compacto favorece paginas densas.",
      },
      options: [
        { label: "Padrao", value: "default" },
        { label: "Compacto", value: "compact" },
      ],
    },
    {
      name: "items",
      type: "array",
      label: "Perguntas e respostas",
      required: true,
      minRows: 1,
      maxRows: 20,
      admin: {
        description:
          "Cada item vira uma linha expansivel acessivel por teclado.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "question",
          type: "text",
          label: "Pergunta",
          required: true,
          validate: requiredText("Informe a pergunta deste item."),
          admin: {
            description: "Pergunta clara e direta exibida no acordeao.",
          },
        },
        {
          name: "answer",
          type: "richText",
          label: "Resposta",
          required: true,
          validate: requiredRichText("Informe a resposta desta pergunta."),
          admin: {
            description:
              "Resposta editorial. Use links somente para canais oficiais ou paginas do portal.",
          },
        },
      ],
    },
  ],
};

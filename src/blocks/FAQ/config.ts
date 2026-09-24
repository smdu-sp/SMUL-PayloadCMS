import type { Block } from "payload";
import { characterLimitAdmin } from "../../fields/character-limit";
import {
  createAppearanceGroup,
  createBlockContrastStatusField,
  createControlledColorAppearanceFields,
  createSchemeField,
} from "../../fields/block-appearance";
import {
  closedSelect,
  requiredRichText,
  requiredText,
} from "../../fields/editorial-validation";
import { createBlockAdmin } from "../shared/admin";

// FAQ themes the outer section; accordion rows keep a safe surface recipe.
const faqColorTokens = ["background", "foreground"] as const;

export const FAQBlock: Block = {
  slug: "faqAccordion",
  interfaceName: "FAQAccordionBlock",
  admin: createBlockAdmin("Conteúdo", {
    slug: "faq",
    alt: "Prévia de perguntas frequentes",
  }),
  labels: {
    singular: "Perguntas frequentes",
    plural: "Perguntas frequentes",
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Titulo da secao",
      required: true,
      maxLength: 100,
      validate: requiredText("Informe o titulo das perguntas frequentes."),
      admin: {
        ...characterLimitAdmin(100),
        description:
          "Titulo exibido antes da lista de perguntas.",
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
    createAppearanceGroup([
      createSchemeField(["default", "surface", "muted", "custom"], "muted"),
      ...createControlledColorAppearanceFields(faqColorTokens),
      createBlockContrastStatusField(faqColorTokens),
    ]),
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
          maxLength: 140,
          validate: requiredText("Informe a pergunta deste item."),
          admin: {
            ...characterLimitAdmin(140),
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

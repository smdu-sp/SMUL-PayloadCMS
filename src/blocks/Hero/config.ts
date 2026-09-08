import type { Block } from "payload";
import { closedSelect, requiredText } from "../../fields/editorial-validation";
import { createLinkFields } from "../../fields/link";
import { createBlockAdmin } from "../shared/admin";

const overlayOptions = [
  { label: "Sem sobreposicao", value: "none" },
  { label: "Clara", value: "light" },
  { label: "Escura", value: "dark" },
];

const focalPointOptions = [
  { label: "Centro", value: "center" },
  { label: "Topo", value: "top" },
  { label: "Base", value: "bottom" },
  { label: "Esquerda", value: "left" },
  { label: "Direita", value: "right" },
];

export const HeroBlock: Block = {
  slug: "hero",
  interfaceName: "HeroBlock",
  admin: createBlockAdmin("Conteúdo"),
  labels: {
    singular: "Destaque principal",
    plural: "Destaques principais",
  },
  fields: [
    {
      name: "eyebrow",
      type: "text",
      label: "Chamada superior",
      admin: {
        description:
          "Texto curto acima do titulo, usado para contextualizar a pagina.",
      },
    },
    {
      name: "title",
      type: "text",
      label: "Titulo principal",
      required: true,
      validate: requiredText("Informe o titulo principal do destaque."),
      admin: {
        description:
          "Mensagem principal da pagina. Pode ser longo, mas prefira uma frase clara.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Resumo",
      admin: {
        description:
          "Texto opcional abaixo do titulo para orientar o usuario antes da acao.",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Imagem",
      admin: {
        condition: (_, siblingData) => siblingData?.variant === "split",
        description:
          "Usada apenas no modelo Imagem lateral. Em telas pequenas, a imagem fica empilhada abaixo do texto.",
      },
    },
    {
      name: "cta",
      type: "group",
      label: "Acao principal",
      admin: {
        description:
          "Link opcional exibido como botao principal da abertura.",
      },
      fields: createLinkFields(),
    },
    {
      name: "background",
      type: "group",
      label: "Imagem de fundo",
      admin: {
        description:
          "Opcional. Use midia cadastrada para compor o fundo do destaque sem alterar o arquivo original.",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Imagem desktop",
          admin: {
            description:
              "Imagem principal do fundo. Se ausente, o destaque usa o visual padrao.",
          },
        },
        {
          name: "mobileImage",
          type: "upload",
          relationTo: "media",
          label: "Imagem mobile",
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.image),
            description:
              "Opcional. Use quando a composicao desktop nao funcionar bem em telas estreitas.",
          },
        },
        {
          name: "overlay",
          type: "select",
          label: "Sobreposicao",
          defaultValue: "dark",
          validate: closedSelect(
            ["none", "light", "dark"],
            "Escolha uma sobreposicao aprovada.",
          ),
          options: overlayOptions,
        },
        {
          name: "focalPoint",
          type: "select",
          label: "Foco visual",
          defaultValue: "center",
          validate: closedSelect(
            ["center", "top", "bottom", "left", "right"],
            "Escolha um foco visual aprovado.",
          ),
          options: focalPointOptions,
        },
      ],
    },
    {
      name: "variant",
      type: "select",
      label: "Modelo de apresentacao",
      required: true,
      defaultValue: "default",
      validate: closedSelect(
        ["default", "centered", "split"],
        "Escolha um modelo de apresentacao aprovado.",
      ),
      admin: {
        description:
          "Padrao alinha o conteudo a esquerda; Centralizado destaca uma mensagem curta; Imagem lateral exibe texto e imagem lado a lado no desktop. Este bloco nao possui contador nem timer automatico.",
      },
      options: [
        { label: "Padrao", value: "default" },
        { label: "Centralizado", value: "centered" },
        { label: "Imagem lateral", value: "split" },
      ],
    },
  ],
};

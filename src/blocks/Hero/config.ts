import type { Block } from "payload";
import { closedSelect, requiredText } from "../../fields/editorial-validation";
import { createImagePresentationFields } from "../../fields/image-presentation";
import { createLinkFields } from "../../fields/link";
import { createBlockAdmin } from "../shared/admin";

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
      name: "imagePresentation",
      type: "group",
      label: "Apresentação da imagem",
      admin: {
        condition: (_, siblingData) => siblingData?.variant === "split",
        description:
          "Define como esta imagem é exibida neste bloco. O arquivo original na Mídia não é alterado.",
      },
      fields: createImagePresentationFields({
        defaultSize: "full",
        defaultAspectRatio: "16:9",
        defaultFit: "cover",
      }),
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

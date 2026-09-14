import type { Block, UploadFieldSingleValidation } from "payload";
import { characterLimitAdmin } from "../../fields/character-limit";
import { createAppearanceGroup } from "../../fields/block-appearance";
import { closedSelect } from "../../fields/editorial-validation";
import { createImagePresentationFields } from "../../fields/image-presentation";
import { createBlockAdmin } from "../shared/admin";

const alignmentOptions = [
  { label: "A esquerda", value: "left" },
  { label: "Centralizada", value: "center" },
  { label: "A direita", value: "right" },
];

export const ImageBlock: Block = {
  slug: "imageBlock",
  dbName: "imgBlk",
  interfaceName: "ImageBlock",
  admin: createBlockAdmin("Mídia"),
  labels: {
    singular: "Imagem",
    plural: "Imagens",
  },
  fields: [
    {
      name: "media",
      type: "upload",
      relationTo: "media",
      label: "Imagem",
      required: true,
      validate: ((value) =>
        value ? true : "Selecione uma imagem da biblioteca de midia.") satisfies UploadFieldSingleValidation,
      admin: {
        description:
          "Imagem exibida como bloco editorial unico. O arquivo original permanece preservado na biblioteca de midia.",
      },
    },
    {
      name: "caption",
      type: "textarea",
      label: "Legenda",
      maxLength: 180,
      admin: {
        ...characterLimitAdmin(180, "textarea"),
        description:
          "Opcional. Use para contextualizar a imagem quando a informacao nao estiver no texto da pagina.",
        rows: 2,
      },
    },
    {
      name: "imagePresentation",
      type: "group",
      label: "Apresentacao da imagem",
      admin: {
        description:
          "Define como esta imagem e exibida neste bloco. O arquivo original na Midia nao e alterado.",
      },
      fields: createImagePresentationFields({
        defaultSize: "large",
        defaultAspectRatio: "original",
        defaultFit: "cover",
        dbNames: {
          aspectRatio: "asp",
          fit: "fit",
          size: "sz",
        },
      }),
    },
    createAppearanceGroup([
      {
        name: "alignment",
        type: "select",
        label: "Alinhamento",
        defaultValue: "center",
        validate: closedSelect(
          ["left", "center", "right"],
          "Escolha um alinhamento aprovado.",
        ),
        admin: {
          description:
            "Controla a posicao horizontal da imagem quando o tamanho escolhido nao ocupa toda a largura.",
        },
        options: alignmentOptions,
      },
    ]),
  ],
};

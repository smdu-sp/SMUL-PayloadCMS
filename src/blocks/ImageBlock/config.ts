import type { Block, UploadFieldSingleValidation } from "payload";
import { characterLimitAdmin } from "../../fields/character-limit";
import { createImagePresentationFields } from "../../fields/image-presentation";
import { createBlockAdmin } from "../shared/admin";

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
        components: {
          afterInput: [
            "/components/admin/ImageEditingCanvas#ImageEditingCanvas",
          ],
        },
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
      label: "Apresentação da imagem",
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
  ],
};

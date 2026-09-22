import type { Block, TextFieldValidation } from "payload";
import { characterLimitAdmin } from "../../fields/character-limit";
import { closedSelect } from "../../fields/editorial-validation";
import { createBlockAdmin } from "../shared/admin";
import { parseVideoEmbedUrl } from "./video-embed";

const providerOptions = [
  { label: "YouTube", value: "youtube" },
  { label: "Vimeo", value: "vimeo" },
];

const aspectRatioOptions = [
  { label: "16:9", value: "16:9" },
  { label: "4:3", value: "4:3" },
  { label: "1:1", value: "1:1" },
];

const validateVideoUrl = ((value) =>
  parseVideoEmbedUrl(value)
    ? true
    : "Informe uma URL valida do YouTube ou Vimeo, sem codigo HTML ou iframe.") satisfies TextFieldValidation;

export const VideoBlock: Block = {
  slug: "videoBlock",
  dbName: "vidBlk",
  interfaceName: "VideoBlock",
  admin: createBlockAdmin("Mídia", {
    slug: "video",
    alt: "Prévia de um vídeo incorporado",
  }),
  labels: {
    singular: "Video incorporado",
    plural: "Videos incorporados",
  },
  fields: [
    {
      name: "url",
      type: "text",
      label: "URL do video",
      required: true,
      validate: validateVideoUrl,
      admin: {
        description:
          "Cole apenas a URL publica do YouTube ou Vimeo. Nao cole iframe, embed code ou HTML.",
      },
    },
    {
      name: "title",
      type: "text",
      label: "Titulo acessivel",
      maxLength: 120,
      admin: {
        ...characterLimitAdmin(120),
        description:
          "Opcional, mas recomendado. Usado como titulo acessivel do player.",
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
          "Opcional. Texto exibido abaixo do video para contextualizar o conteudo.",
        rows: 2,
      },
    },
    {
      name: "provider",
      type: "select",
      label: "Provider",
      required: true,
      validate: closedSelect(
        ["youtube", "vimeo"],
        "Use uma URL de provider aprovado.",
      ),
      hooks: {
        beforeValidate: [
          ({ siblingData }) => parseVideoEmbedUrl(siblingData?.url)?.provider,
        ],
      },
      admin: {
        description:
          "Preenchido automaticamente a partir da URL. O frontend valida novamente antes de renderizar.",
        readOnly: true,
      },
      options: providerOptions,
    },
    {
      name: "aspectRatio",
      type: "select",
      label: "Proporcao",
      required: true,
      defaultValue: "16:9",
      validate: closedSelect(
        ["16:9", "4:3", "1:1"],
        "Escolha uma proporcao de video aprovada.",
      ),
      options: aspectRatioOptions,
    },
  ],
};


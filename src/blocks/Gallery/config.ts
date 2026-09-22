import type { Block, UploadFieldManyValidation, UploadFieldSingleValidation } from "payload";
import { characterLimitAdmin } from "../../fields/character-limit";
import {
  createAppearanceGroup,
  createInteractionField,
  createSpacingField,
} from "../../fields/block-appearance";
import { closedSelect } from "../../fields/editorial-validation";
import { createBlockAdmin } from "../shared/admin";

const columnOptions = [
  { label: "2 colunas", value: "2" },
  { label: "3 colunas", value: "3" },
  { label: "4 colunas", value: "4" },
  { label: "8 colunas", value: "8" },
];

const presetOptions = [{ label: "Grade uniforme", value: "grid" }];

const thumbnailEffectOptions = [
  { label: "Sem efeito", value: "none" },
  { label: "Crescimento suave", value: "grow" },
];

type GalleryImageInput = {
  caption?: string | null;
  media?: unknown;
};

function getMediaId(media: unknown): string | number | null {
  if (typeof media === "number" || typeof media === "string") return media;
  if (media && typeof media === "object" && "id" in media) {
    const id = (media as { id?: unknown }).id;
    return typeof id === "number" || typeof id === "string" ? id : null;
  }
  return null;
}

const validateBulkImages = ((value) =>
  !value || Array.isArray(value)
    ? true
    : "Selecione uma ou mais imagens da biblioteca.") satisfies UploadFieldManyValidation;

export const GalleryBlock: Block = {
  slug: "gallery",
  dbName: "gal",
  interfaceName: "GalleryBlock",
  admin: createBlockAdmin("Mídia", {
    slug: "gallery",
    alt: "Prévia de uma galeria de imagens",
  }),
  labels: {
    singular: "Galeria de imagens",
    plural: "Galerias de imagens",
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Titulo",
      maxLength: 100,
      admin: {
        ...characterLimitAdmin(100),
        description:
          "Opcional. Use quando a galeria precisar de um titulo editorial na pagina.",
      },
    },
    {
      name: "images",
      type: "array",
      dbName: "imgs",
      label: "Imagens",
      required: true,
      minRows: 1,
      maxRows: 24,
      validate: (value) =>
        Array.isArray(value) && value.length > 0
          ? true
          : "Adicione ao menos uma imagem a galeria.",
      admin: {
        description:
          "Adicione imagens da biblioteca de midia. Cada item pode ter legenda propria para o lightbox.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "media",
          type: "upload",
          relationTo: "media",
          label: "Imagem",
          required: true,
          validate: ((value) =>
            value ? true : "Selecione uma imagem para a galeria.") satisfies UploadFieldSingleValidation,
          admin: {
            description:
              "Imagem exibida na galeria e ampliada no lightbox. O arquivo original permanece preservado.",
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
              "Opcional. Texto exibido somente quando a imagem estiver aberta.",
            rows: 2,
          },
        },
      ],
    },
    {
      name: "bulkImages",
      type: "upload",
      relationTo: "media",
      label: "Adicionar varias imagens",
      hasMany: true,
      validate: validateBulkImages,
      hooks: {
        beforeValidate: [
          ({ siblingData, value }) => {
            if (!Array.isArray(value) || !value.length) return undefined;

            const currentImages = Array.isArray(siblingData?.images)
              ? siblingData.images as GalleryImageInput[]
              : [];
            const existingIds = new Set(
              currentImages
                .map((item) => getMediaId(item.media))
                .filter((id): id is string | number => id !== null),
            );
            const newImages = value
              .filter((media) => {
                const id = getMediaId(media);
                if (id === null || existingIds.has(id)) return false;
                existingIds.add(id);
                return true;
              })
              .map((media) => ({ media }));

            siblingData.images = [...currentImages, ...newImages];
            return undefined;
          },
        ],
      },
      admin: {
        description:
          "Selecione varias imagens para adiciona-las ao grid de uma vez. O campo e limpo apos salvar; ajuste legendas no array acima.",
      },
    },
    {
      name: "layout",
      type: "group",
      label: "Layout da galeria",
      admin: {
        description:
          "Controla a composicao responsiva com opcoes fechadas. Masonry nao esta disponivel nesta spec.",
      },
      fields: [
        {
          name: "columns",
          type: "select",
          dbName: "cols",
          label: "Colunas no desktop",
          required: true,
          defaultValue: "4",
          validate: closedSelect(
            ["2", "3", "4", "8"],
            "Escolha uma quantidade de colunas aprovada.",
          ),
          options: columnOptions,
        },
        {
          name: "preset",
          type: "select",
          label: "Modelo",
          required: true,
          defaultValue: "grid",
          validate: closedSelect(
            ["grid"],
            "Escolha um modelo de galeria aprovado.",
          ),
          options: presetOptions,
        },
        {
          name: "thumbnailEffect",
          type: "select",
          dbName: "thumbFx",
          label: "Efeito ao passar o mouse",
          required: true,
          defaultValue: "grow",
          validate: closedSelect(
            ["none", "grow"],
            "Escolha um efeito de miniatura aprovado.",
          ),
          options: thumbnailEffectOptions,
        },
      ],
    },
    createAppearanceGroup([
      createSpacingField(["compact", "default", "spacious"], "default"),
      createInteractionField(["none", "subtle", "default", "emphasized"], "default"),
    ]),
  ],
};

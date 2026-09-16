import type { CollectionConfig } from "payload";
import { adminOnly, adminOrEditor, imageEditingCanvasAdminOnly } from "../access/roles.ts";
import { imageEditingCanvasEndpoint } from "../lib/media/image-editing-canvas-endpoint.ts";

export const allowedMediaMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
] as const;

export const mediaUsageOptions = [
  { label: "Imagem de conteudo", value: "content" },
  { label: "Imagem de fundo", value: "background" },
  { label: "Logo institucional", value: "logo" },
  { label: "Icone", value: "icon" },
  { label: "Infografico", value: "infographic" },
  { label: "Documento", value: "document" },
] as const;

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: adminOrEditor,
    read: () => true,
    update: adminOrEditor,
    delete: adminOnly,
  },
  labels: {
    singular: "Mídia",
    plural: "Mídias",
  },
  admin: {
    defaultColumns: ["alt", "usage", "caption", "updatedAt"],
    description:
      "Cadastre imagens e documentos usados nos blocos, SEO e identidade visual. O texto alternativo e obrigatorio para acessibilidade.",
    useAsTitle: "alt",
    components: {
      edit: {
        beforeDocumentControls: [
          "/components/admin/ImageEditingCanvas#ImageEditingCanvas",
        ],
      },
    },
  },
  endpoints: [imageEditingCanvasEndpoint],
  upload: {
    displayPreview: true,
    focalPoint: true,
    mimeTypes: [...allowedMediaMimeTypes],
  },
  fields: [
    {
      name: "usage",
      type: "select",
      label: "Uso principal",
      required: true,
      defaultValue: "content",
      admin: {
        description:
          "Classifique o papel editorial da midia. SVG nao e aceito; para icones e logos, use PNG ou WebP aprovados.",
      },
      options: [...mediaUsageOptions],
    },
    {
      name: "alt",
      type: "text",
      label: "Texto alternativo",
      required: true,
      admin: {
        description:
          "Descreva objetivamente a imagem para pessoas que usam leitores de tela.",
      },
    },
    {
      name: "caption",
      type: "textarea",
      label: "Legenda",
      admin: {
        description:
          "Opcional. Use quando a imagem precisar de credito, contexto ou complemento editorial.",
      },
    },
    {
      name: "sourceMedia",
      type: "relationship",
      relationTo: "media",
      label: "Mídia original",
      admin: {
        position: "sidebar",
        readOnly: true,
        condition: (_, siblingData) => Boolean(siblingData?.sourceMedia),
        description: "Derivada criada pelo Canvas. O arquivo original permanece preservado.",
      },
    },
    {
      name: "canvasOperations",
      type: "json",
      label: "Operacoes do Canvas",
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
  ],
};


import type { Block } from "payload";
import {
  //Para futuras versões do Payload teremos que atualizar o 'EXPERIMENTAL_TableFeature'
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  LinkFeature,
  TextStateFeature,
  UploadFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import {
  createAppearanceGroup,
  createBlockContrastStatusField,
  createControlledColorAppearanceFields,
  createSchemeField,
  createSpacingField,
  createWidthField,
} from "../../fields/block-appearance";
import { closedSelect, requiredRichText } from "../../fields/editorial-validation";
import { createBlockAdmin } from "../shared/admin";
import { richTextFontSizes } from "./font-size";

// Rich Text paints a surface and derives headings and links from its foreground.
const richTextColorTokens = ["background", "foreground"] as const;

export const RichTextBlock: Block = {
  slug: "richText",
  interfaceName: "RichTextBlock",
  admin: createBlockAdmin("Conteúdo", {
    slug: "rich-text",
    alt: "Prévia de conteúdo editorial em texto",
  }),
  labels: {
    singular: "Texto editorial",
    plural: "Textos editoriais",
  },
  fields: [
    {
      name: "content",
      type: "richText",
      label: "Conteudo",
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures.filter(
            (f) => f.key !== "link" && f.key !== "heading" && f.key !== "upload",
          ),
          HeadingFeature({
            enabledHeadingSizes: ["h1", "h2", "h3", "h4", "h5", "h6"],
          }),
          TextStateFeature({
            state: {
              fontSize: richTextFontSizes,
            },
          }),
          LinkFeature({
            enabledCollections: ["pages"],
          }),
          UploadFeature({
            collections: {
              media: {
                fields: [
                  {
                    name: "caption",
                    type: "text",
                    label: "Legenda",
                  },
                ],
              },
            },
          }),
          FixedToolbarFeature(),
          EXPERIMENTAL_TableFeature(),
        ],
      }),
      validate: requiredRichText("Escreva o conteudo deste bloco."),
      admin: {
        components: {
          beforeInput: [
            "/components/admin/RichTextFullScreen#RichTextFullScreen",
          ],
        },
        description:
          "Area para texto, listas, tabelas, links e subtitulos com barra de ferramentas WYSIWYG. A aparencia final segue a tipografia editorial do portal.",
      },
    },
    {
      name: "variant",
      type: "select",
      label: "Modelo de leitura",
      required: true,
      defaultValue: "default",
      validate: closedSelect(
        ["default", "narrow"],
        "Escolha um modelo de leitura aprovado.",
      ),
      admin: {
        description:
          "Padrao usa largura ampla para conteudos variados. Leitura estreita favorece textos corridos longos.",
      },
      options: [
        { label: "Padrao", value: "default" },
        { label: "Leitura estreita", value: "narrow" },
      ],
    },
    createAppearanceGroup([
      createSchemeField(["default", "surface", "muted", "custom"], "default"),
      createWidthField(["narrow", "default", "wide"], "default"),
      createSpacingField(["compact", "default", "spacious"], "default"),
      ...createControlledColorAppearanceFields(richTextColorTokens),
      createBlockContrastStatusField(richTextColorTokens),
    ]),
  ],
};

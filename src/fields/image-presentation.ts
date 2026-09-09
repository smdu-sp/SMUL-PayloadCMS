import type { Field } from "payload";
import { closedSelect } from "./editorial-validation";

export const imagePresentationSizes = [
  "small",
  "medium",
  "large",
  "full",
] as const;
export type ImagePresentationSize = (typeof imagePresentationSizes)[number];

export const imagePresentationAspectRatios = [
  "original",
  "1:1",
  "4:3",
  "16:9",
  "portrait",
] as const;
export type ImagePresentationAspectRatio =
  (typeof imagePresentationAspectRatios)[number];

export const imagePresentationFits = ["cover", "contain"] as const;
export type ImagePresentationFit = (typeof imagePresentationFits)[number];

export function createImagePresentationFields(options?: {
  aspectRatios?: ImagePresentationAspectRatio[];
  defaultSize?: ImagePresentationSize;
  defaultAspectRatio?: ImagePresentationAspectRatio;
  defaultFit?: ImagePresentationFit;
  dbNames?: {
    aspectRatio?: string;
    fit?: string;
    size?: string;
  };
  sizes?: ImagePresentationSize[];
}): Field[] {
  const sizes = options?.sizes ?? [...imagePresentationSizes];
  const aspectRatios = options?.aspectRatios ?? [...imagePresentationAspectRatios];

  return [
    {
      name: "size",
      type: "select",
      dbName: options?.dbNames?.size,
      label: "Tamanho de exibicao",
      required: true,
      defaultValue: options?.defaultSize ?? "full",
      validate: closedSelect(
        sizes,
        "Escolha um tamanho de exibicao aprovado.",
      ),
      admin: {
        description:
          "Controla a largura da imagem dentro do espaco do bloco. Em celulares, a imagem sempre ocupa a largura total.",
      },
      options: [
        { label: "Pequeno", value: "small" },
        { label: "Medio", value: "medium" },
        { label: "Grande", value: "large" },
        { label: "Largura total", value: "full" },
      ].filter((option) => sizes.includes(option.value as ImagePresentationSize)),
    },
    {
      name: "aspectRatio",
      type: "select",
      dbName: options?.dbNames?.aspectRatio,
      label: "Proporcao",
      required: true,
      defaultValue: options?.defaultAspectRatio ?? "16:9",
      validate: closedSelect(
        aspectRatios,
        "Escolha uma proporcao aprovada.",
      ),
      admin: {
        description:
          "Original preserva as proporcoes do arquivo enviado. As demais opcoes recortam a imagem para a proporcao escolhida.",
      },
      options: [
        { label: "Original", value: "original" },
        { label: "Quadrada (1:1)", value: "1:1" },
        { label: "Padrao (4:3)", value: "4:3" },
        { label: "Widescreen (16:9)", value: "16:9" },
        { label: "Retrato", value: "portrait" },
      ].filter((option) =>
        aspectRatios.includes(option.value as ImagePresentationAspectRatio),
      ),
    },
    {
      name: "fit",
      type: "select",
      dbName: options?.dbNames?.fit,
      label: "Ajuste dentro da proporcao",
      defaultValue: options?.defaultFit ?? "cover",
      validate: closedSelect(
        [...imagePresentationFits],
        "Escolha um ajuste aprovado.",
      ),
      admin: {
        condition: (_, siblingData) => siblingData?.aspectRatio !== "original",
        description:
          "Preencher recorta a imagem para cobrir o espaco; Conter mostra a imagem inteira, podendo sobrar espaco vazio. Usa o ponto focal definido na Midia quando disponivel.",
      },
      options: [
        { label: "Preencher (recorta)", value: "cover" },
        { label: "Conter (sem recorte)", value: "contain" },
      ],
    },
  ];
}

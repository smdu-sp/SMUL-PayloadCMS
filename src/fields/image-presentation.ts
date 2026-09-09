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
  defaultSize?: ImagePresentationSize;
  defaultAspectRatio?: ImagePresentationAspectRatio;
  defaultFit?: ImagePresentationFit;
}): Field[] {
  return [
    {
      name: "size",
      type: "select",
      label: "Tamanho de exibição",
      required: true,
      defaultValue: options?.defaultSize ?? "full",
      validate: closedSelect(
        [...imagePresentationSizes],
        "Escolha um tamanho de exibição aprovado.",
      ),
      admin: {
        description:
          "Controla a largura da imagem dentro do espaço do bloco. Em celulares, a imagem sempre ocupa a largura total.",
      },
      options: [
        { label: "Pequeno", value: "small" },
        { label: "Médio", value: "medium" },
        { label: "Grande", value: "large" },
        { label: "Largura total", value: "full" },
      ],
    },
    {
      name: "aspectRatio",
      type: "select",
      label: "Proporção",
      required: true,
      defaultValue: options?.defaultAspectRatio ?? "16:9",
      validate: closedSelect(
        [...imagePresentationAspectRatios],
        "Escolha uma proporção aprovada.",
      ),
      admin: {
        description:
          "Original preserva as proporções do arquivo enviado. As demais opções recortam a imagem para a proporção escolhida.",
      },
      options: [
        { label: "Original", value: "original" },
        { label: "Quadrada (1:1)", value: "1:1" },
        { label: "Padrão (4:3)", value: "4:3" },
        { label: "Widescreen (16:9)", value: "16:9" },
        { label: "Retrato", value: "portrait" },
      ],
    },
    {
      name: "fit",
      type: "select",
      label: "Ajuste dentro da proporção",
      defaultValue: options?.defaultFit ?? "cover",
      validate: closedSelect(
        [...imagePresentationFits],
        "Escolha um ajuste aprovado.",
      ),
      admin: {
        condition: (_, siblingData) => siblingData?.aspectRatio !== "original",
        description:
          "Preencher recorta a imagem para cobrir o espaço; Conter mostra a imagem inteira, podendo sobrar espaço vazio. Usa o ponto focal definido na Mídia quando disponível.",
      },
      options: [
        { label: "Preencher (recorta)", value: "cover" },
        { label: "Conter (sem recorte)", value: "contain" },
      ],
    },
  ];
}

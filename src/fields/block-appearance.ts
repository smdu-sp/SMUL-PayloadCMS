import type { Field, GroupField } from "payload";
import { closedSelect } from "./editorial-validation";

export const toneOptions = [
  { label: "Padrao", value: "default" },
  { label: "Superficie branca", value: "surface" },
  { label: "Suave / Neutro", value: "muted" },
  { label: "Institucional (Brand)", value: "brand" },
  { label: "Institucional principal (Azul)", value: "primary" },
  { label: "Institucional escuro", value: "secondary" },
  { label: "Destaque (Turquesa SMUL)", value: "accent" },
] as const;

export const spacingOptions = [
  { label: "Compacto", value: "compact" },
  { label: "Padrao", value: "default" },
  { label: "Espacoso", value: "spacious" },
] as const;

export const widthOptions = [
  { label: "Estreito", value: "narrow" },
  { label: "Padrao", value: "default" },
  { label: "Amplo", value: "wide" },
  { label: "Largura total", value: "full" },
] as const;

export const alignmentOptions = [
  { label: "A esquerda", value: "left" },
  { label: "Centralizado", value: "center" },
] as const;

export type BlockTone = (typeof toneOptions)[number]["value"];
export type BlockSpacing = (typeof spacingOptions)[number]["value"];
export type BlockWidth = (typeof widthOptions)[number]["value"];
export type BlockAlignment = (typeof alignmentOptions)[number]["value"];

export function createToneField(
  allowedTones: readonly BlockTone[] = [
    "default",
    "surface",
    "muted",
    "primary",
    "secondary",
    "accent",
  ],
  defaultValue: BlockTone = "default",
): Field {
  const filtered = toneOptions.filter((opt) =>
    allowedTones.includes(opt.value),
  );

  return {
    name: "tone",
    type: "select",
    label: "Tom visual",
    defaultValue,
    validate: closedSelect(
      allowedTones,
      "Escolha um tom visual aprovado pelo Design System.",
    ),
    admin: {
      description:
        "Define a cor de fundo e a enfase visual do bloco respeitando as diretrizes da SMUL.",
    },
    options: filtered.map((o) => ({ label: o.label, value: o.value })),
  };
}

export function createSpacingField(
  allowedSpacings: readonly BlockSpacing[] = ["compact", "default", "spacious"],
  defaultValue: BlockSpacing = "default",
): Field {
  const filtered = spacingOptions.filter((opt) =>
    allowedSpacings.includes(opt.value),
  );

  return {
    name: "spacing",
    type: "select",
    label: "Espacamento vertical",
    defaultValue,
    validate: closedSelect(
      allowedSpacings,
      "Escolha um espacamento aprovado pelo Design System.",
    ),
    admin: {
      description:
        "Controla a distancia vertical do bloco em relacao aos blocos adjacentes.",
    },
    options: filtered.map((o) => ({ label: o.label, value: o.value })),
  };
}

export function createWidthField(
  allowedWidths: readonly BlockWidth[] = ["narrow", "default", "wide", "full"],
  defaultValue: BlockWidth = "default",
): Field {
  const filtered = widthOptions.filter((opt) =>
    allowedWidths.includes(opt.value),
  );

  return {
    name: "width",
    type: "select",
    label: "Largura do conteudo",
    defaultValue,
    validate: closedSelect(
      allowedWidths,
      "Escolha uma largura aprovada pelo Design System.",
    ),
    admin: {
      description:
        "Define o limite de largura maxima para acomodar leitura ou visao panoramica.",
    },
    options: filtered.map((o) => ({ label: o.label, value: o.value })),
  };
}

export function createAlignmentField(
  allowedAlignments: readonly BlockAlignment[] = ["left", "center"],
  defaultValue: BlockAlignment = "left",
): Field {
  const filtered = alignmentOptions.filter((opt) =>
    allowedAlignments.includes(opt.value),
  );

  return {
    name: "alignment",
    type: "select",
    label: "Alinhamento do conteudo",
    defaultValue,
    validate: closedSelect(
      allowedAlignments,
      "Escolha um alinhamento aprovado pelo Design System.",
    ),
    admin: {
      description:
        "Controla se os elementos de texto e botoes ficam alinhados a esquerda ou centralizados.",
    },
    options: filtered.map((o) => ({ label: o.label, value: o.value })),
  };
}

export function createAppearanceGroup(fields: Field[]): GroupField {
  return {
    name: "appearance",
    type: "group",
    label: "Aparencia e estilo",
    admin: {
      description:
        "Opcoes semanticas de apresentacao controladas pelo Design System. Nao permite CSS arbitrario.",
    },
    fields,
  };
}

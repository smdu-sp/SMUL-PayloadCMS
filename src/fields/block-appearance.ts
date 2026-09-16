import type { Field, GroupField } from "payload";
import { hasMinimumContrast, isHexColor, normalizeHexColor } from "../lib/theme/colors";
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

export type ControlledColorPreset =
  | "accent"
  | "default"
  | "primary"
  | "secondary"
  | "surface";
export type ControlledColorType = "custom" | "preset";

export type ControlledColorValue = {
  customColor?: string | null;
  preset?: ControlledColorPreset | null;
  type?: ControlledColorType | string | null;
};

export type ControlledBlockColors = {
  accent?: ControlledColorValue | null;
  background?: ControlledColorValue | null;
  foreground?: ControlledColorValue | null;
};

const colorPresetOptions = [
  { label: "Default", value: "default" },
  { label: "Surface", value: "surface" },
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Accent", value: "accent" },
] as const;

const colorPresetHex: Record<ControlledColorPreset, string> = {
  accent: "#5cd6c9",
  default: "#ffffff",
  primary: "#0a3299",
  secondary: "#0a3299",
  surface: "#ffffff",
};

const colorPresetCssVariables: Record<ControlledColorPreset, string> = {
  accent: "var(--color-accent)",
  default: "var(--color-background)",
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  surface: "var(--color-surface)",
};

function colorFieldLabel(name: "accent" | "background" | "foreground"): string {
  if (name === "background") return "Background";
  if (name === "foreground") return "Foreground";
  return "Accent";
}

function resolveControlledColor(value: ControlledColorValue | null | undefined): string | null {
  if (!value) return null;
  if (value.type === "custom") return normalizeHexColor(value.customColor);
  if (value.preset && value.preset in colorPresetHex) {
    return colorPresetHex[value.preset as ControlledColorPreset];
  }
  return null;
}

export function resolveControlledColorCssValue(
  value: ControlledColorValue | null | undefined,
): string | null {
  if (!value) return null;
  if (value.type === "custom") return normalizeHexColor(value.customColor);
  if (value.preset && value.preset in colorPresetCssVariables) {
    return colorPresetCssVariables[value.preset as ControlledColorPreset];
  }
  return null;
}

export function validateControlledBlockColors(
  colors: ControlledBlockColors | null | undefined,
): true | string {
  const background = resolveControlledColor(colors?.background);
  const foreground = resolveControlledColor(colors?.foreground);
  const accent = resolveControlledColor(colors?.accent);

  if (colors?.background?.type === "custom" && !background) {
    return "Informe uma cor hexadecimal valida para o background.";
  }

  if (colors?.foreground?.type === "custom" && !foreground) {
    return "Informe uma cor hexadecimal valida para o foreground.";
  }

  if (colors?.accent?.type === "custom" && !accent) {
    return "Informe uma cor hexadecimal valida para o accent.";
  }

  if (background && foreground && !hasMinimumContrast(foreground, background)) {
    return "Foreground e background precisam atingir contraste minimo WCAG AA.";
  }

  if (background && accent && !hasMinimumContrast(accent, background)) {
    return "Accent e background precisam atingir contraste minimo WCAG AA.";
  }

  return true;
}

export function createControlledColorField(
  name: "accent" | "background" | "foreground",
  defaultPreset: ControlledColorPreset,
): GroupField {
  const label = colorFieldLabel(name);

  return {
    name,
    type: "group",
    label,
    fields: [
      {
        name: "type",
        type: "select",
        label: `${label}: origem`,
        defaultValue: "preset",
        validate: closedSelect(
          ["preset", "custom"],
          `Escolha a origem aprovada para ${label}.`,
        ),
        options: [
          { label: "Preset", value: "preset" },
          { label: "Custom", value: "custom" },
        ],
      },
      {
        name: "preset",
        type: "select",
        label: `${label}: preset`,
        defaultValue: defaultPreset,
        validate: (value: unknown, { siblingData }: { siblingData?: Record<string, unknown> }) => {
          if (siblingData?.type === "custom") return true;
          return typeof value === "string" &&
            colorPresetOptions.some((option) => option.value === value)
            ? true
            : `Escolha um preset aprovado para ${label}.`;
        },
        admin: {
          condition: (_, siblingData) => siblingData?.type !== "custom",
        },
        options: colorPresetOptions.map((option) => ({
          label: option.label,
          value: option.value,
        })),
      },
      {
        name: "customColor",
        type: "text",
        label: `${label}: cor customizada`,
        validate: (value: unknown, { siblingData }: { siblingData?: Record<string, unknown> }) => {
          if (siblingData?.type !== "custom") return true;
          return isHexColor(value)
            ? true
            : `Informe uma cor hexadecimal valida para ${label}, como #0a3299.`;
        },
        admin: {
          condition: (_, siblingData) => siblingData?.type === "custom",
          description:
            "Use hexadecimal curto ou longo. O contraste e validado antes de salvar.",
        },
      },
    ],
  };
}

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
    validate: (value) => validateControlledBlockColors(value as ControlledBlockColors),
    admin: {
      description:
        "Opcoes semanticas de apresentacao controladas pelo Design System. Nao permite CSS arbitrario.",
    },
    fields,
  };
}

export function createControlledColorAppearanceFields(): Field[] {
  return [
    createControlledColorField("background", "default"),
    createControlledColorField("foreground", "primary"),
    createControlledColorField("accent", "primary"),
  ];
}

import type { Field, GroupField } from "payload";
import { validateOptionalHexColor } from "../lib/theme/colors";
import { colorSchemes, normalizeColorScheme, validateColorOverrides, type ColorScheme, type EditorialColorOverrides } from "../lib/theme/block-color-theme";
import { resolveSemanticTheme, type GlobalSemanticTheme } from "../lib/theme/semantic-theme";
import { closedSelect } from "./editorial-validation";

export const schemeOptions = [
  { label: "Padrao", value: "default" },
  { label: "Superficie neutra", value: "surface" },
  { label: "Suave", value: "muted" },
  { label: "Institucional", value: "brand" },
  { label: "Destaque", value: "accent" },
  { label: "Invertido", value: "inverse" },
] as const;
export const spacingOptions = [
  { label: "Compacto", value: "compact" }, { label: "Padrao", value: "default" }, { label: "Espacoso", value: "spacious" },
] as const;
export const widthOptions = [
  { label: "Estreito", value: "narrow" }, { label: "Padrao", value: "default" },
  { label: "Amplo", value: "wide" }, { label: "Largura total", value: "full" },
] as const;
export const alignmentOptions = [
  { label: "A esquerda", value: "left" }, { label: "Centralizado", value: "center" },
] as const;
export type BlockSpacing = (typeof spacingOptions)[number]["value"];
export type BlockWidth = (typeof widthOptions)[number]["value"];
export type BlockAlignment = (typeof alignmentOptions)[number]["value"];

export function createSchemeField(allowed: readonly ColorScheme[] = colorSchemes, defaultValue: ColorScheme = "default"): Field {
  return {
    name: "scheme", type: "select", label: "Esquema de cores", defaultValue,
    validate: closedSelect(allowed, "Escolha um esquema aprovado pelo Design System."),
    options: schemeOptions.filter(option => allowed.includes(option.value)).map(option => ({ ...option })),
    admin: { description: "Seleciona uma combinacao completa de fundo, texto, acao e destaque." },
  };
}

export function validateControlledBlockColors(
  appearance: { scheme?: string | null; colors?: EditorialColorOverrides | null } | null | undefined,
  theme: GlobalSemanticTheme = resolveSemanticTheme(),
): true | string {
  return validateColorOverrides(theme, normalizeColorScheme(appearance?.scheme), appearance?.colors);
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
    name: "appearance", type: "group", label: "Aparencia e estilo",
    validate: async (value, { req }) => {
      const appearance = value as { scheme?: string | null; colors?: EditorialColorOverrides | null } | null;
      if (!appearance?.colors || !Object.values(appearance.colors).some(Boolean)) return true;
      // Validate against the same global values used by the renderer, not fixed preset hexes.
      const settings = await req.payload.findGlobal({ slug: "site-settings", depth: 0, req });
      return validateControlledBlockColors(appearance, resolveSemanticTheme(settings.theme?.colors));
    },
    admin: { description: "Opcoes semanticas controladas pelo Design System. Nao permite CSS arbitrario." },
    fields,
  };
}

export function createControlledColorAppearanceFields(): Field[] {
  return [{
    name: "colors", type: "group", label: "Overrides semanticos (opcional)",
    admin: { description: "Deixe vazio para usar o esquema. O contraste considera o tema atual. Nao configura elementos individuais." },
    fields: [
      { name: "background", label: "Fundo" },
      { name: "foreground", label: "Texto" },
      { name: "accent", label: "Destaque" },
    ].map(({ name, label }) => ({ name, label, type: "text" as const, validate: validateOptionalHexColor })),
  }];
}

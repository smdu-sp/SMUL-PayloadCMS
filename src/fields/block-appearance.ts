import type { Field, GroupField } from "payload";
import { validateOptionalHexColor } from "../lib/theme/colors";
import { colorSchemes, normalizeColorScheme, validateColorOverrides, type ColorScheme, type EditorialColorOverrides } from "../lib/theme/block-color-theme";
import { resolveSemanticTheme, type GlobalSemanticTheme } from "../lib/theme/semantic-theme";
import { closedSelect } from "./editorial-validation";

type BlockSchemeOption = ColorScheme | "custom";

export const interactionOptions = [
  { label: "Sem interacao", value: "none" },
  { label: "Sutil", value: "subtle" },
  { label: "Padrao", value: "default" },
  { label: "Enfatizada", value: "emphasized" },
] as const;
export const emphasisOptions = [
  { label: "Sutil", value: "subtle" },
  { label: "Padrao", value: "default" },
  { label: "Forte", value: "strong" },
] as const;
export const schemeOptions = [
  { label: "Padrao", value: "default" },
  { label: "Superficie neutra", value: "surface" },
  { label: "Suave", value: "muted" },
  { label: "Institucional", value: "brand" },
  { label: "Destaque", value: "accent" },
  { label: "Invertido", value: "inverse" },
  { label: "Tema customizado", value: "custom" },
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
export type BlockInteraction = (typeof interactionOptions)[number]["value"];
export type BlockEmphasis = (typeof emphasisOptions)[number]["value"];

export function createSchemeField(
  allowed: readonly BlockSchemeOption[] = colorSchemes,
  defaultValue: BlockSchemeOption = "default",
): Field {
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

export function createInteractionField(
  allowedInteractions: readonly BlockInteraction[] = ["none", "subtle", "default", "emphasized"],
  defaultValue: BlockInteraction = "default",
): Field {
  const filtered = interactionOptions.filter((opt) =>
    allowedInteractions.includes(opt.value),
  );

  return {
    name: "interaction",
    type: "select",
    label: "Interacao",
    defaultValue,
    validate: closedSelect(
      allowedInteractions,
      "Escolha uma interacao aprovada pelo Design System.",
    ),
    admin: {
      description:
        "Define feedback de hover, foco e movimento por presets controlados. Nao expõe CSS.",
    },
    options: filtered.map((o) => ({ label: o.label, value: o.value })),
  };
}

export function createEmphasisField(
  allowedEmphasis: readonly BlockEmphasis[] = ["subtle", "default", "strong"],
  defaultValue: BlockEmphasis = "default",
): Field {
  const filtered = emphasisOptions.filter((opt) =>
    allowedEmphasis.includes(opt.value),
  );

  return {
    name: "emphasis",
    type: "select",
    label: "Enfase",
    defaultValue,
    validate: closedSelect(
      allowedEmphasis,
      "Escolha uma enfase aprovada pelo Design System.",
    ),
    admin: {
      description:
        "Controla intensidade visual dentro dos limites do Design System.",
    },
    options: filtered.map((o) => ({ label: o.label, value: o.value })),
  };
}

export function createAppearanceGroup(fields: Field[]): GroupField {
  return {
    name: "appearance", type: "group", label: "Aparencia e estilo",
    validate: async (value, { req }) => {
      const appearance = value as { scheme?: string | null; colors?: EditorialColorOverrides | null } | null;
      if (
        appearance?.scheme !== "custom" ||
        !appearance.colors ||
        !Object.values(appearance.colors).some(Boolean)
      ) return true;
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
    name: "colors", type: "group", label: "Paleta customizada",
    admin: {
      condition: (_data, siblingData) => siblingData?.scheme === "custom",
      description: "Deixe um campo vazio para herdar o token global. O contraste considera a paleta efetiva. Nao configura elementos individuais.",
    },
    fields: [
      { name: "background", label: "Fundo principal (Background)" },
      { name: "foreground", label: "Texto principal (Foreground)" },
      { name: "brand", label: "Identidade Institucional (Brand)" },
      { name: "action", label: "Acao e Interatividade (Action)" },
      { name: "accent", label: "Detalhes de Apoio (Accent)" },
    ].map(({ name, label }) => ({ name, label, type: "text" as const, validate: validateOptionalHexColor })),
  }];
}

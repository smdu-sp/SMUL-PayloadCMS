export const STANDARD_ICONS = [
  "info",
  "warning",
  "document",
  "building",
  "location",
  "phone",
  "email",
  "check",
  "arrow",
  "external-link",
] as const;

export type StandardIconName = (typeof STANDARD_ICONS)[number];

export const STANDARD_ICON_LABELS: Record<StandardIconName, string> = {
  info: "Informação",
  warning: "Atenção",
  document: "Documento",
  building: "Edificação / Imóvel",
  location: "Localização",
  phone: "Telefone",
  email: "E-mail",
  check: "Confirmação / Check",
  arrow: "Seta",
  "external-link": "Link externo",
};

export const STANDARD_ICON_OPTIONS = STANDARD_ICONS.map((name) => ({
  label: STANDARD_ICON_LABELS[name],
  value: name,
}));

const standardIconSet = new Set<string>(STANDARD_ICONS);

export function isStandardIcon(value: unknown): value is StandardIconName {
  return typeof value === "string" && standardIconSet.has(value);
}

export function normalizeStandardIcon(
  value: unknown,
  fallback: StandardIconName = "info",
): StandardIconName {
  return isStandardIcon(value) ? value : fallback;
}

export function validateStandardIcon(value: unknown): true | string {
  if (isStandardIcon(value)) {
    return true;
  }
  return "Selecione um ícone padrão válido do catálogo.";
}

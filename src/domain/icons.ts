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
  "home",
  "users",
  "image",
  "panel-top",
  "panel-bottom",
  "settings",
  "history",
  "shapes",
  "log-out",
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
  home: "Início",
  users: "Usuários",
  image: "Imagem / Mídia",
  "panel-top": "Cabeçalho",
  "panel-bottom": "Rodapé",
  settings: "Configurações",
  history: "Histórico / Auditoria",
  shapes: "Ícones / Elementos visuais",
  "log-out": "Sair",
};

export const STANDARD_ICON_OPTIONS = STANDARD_ICONS.map((name) => ({
  label: STANDARD_ICON_LABELS[name],
  value: name,
}));

export const SOCIAL_ICONS = [
  "instagram",
  "facebook",
  "youtube",
  "linkedin",
  "x-social",
  "whatsapp",
] as const;

export type SocialIconName = (typeof SOCIAL_ICONS)[number];

export const SOCIAL_ICON_LABELS: Record<SocialIconName, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  "x-social": "X (antigo Twitter)",
  whatsapp: "WhatsApp",
};

export const SOCIAL_ICON_OPTIONS = SOCIAL_ICONS.map((name) => ({
  label: SOCIAL_ICON_LABELS[name],
  value: name,
}));

const standardIconSet = new Set<string>(STANDARD_ICONS);
const socialIconSet = new Set<string>(SOCIAL_ICONS);

export function isStandardIcon(value: unknown): value is StandardIconName {
  return typeof value === "string" && standardIconSet.has(value);
}

export function isSocialIcon(value: unknown): value is SocialIconName {
  return typeof value === "string" && socialIconSet.has(value);
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

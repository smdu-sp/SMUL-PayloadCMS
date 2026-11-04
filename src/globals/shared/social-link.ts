import type { Field, TextFieldValidation } from "payload";
import { isSocialIcon, SOCIAL_ICON_OPTIONS } from "../../domain/icons.ts";
import { validateOfficialHttpsUrl } from "../../domain/official-url.ts";

export const createSocialLinkFields = (): Field[] => [
  {
    name: "label",
    type: "text",
    label: "Nome da rede",
    validate: ((value, { siblingData }) =>
      (typeof value === "string" && value.trim()) ||
      isSocialIcon((siblingData as { icon?: unknown })?.icon)
        ? true
        : "Informe o nome da rede ou selecione um icone valido.") satisfies TextFieldValidation,
    admin: {
      description:
        "Opcional quando um icone for selecionado. Se informado, aparece ao lado do icone.",
    },
  },
  {
    name: "icon",
    type: "select",
    label: "Ícone",
    options: SOCIAL_ICON_OPTIONS,
    admin: {
      description:
        "Opcional quando ha nome. Sem nome, o icone vira o link e recebe nome acessivel.",
    },
  },
  {
    name: "url",
    type: "text",
    label: "URL oficial",
    required: true,
    admin: {
      description:
        "Endereco completo do perfil oficial, incluindo https://.",
    },
    validate: validateOfficialHttpsUrl satisfies TextFieldValidation,
  },
];

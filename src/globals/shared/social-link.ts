import type { Field, TextFieldValidation } from "payload";
import { SOCIAL_ICON_OPTIONS } from "../../domain/icons.ts";
import { validateOfficialHttpsUrl } from "../../domain/official-url.ts";

export const createSocialLinkFields = (): Field[] => [
  {
    name: "label",
    type: "text",
    label: "Nome da rede",
    required: true,
    admin: {
      description:
        "Nome curto exibido para identificar o canal oficial, como Instagram ou YouTube.",
    },
  },
  {
    name: "icon",
    type: "select",
    label: "Ícone",
    options: SOCIAL_ICON_OPTIONS,
    admin: {
      description:
        "Opcional. Selecione o ícone da rede; o nome visível continua sendo obrigatório para acessibilidade.",
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

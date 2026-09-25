import type { Field, TextFieldValidation } from "payload";
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

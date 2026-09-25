import type { GlobalConfig } from "payload";
import { adminOrEditor } from "../access/roles.ts";
import { validateOfficialHttpsUrl } from "../domain/official-url.ts";
import { revalidateSiteShellGlobal } from "../lib/payload/revalidate-site-shell.ts";
import { createSocialLinkFields } from "./shared/social-link.ts";

export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
    update: adminOrEditor,
  },
  label: "Rodapé",
  admin: {
    description:
      "Configure informacoes institucionais e links exibidos no rodape do portal.",
  },
  hooks: {
    afterChange: [revalidateSiteShellGlobal],
  },
  fields: [
    {
      name: "phone",
      type: "text",
      label: "Telefone",
      admin: {
        description:
          "Opcional. Informe somente se houver canal oficial vigente para atendimento.",
      },
    },
    {
      name: "email",
      type: "email",
      label: "E-mail",
      admin: {
        description:
          "Opcional. Informe somente endereco institucional monitorado.",
      },
    },
    {
      name: "address",
      type: "textarea",
      label: "Endereco fisico",
      admin: {
        description:
          "Opcional. Informe endereco institucional vigente somente quando confirmado pelos canais oficiais.",
      },
    },
    {
      name: "inPersonService",
      type: "textarea",
      label: "Atendimento presencial",
      admin: {
        description:
          "Texto livre para orientar sobre atendimento presencial ou informar que deve ser consultado nos canais oficiais.",
      },
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Redes sociais",
      admin: {
        description:
          "Perfis oficiais exibidos no rodape. Mantenha somente canais institucionais ativos.",
        initCollapsed: true,
      },
      fields: createSocialLinkFields(),
    },
    {
      name: "institutionalLinks",
      type: "array",
      label: "Links institucionais",
      admin: {
        description:
          "Links para servicos e paginas oficiais relacionados ao portal.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "label",
          type: "text",
          label: "Texto do link",
          required: true,
          admin: {
            description: "Texto curto exibido no rodape.",
          },
        },
        {
          name: "url",
          type: "text",
          label: "URL",
          required: true,
          validate: validateOfficialHttpsUrl,
          admin: {
            description:
              "Endereco completo do servico ou pagina oficial, incluindo https://.",
          },
        },
      ],
    },
  ],
};


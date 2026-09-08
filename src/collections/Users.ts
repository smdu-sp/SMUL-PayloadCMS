import type { CollectionConfig } from "payload";
import { adminFieldOnly, adminOnly, roleOptions } from "../access/roles.ts";
import { ldapAuthStrategy } from "../lib/ldap/auth-strategy.ts";
import { ldapLoginEndpoint } from "../lib/ldap/login-endpoint.ts";
import { syncLdapUserFields } from "../lib/ldap/sync-user-hook.ts";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    disableLocalStrategy: true,
    useSessions: false,
    strategies: [ldapAuthStrategy],
  },
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: "email",
  },
  endpoints: [ldapLoginEndpoint],
  hooks: {
    beforeValidate: [syncLdapUserFields],
  },
  fields: [
    {
      name: "login",
      type: "text",
      label: "Login (usuario de rede SMUL)",
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          "Login usado para autenticacao. Nome, e-mail e telefone sao preenchidos automaticamente a partir do diretorio da SMUL.",
      },
    },
    {
      name: "email",
      type: "text",
      label: "E-mail",
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "nome",
      type: "text",
      label: "Nome",
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "telefone",
      type: "text",
      label: "Telefone",
      admin: {
        readOnly: true,
      },
    },
    {
      name: "role",
      type: "select",
      label: "Perfil de acesso",
      defaultValue: "admin",
      access: {
        create: adminFieldOnly,
        update: adminFieldOnly,
      },
      admin: {
        description:
          "Controla o acesso editorial no CMS. Apenas administradores podem alterar perfis.",
        position: "sidebar",
      },
      options: [...roleOptions],
    },
  ],
};

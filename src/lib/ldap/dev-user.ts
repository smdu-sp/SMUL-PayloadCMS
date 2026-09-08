import type { LdapUsuario } from "./types.ts";

type Environment = Record<string, string | undefined>;

export function getLdapDevUser(env: Environment = process.env): {
  profile: LdapUsuario;
  password: string;
} | null {
  const mode = env.LDAP_AUTH_MODE || "external";
  if (mode === "external") return null;
  if (mode !== "mock") {
    throw new Error("LDAP_AUTH_MODE deve ser external ou mock.");
  }
  if (env.NODE_ENV !== "development") {
    throw new Error("LDAP_AUTH_MODE=mock permitido somente em development.");
  }

  const login = env.LDAP_DEV_LOGIN?.trim();
  const password = env.LDAP_DEV_PASSWORD;
  if (!login || !password?.trim()) {
    throw new Error("Configure LDAP_DEV_LOGIN e LDAP_DEV_PASSWORD para o modo mock.");
  }

  return {
    profile: {
      login,
      email: "dev.admin@example.test",
      nome: "Administrador local de desenvolvimento",
    },
    password,
  };
}

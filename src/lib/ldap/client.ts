import type { LdapUsuario } from "./types.ts";
import { getLdapDevUser } from "./dev-user.ts";

function getBaseUrl(): string {
  const baseUrl = process.env.LDAP_API_URL;
  if (!baseUrl) {
    throw new Error(
      "LDAP_API_URL nao configurada. Defina a URL base do servico LDAP da SMUL.",
    );
  }
  return baseUrl.replace(/\/+$/, "");
}

export async function buscarUsuarioLdapPorLogin(
  login: string,
): Promise<LdapUsuario | null> {
  const devUser = getLdapDevUser();
  if (devUser) {
    return login === devUser.profile.login ? devUser.profile : null;
  }

  const response = await fetch(
    `${getBaseUrl()}/auth/ldap/buscar-por-login/${encodeURIComponent(login)}`,
    { method: "GET" },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Falha ao consultar o servico LDAP da SMUL.");
  }

  return (await response.json()) as LdapUsuario;
}

export async function autenticarLdap(
  login: string,
  senha: string,
): Promise<boolean> {
  const devUser = getLdapDevUser();
  if (devUser) {
    return login === devUser.profile.login && senha === devUser.password;
  }

  const response = await fetch(`${getBaseUrl()}/auth/ldap/autenticar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, senha }),
  });

  if (response.status === 401) {
    return false;
  }

  if (!response.ok) {
    throw new Error("Falha ao autenticar no servico LDAP da SMUL.");
  }

  return true;
}

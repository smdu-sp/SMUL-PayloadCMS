import { normalizeRole, type UserRole } from "./roles.ts";

export type BackfillUser = {
  email?: unknown;
  id: number | string;
  login?: unknown;
  role?: unknown;
};

export type RoleBackfillUpdate = {
  id: number | string;
  role: UserRole;
};

function identifiersFor(user: BackfillUser): string[] {
  const identifiers = [`id:${String(user.id)}`];

  if (typeof user.login === "string" && user.login.trim()) {
    identifiers.push(`login:${user.login.trim()}`);
  }

  if (typeof user.email === "string" && user.email.trim()) {
    identifiers.push(`email:${user.email.trim().toLowerCase()}`);
  }

  return identifiers;
}

function parseRoleMapping(serializedMapping: string | undefined): Map<string, UserRole> {
  if (!serializedMapping) {
    throw new Error(
      "CMS_USER_ROLE_BACKFILL e obrigatoria quando existem usuarios sem role valida.",
    );
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(serializedMapping);
  } catch {
    throw new Error("CMS_USER_ROLE_BACKFILL deve conter um objeto JSON valido.");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("CMS_USER_ROLE_BACKFILL deve conter um objeto JSON.");
  }

  const mapping = new Map<string, UserRole>();

  for (const [identifier, value] of Object.entries(parsed)) {
    const role = normalizeRole(value);

    if (!role) {
      throw new Error(
        `Role invalida no mapeamento de backfill para "${identifier}".`,
      );
    }

    mapping.set(identifier, role);
  }

  return mapping;
}

export function createRoleBackfillPlan(
  users: readonly BackfillUser[],
  serializedMapping: string | undefined,
): RoleBackfillUpdate[] {
  const usersWithoutValidRole = users.filter((user) => !normalizeRole(user.role));

  if (usersWithoutValidRole.length === 0) {
    return [];
  }

  const mapping = parseRoleMapping(serializedMapping);
  const usedIdentifiers = new Set<string>();
  const updates = usersWithoutValidRole.map((user) => {
    const matches = identifiersFor(user)
      .filter((identifier) => mapping.has(identifier))
      .map((identifier) => ({ identifier, role: mapping.get(identifier)! }));
    const roles = new Set(matches.map(({ role }) => role));

    if (matches.length === 0) {
      throw new Error(
        `Usuario ${String(user.id)} sem role valida e sem mapeamento explicito.`,
      );
    }

    if (roles.size !== 1) {
      throw new Error(
        `Mapeamentos conflitantes encontrados para o usuario ${String(user.id)}.`,
      );
    }

    for (const { identifier } of matches) {
      usedIdentifiers.add(identifier);
    }

    return {
      id: user.id,
      role: matches[0].role,
    };
  });

  const unusedIdentifiers = [...mapping.keys()].filter(
    (identifier) => !usedIdentifiers.has(identifier),
  );

  if (unusedIdentifiers.length > 0) {
    throw new Error(
      `Mapeamentos de backfill nao utilizados: ${unusedIdentifiers.join(", ")}.`,
    );
  }

  return updates;
}

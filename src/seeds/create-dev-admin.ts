import { getPayload } from "payload";
import { getLdapDevUser } from "../lib/ldap/dev-user.ts";

const devUser = getLdapDevUser();
if (!devUser) {
  throw new Error("O seed local exige NODE_ENV=development e LDAP_AUTH_MODE=mock.");
}

const { default: config } = await import("../payload.config.ts");
const payload = await getPayload({ config });

try {
  const { profile } = devUser;
  const { docs } = await payload.find({
    collection: "users",
    where: {
      or: [
        { login: { equals: profile.login } },
        { email: { equals: profile.email } },
      ],
    },
    limit: 2,
    overrideAccess: true,
  });

  if (docs.length > 0) {
    const existing = docs[0];
    if (
      docs.length !== 1 ||
      existing.login !== profile.login ||
      existing.email !== profile.email ||
      existing.role !== "admin"
    ) {
      throw new Error(
        "Login ou email local ja utilizado por outra conta/perfil. Nenhum usuario foi alterado.",
      );
    }
    console.log("Administrador local ja cadastrado. Nada a fazer.");
  } else {
    await payload.create({
      collection: "users",
      data: { ...profile, role: "admin" },
      overrideAccess: true,
    });
    console.log("Administrador local criado com email dev.admin@example.test e role admin.");
  }
} finally {
  await payload.destroy();
}

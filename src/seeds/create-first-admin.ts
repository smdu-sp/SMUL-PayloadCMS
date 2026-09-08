import { getPayload } from "payload";
import { buscarUsuarioLdapPorLogin } from "../lib/ldap/client.ts";
import config from "../payload.config.ts";

const login = process.argv[2];

if (!login) {
  console.error(
    "Uso: payload run src/seeds/create-first-admin.ts -- <login>",
  );
  process.exit(1);
}

const payload = await getPayload({ config });

const usuario = await buscarUsuarioLdapPorLogin(login);

if (!usuario) {
  console.error(
    `Usuario "${login}" nao encontrado no diretorio da SMUL. Nenhum usuario foi criado.`,
  );
  await payload.destroy();
  process.exit(1);
}

const existing = await payload.find({
  collection: "users",
  limit: 1,
  where: {
    login: {
      equals: usuario.login,
    },
  },
});

if (existing.docs[0]) {
  console.log(
    `Usuario "${usuario.login}" ja existe no CMS (id ${existing.docs[0].id}). Nada a fazer.`,
  );
} else {
  const created = await payload.create({
    collection: "users",
    data: {
      login: usuario.login,
      email: usuario.email,
      nome: usuario.nome,
      telefone: usuario.telefone,
      role: "admin",
    },
    overrideAccess: true,
  });
  console.log(
    `Usuario admin "${usuario.login}" (${usuario.email}) criado com id ${created.id}.`,
  );
}

await payload.destroy();

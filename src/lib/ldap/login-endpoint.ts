import { addDataAndFileToRequest, getFieldsToSign, jwtSign } from "payload";
import type { Endpoint } from "payload";
import { generatePayloadCookie } from "payload/shared";
import { autenticarLdap, buscarUsuarioLdapPorLogin } from "./client.ts";

export const ldapLoginEndpoint: Endpoint = {
  path: "/ldap-login",
  method: "post",
  handler: async (req) => {
    const payload = req.payload;
    await addDataAndFileToRequest(req);
    const login =
      typeof req.data?.login === "string" ? req.data.login.trim() : "";
    const senha = typeof req.data?.senha === "string" ? req.data.senha : "";

    if (!login || !senha) {
      return Response.json(
        { message: "Informe login e senha." },
        { status: 400 },
      );
    }

    const autenticado = await autenticarLdap(login, senha);
    if (!autenticado) {
      return Response.json(
        { message: "Credenciais invalidas." },
        { status: 401 },
      );
    }

    const collectionConfig = payload.collections.users.config;

    const { docs } = await payload.find({
      collection: "users",
      where: { login: { equals: login } },
      limit: 1,
      overrideAccess: true,
    });
    let user = docs[0];

    if (!user) {
      const { totalDocs } = await payload.count({
        collection: "users",
        overrideAccess: true,
      });

      if (totalDocs > 0) {
        return Response.json(
          {
            message:
              "Usuario autenticado na SMUL, mas sem acesso ao CMS. Peca a um administrador para cadastra-lo.",
          },
          { status: 403 },
        );
      }

      const perfil = await buscarUsuarioLdapPorLogin(login);
      if (!perfil) {
        return Response.json(
          {
            message:
              "Usuario autenticado na SMUL, mas sem acesso ao CMS. Peca a um administrador para cadastra-lo.",
          },
          { status: 403 },
        );
      }

      user = await payload.create({
        collection: "users",
        data: {
          login: perfil.login,
          email: perfil.email,
          nome: perfil.nome,
          telefone: perfil.telefone,
          role: "admin",
        },
        overrideAccess: true,
      });
    }

    user.collection = "users";

    const fieldsToSign = getFieldsToSign({
      collectionConfig,
      email: user.email,
      user,
    });

    const { exp, token } = await jwtSign({
      fieldsToSign,
      secret: payload.secret,
      tokenExpiration: collectionConfig.auth.tokenExpiration,
    });

    const cookie = generatePayloadCookie({
      collectionAuthConfig: collectionConfig.auth,
      cookiePrefix: payload.config.cookiePrefix,
      token,
    });

    return Response.json(
      { user, exp },
      {
        status: 200,
        headers: new Headers({ "Set-Cookie": cookie }),
      },
    );
  },
};

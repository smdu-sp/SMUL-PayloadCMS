import { ValidationError } from "payload";
import type { CollectionBeforeValidateHook } from "payload";
import { buscarUsuarioLdapPorLogin } from "./client.ts";

export const syncLdapUserFields: CollectionBeforeValidateHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  const login = data?.login;

  if (!login) {
    return data;
  }

  const loginChanged = operation === "create" || login !== originalDoc?.login;
  if (!loginChanged) {
    return data;
  }

  const usuario = await buscarUsuarioLdapPorLogin(login);

  if (!usuario) {
    throw new ValidationError(
      {
        collection: "users",
        errors: [
          {
            path: "login",
            message:
              "Usuario nao encontrado no diretorio da SMUL. Verifique se o login esta correto.",
          },
        ],
      },
      req.t,
    );
  }

  return {
    ...data,
    login: usuario.login,
    email: usuario.email,
    nome: usuario.nome,
    telefone: usuario.telefone,
  };
};

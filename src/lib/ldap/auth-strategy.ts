import { JWTAuthentication } from "payload";

export const ldapAuthStrategy = {
  name: "ldap-jwt",
  authenticate: JWTAuthentication,
};

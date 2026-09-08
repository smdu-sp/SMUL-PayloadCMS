"use client";

import {
  Form,
  FormSubmit,
  PasswordField,
  TextField,
  useAuth,
  useConfig,
} from "@payloadcms/ui";
import { useSearchParams } from "next/navigation";
import { formatAdminURL, getSafeRedirect } from "payload/shared";

const baseClass = "login__form";

export function LdapLoginForm() {
  const { config } = useConfig();
  const {
    admin: { user: userSlug },
    routes: { admin: adminRoute, api: apiRoute },
  } = config;
  const { setUser } = useAuth();
  const searchParams = useSearchParams();

  return (
    <Form
      action={formatAdminURL({ apiRoute, path: `/${userSlug}/ldap-login` })}
      className={baseClass}
      disableSuccessStatus
      method="POST"
      onSuccess={(data) => setUser(data as Parameters<typeof setUser>[0])}
      redirect={getSafeRedirect({
        fallbackTo: adminRoute,
        redirectTo: searchParams.get("redirect") ?? "",
      })}
      waitForAutocomplete
    >
      <div className={`${baseClass}__inputWrap`}>
        <TextField
          field={{ name: "login", label: "Login", required: true }}
          path="login"
        />
        <PasswordField
          field={{ name: "senha", label: "Senha", required: true }}
          path="senha"
        />
      </div>
      <FormSubmit size="large">Entrar</FormSubmit>
    </Form>
  );
}

"use client";

import {
  Form,
  FormSubmit,
  PasswordField,
  TextField,
  useAuth,
  useConfig,
  useTheme,
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

  const { theme, setTheme } = useTheme();

  const isLight = theme === "light";
  const isDark = theme === "dark";

  return (
    <div style={{ width: "100%" }}>
      {/* Seletor de Tema com 2 Ícones (Claro e Escuro) */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "3px",
            borderRadius: "8px",
            background: "var(--theme-elevation-100)",
            border: "1px solid var(--theme-elevation-200)",
            gap: "2px",
          }}
        >
          {/* Botão Tema Claro */}
          <button
            type="button"
            onClick={() => setTheme("light")}
            aria-label="Ativar Tema Claro"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              background: isLight ? "#ffffff" : "transparent",
              color: isLight ? "#0a3299" : "var(--theme-elevation-400)",
              boxShadow: isLight ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
            }}
          >
            {/* Ícone Sol (SVG) */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </button>

          {/* Botão Tema Escuro */}
          <button
            type="button"
            onClick={() => setTheme("dark")}
            aria-label="Ativar Tema Escuro"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              background: isDark ? "var(--theme-elevation-200)" : "transparent",
              color: isDark ? "#f94668" : "var(--theme-elevation-400)",
              boxShadow: isDark ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
            }}
          >
            {/* Ícone Lua (SVG) */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>
      </div>

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
    </div>
  );
}
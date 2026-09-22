import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { pt } from "@payloadcms/translations/languages/pt";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import { AuditLogs } from "./collections/AuditLogs.ts";
import { Media } from "./collections/Media.ts";
import { Pages } from "./collections/Pages.ts";
import { Users } from "./collections/Users.ts";
import { Footer } from "./globals/Footer.ts";
import { Header } from "./globals/Header.ts";
import { SiteSettings } from "./globals/SiteSettings.ts";
import { getLdapDevUser } from "./lib/ldap/dev-user.ts";

getLdapDevUser();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const databaseUrl = process.env.DATABASE_URI || "file:./payload.db";
const payloadSecret =
  process.env.PAYLOAD_SECRET || "dev-only-payload-secret-change-me";
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const adminLogoComponent = "/components/admin/Logo#Logo";
export const adminIconComponent = "/components/admin/Icon#Icon"; // 👈 VOLTOU AQUI
export const customNavComponent = "/components/admin/CustomNav#CustomNav";

export const adminHelpView = {
  Component: "/components/admin/AdminHelpPage#AdminHelpPage",
  path: "/ajuda",
} as const;

export const adminHelpNavLink =
  "/components/admin/AdminHelpNavLink#AdminHelpNavLink";

export const ldapLoginFormComponent =
  "/components/admin/LdapLoginForm#LdapLoginForm";

export const adminIconsView = {
  Component: "/components/admin/AdminIconsPage#AdminIconsPage",
  path: "/icones",
} as const;

export const adminIconsNavLink =
  "/components/admin/AdminIconsNavLink#AdminIconsNavLink";

export default buildConfig({
  editor: lexicalEditor(),
  i18n: {
    fallbackLanguage: "pt",
    supportedLanguages: { pt },
  },
  admin: {
    user: Users.slug,
    
    components: {
      Nav: customNavComponent,
      graphics: {
        Logo: adminLogoComponent,
        Icon: adminIconComponent, // 👈 REGISTRADO AQUI DE VOLTA
      },
      afterNavLinks: [adminHelpNavLink, adminIconsNavLink],
      beforeLogin: [ldapLoginFormComponent],
      views: {
        ajuda: adminHelpView,
        icones: adminIconsView,
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(
        dirname,
        "app",
        "(payload)",
        "admin",
        "importMap.js",
      ),
    },
  },
  collections: [Users, Media, Pages, AuditLogs],
  globals: [Header, Footer, SiteSettings],
  db: sqliteAdapter({
    client: {
      url: databaseUrl,
    },
  }),
  secret: payloadSecret,
  serverURL: serverUrl,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});

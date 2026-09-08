import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
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

// Fail at configuration loading as well as on requests if mock auth is unsafe.
getLdapDevUser();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const databaseUrl = process.env.DATABASE_URI || "file:./payload.db";
const payloadSecret =
  process.env.PAYLOAD_SECRET || "dev-only-payload-secret-change-me";
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const adminHelpView = {
  Component: "/components/admin/AdminHelpPage#AdminHelpPage",
  path: "/ajuda",
} as const;

export const adminHelpNavLink =
  "/components/admin/AdminHelpNavLink#AdminHelpNavLink";

export const ldapLoginFormComponent =
  "/components/admin/LdapLoginForm#LdapLoginForm";

export default buildConfig({
  editor: lexicalEditor(),
  admin: {
    user: Users.slug,
    components: {
      afterNavLinks: [adminHelpNavLink],
      beforeLogin: [ldapLoginFormComponent],
      views: {
        ajuda: adminHelpView,
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

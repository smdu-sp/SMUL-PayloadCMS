import type { Metadata } from "next";
import type { CSSProperties } from "react";
import type { ReactNode } from "react";
import { Lato } from "next/font/google";
import { getSiteSettings } from "../../lib/payload/get-page";
import { getSiteShell } from "../../lib/payload/get-site-shell";
import { generateSiteMetadata } from "../../lib/seo/metadata";
import { mapThemeToCssVariables } from "../../lib/theme/map-theme-to-css-variables";
import { resolveSemanticTheme } from "../../lib/theme/semantic-theme";
import { ThemeProvider } from "../../components/ui/ColorScope";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { SiteHeader } from "../../components/layout/SiteHeader";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();

  return generateSiteMetadata(siteSettings);
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [siteSettings, siteShell] = await Promise.all([
    getSiteSettings(),
    getSiteShell(),
  ]);
  const theme = resolveSemanticTheme(siteSettings?.theme?.colors);
  const themeVariables = mapThemeToCssVariables(theme) as CSSProperties;

  return (
    <html
      lang="pt-BR"
      className={`h-full antialiased ${lato.variable}`}
      style={themeVariables}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider theme={theme}>
          <SiteHeader header={siteShell.header} siteName={siteSettings?.siteName} />
          {children}
          <SiteFooter footer={siteShell.footer} />
        </ThemeProvider>
      </body>
    </html>
  );
}

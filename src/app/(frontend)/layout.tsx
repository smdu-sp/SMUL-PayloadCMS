import type { Metadata } from "next";
import type { CSSProperties } from "react";
import type { ReactNode } from "react";
import { Lato } from "next/font/google";
import { getSiteSettings } from "../../lib/payload/get-page";
import { getSiteShell } from "../../lib/payload/get-site-shell";
import { generateSiteMetadata } from "../../lib/seo/metadata";
import { mapThemeToCssVariables } from "../../lib/theme/map-theme-to-css-variables";
import { resolveSemanticTheme } from "../../lib/theme/semantic-theme";
import {
  getTypographyStylesheets,
  mapTypographyToCssVariables,
  resolveTypography,
} from "../../lib/theme/google-fonts";
import { ThemeProvider } from "../../components/ui/ColorScope";
import { AccessibilityThemeProvider } from "../../components/theme/AccessibilityThemeProvider";
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
  const typography = resolveTypography(siteSettings?.theme?.typography);
  const fontStylesheets = getTypographyStylesheets(typography);
  const themeVariables = {
    ...mapThemeToCssVariables(theme),
    ...mapTypographyToCssVariables(typography),
  } as CSSProperties;

  return (
    <html
      lang="pt-BR"
      className={`h-full antialiased ${lato.variable}`}
      style={themeVariables}
    >
      {fontStylesheets.length > 0 ? (
        <>
          <link href="https://fonts.googleapis.com" rel="preconnect" />
          <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
          {fontStylesheets.map((href) => (
            <link href={href} key={href} precedence="google-fonts" rel="stylesheet" />
          ))}
        </>
      ) : null}
      <body className="min-h-full flex flex-col">
        <AccessibilityThemeProvider>
          <ThemeProvider theme={theme}>
            <SiteHeader header={siteShell.header} siteName={siteSettings?.siteName} />
            {children}
            <SiteFooter footer={siteShell.footer} />
          </ThemeProvider>
        </AccessibilityThemeProvider>
      </body>
    </html>
  );
}

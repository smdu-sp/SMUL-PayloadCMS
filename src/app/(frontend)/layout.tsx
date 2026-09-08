import type { Metadata } from "next";
import type { CSSProperties } from "react";
import type { ReactNode } from "react";
import { Lato } from "next/font/google";
import { getSiteSettings } from "../../lib/payload/get-page";
import { generateSiteMetadata } from "../../lib/seo/metadata";
import { getTheme } from "../../lib/theme/get-theme";
import { mapThemeToCssVariables } from "../../lib/theme/map-theme-to-css-variables";
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
  const theme = await getTheme();
  const themeVariables = mapThemeToCssVariables(theme) as CSSProperties;

  return (
    <html
      lang="pt-BR"
      className={`h-full antialiased ${lato.variable}`}
      style={themeVariables}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

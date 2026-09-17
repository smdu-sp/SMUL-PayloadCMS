import type { CSSProperties } from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Button, Card, ColorScope, Heading, Icon, Text } from "../../components/ui";
import { ThemeProvider } from "../../components/ui/ColorScope";
import { BlockLink } from "../../blocks/shared/BlockLink";
import { mapThemeToCssVariables } from "./map-theme-to-css-variables";
import { resolveSemanticTheme } from "./semantic-theme";

export const regressionThemes = {
  institutional: resolveSemanticTheme(),
  alternative: resolveSemanticTheme({
    background: "#171022", foreground: "#f9f3ff",
    brand: "#f7d000", action: "#fc78dd", accent: "#4cff9f",
  }),
};

const richText = {
  root: {
    type: "root", direction: null, format: "" as const, indent: 0, version: 1,
    children: [{
      type: "paragraph", direction: null, format: "", indent: 0, version: 1,
      children: [{ type: "text", detail: 0, format: 0, mode: "normal", style: "", text: "Rich Text no contexto local.", version: 1 }],
    }],
  },
};

function Content() {
  return (
    <div className="space-y-4">
      <Heading level={3}>Titulo local</Heading>
      <Text>Texto corrido no contexto local.</Text>
      <Text tone="accent">Destaque legivel</Text>
      <RichText className="cms-rich-text" data={richText} />
      <Icon ariaLabel="Informacao" name="info" />
      <div className="flex flex-wrap gap-3">
        <Button>Preenchido</Button>
        <Button variant="outline">Contorno</Button>
        <Button variant="ghost">Discreto</Button>
      </div>
      <BlockLink link={{ type: "external", url: "https://example.org", label: "Link contextual" }} />
    </div>
  );
}

/** Test-only composition; not a CMS block or production route. */
export function ColorRegressionFixture({ palette = "alternative" }: { palette?: keyof typeof regressionThemes }) {
  const theme = regressionThemes[palette];
  return (
    <ThemeProvider theme={theme}>
      <main style={mapThemeToCssVariables(theme) as CSSProperties}>
        <ColorScope as="section" scheme={palette === "institutional" ? "inverse" : "default"} className="space-y-6 p-8">
          <Heading level={1}>Regressao de cores: {palette}</Heading>
          <Content />
          <div className="grid gap-6 md:grid-cols-3">
            {(["surface", "brand", "accent"] as const).map(scheme => (
              <div data-regression={scheme} key={scheme}>
                <Card scheme={scheme}>
                  <Heading level={2}>{scheme}</Heading>
                  <Content />
                  <div className="mt-6">
                    <Card scheme="muted">
                      <Heading level={3}>Superficie interna muted</Heading>
                      <Content />
                      <Card scheme="inherit"><Text>Heranca real, sem novo fundo.</Text></Card>
                    </Card>
                  </div>
                </Card>
              </div>
            ))}
          </div>
          <Card scheme="brand" overrides={{ background: "#fff", foreground: "#123", accent: "#345" }}>
            <Heading level={2}>Override semantico parcial</Heading>
            <Content />
          </Card>
        </ColorScope>
      </main>
    </ThemeProvider>
  );
}

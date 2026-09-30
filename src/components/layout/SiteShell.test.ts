import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import type { Footer, Header, Page } from "../../payload-types";
import { resolveSemanticTheme } from "../../lib/theme/semantic-theme";
import { ThemeProvider } from "../ui/ColorScope";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

const page = {
  id: 1,
  _status: "published",
  lifecycleStatus: "active",
  slug: "orientacoes",
  title: "Orientações",
} as Page;

describe("public site shell", () => {
  it("renders semantic header navigation and ignores unavailable pages", () => {
    const header = {
      id: 1,
      navigation: [
        { id: "active", label: "Orientações", page },
        { id: "draft", label: "Rascunho", page: { ...page, _status: "draft" } },
      ],
    } as Header;
    const markup = renderToStaticMarkup(
      createElement(SiteHeader, { header, siteName: "Meu Imóvel Regular" }),
    );

    assert.match(markup, /<header/);
    assert.match(markup, /<nav aria-label="Navegação principal"/);
    assert.match(markup, /href="\/orientacoes"/);
    assert.doesNotMatch(markup, /Rascunho/);
    assert.match(markup, /Meu Imóvel Regular — página inicial/);
  });

  it("renders accessible contact and validated footer links", () => {
    const footer = {
      id: 1,
      address: "Praça de atendimento",
      email: "contato@example.gov.br",
      phone: "(11) 1234-5678",
      socialLinks: [
        { id: "valid", icon: "instagram", label: "Rede oficial", url: "https://example.gov.br/rede" },
        { id: "unknown-icon", icon: "<svg>", label: "Outra rede", url: "https://example.gov.br/outra" },
        { id: "invalid", label: "Link inseguro", url: "javascript:alert(1)" },
      ],
      institutionalLinks: [
        { id: "service", label: "Serviço oficial", url: "https://example.gov.br/servico" },
      ],
    } as Footer;
    const markup = renderToStaticMarkup(createElement(SiteFooter, { footer }));

    assert.match(markup, /<footer/);
    assert.match(markup, /href="tel:1112345678"/);
    assert.match(markup, /href="mailto:contato@example.gov.br"/);
    assert.match(markup, /aria-labelledby="footer-institutional-title"/);
    assert.match(markup, /https:\/\/example.gov.br\/servico/);
    assert.equal((markup.match(/<svg/g) ?? []).length, 1);
    assert.match(markup, /<svg[^>]*aria-hidden="true"/);
    assert.match(markup, /h-5 w-5/);
    assert.match(markup, /Outra rede/);
    assert.doesNotMatch(markup, /Link inseguro/);
  });

  it("keeps footer text readable when the global foreground matches its muted background", () => {
    const footer = {
      id: 1,
      phone: "(11) 1234-5678",
    } as Footer;
    const theme = resolveSemanticTheme({
      background: "#000000",
      foreground: "#f1f5f9",
    });
    const markup = renderToStaticMarkup(
      createElement(
        ThemeProvider,
        { theme },
        createElement(SiteFooter, { footer }),
      ),
    );

    assert.match(markup, /data-color-scheme="muted"/);
    assert.match(markup, /--block-background:#f1f5f9/);
    assert.match(markup, /--block-foreground:#475569/);
    assert.doesNotMatch(markup, /bg-muted text-foreground/);
  });

  it("omits an empty footer without breaking the layout", () => {
    assert.equal(renderToStaticMarkup(createElement(SiteFooter, {})), "");
  });
});

/* eslint-disable react/no-children-prop */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { Button, Card, Container, Heading, Section, Text, ColorScope, Status } from "./index";
import { ThemeProvider, MediaColorScope } from "./ColorScope";
import { resolveSemanticTheme } from "../../lib/theme/semantic-theme";

describe("ui primitives and nested scopes", () => {
  it("keeps layout and typography responsibilities separate from color", () => {
    const container = Container({ children: "content", size: "md" });
    assert.match(container.props.className, /max-w-container-md/);
    const heading = Heading({ children: "Title", level: 1, size: "display" });
    assert.equal(heading.type, "h1");
    assert.match(heading.props.className, /text-display-md/);
    assert.match(heading.props.className, /var\(--block-heading\)/);
    assert.match(Text({ children: "Body" }).props.className, /var\(--block-foreground\)/);
  });
  it("delegates surface ownership to the same reusable scope", () => {
    const section = Section({ children: "section", spacing: "lg", scheme: "brand" });
    const card = Card({ children: "card", className: "custom-card", fullHeight: true, padding: "lg" });
    assert.equal(section.type, ColorScope);
    assert.equal(section.props.as, "section");
    assert.equal(section.props.scheme, "brand");
    assert.equal(card.type, ColorScope);
    assert.equal(card.props.scheme, "surface");
    assert.match(card.props.className, /p-8/);
    assert.match(card.props.className, /h-full/);
    assert.match(card.props.className, /border-border/);
    assert.match(card.props.className, /custom-card/);
    assert.equal(Card({ children: "plain", scheme: "inherit" }).props.scheme, "inherit");
  });
  it("inherits without publishing global resets and creates complete nested surfaces", () => {
    const theme = resolveSemanticTheme({ background: "#110022", foreground: "#fff", brand: "#ffdd00", action: "#ff88cc", accent: "#66ffaa" });
    const markup = renderToStaticMarkup(createElement(ThemeProvider, { theme },
      createElement(Section, { scheme: "brand", children: [
        createElement(Card, { key: "inherit", scheme: "inherit", children: "inherited" }),
        createElement(Card, { key: "surface", scheme: "surface", children: createElement(Heading, { children: "Local heading" }) }),
        createElement(Card, { key: "accent", scheme: "accent", children: createElement(Button, { children: "Action" }) }),
      ] }),
    ));
    assert.match(markup, /data-color-scheme="brand"[^>]*--block-background:#ffdd00/);
    assert.match(markup, /data-color-scheme="surface"[^>]*--block-foreground:#1e293b/);
    assert.match(markup, /data-color-scheme="accent"[^>]*--block-background:#66ffaa/);
    const inheritedTag = markup.match(/<div[^>]*data-color-scheme="inherit"[^>]*>/)?.[0] ?? "";
    assert.ok(inheritedTag);
    assert.doesNotMatch(inheritedTag, /style=|bg-\[/);
  });
  it("keeps filled and transparent buttons contextual without opening scopes", () => {
    for (const variant of ["solid", "outline", "ghost"] as const) {
      const button = Button({ children: "Action", variant });
      assert.equal(button.type, "button");
      assert.match(button.props.className, /focus-visible:outline/);
      assert.doesNotMatch(button.props.className, /bg-surface|bg-muted|text-primary/);
      assert.match(button.props.className, variant === "solid" ? /--block-action-foreground/ : /bg-transparent/);
    }
    assert.equal(Button({ children: "Go", href: "/test" }).props.href, "/test");
  });
  it("keeps Rich Text and text links inside the current scope", () => {
    const css = readFileSync(new URL("../../app/(frontend)/globals.css", import.meta.url), "utf8");
    const richText = css.slice(css.indexOf(".cms-rich-text"));
    assert.match(richText, /--block-foreground/);
    assert.match(richText, /--block-heading/);
    assert.doesNotMatch(richText, /--color-/);
    const link = readFileSync(new URL("../../blocks/shared/BlockLink.tsx", import.meta.url), "utf8");
    assert.match(link, /--block-foreground/);
    assert.doesNotMatch(link, /text-link/);
  });
  it("keeps media foreground independent of the editorial theme", () => {
    const markup = renderToStaticMarkup(createElement(ThemeProvider, { theme: resolveSemanticTheme({ background: "#000", foreground: "#fff" }) },
      createElement(MediaColorScope, { mode: "light", paint: false, children: createElement(Text, { children: "Caption" }) }),
    ));
    assert.match(markup, /--block-background:#ffffff/);
    assert.match(markup, /--block-foreground:#000000/);
  });
  it("renders semantic statuses without relying only on color", () => {
    const markup = renderToStaticMarkup(createElement(Status, {
      title: createElement(Heading, { children: "Aviso", level: 2 }),
      variant: "warning",
      children: "Conteudo",
    }));
    assert.match(markup, /data-status="warning"/);
    assert.match(markup, /Atencao/);
    assert.match(markup, /aria-hidden="true"/);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CSSProperties } from "react";

import { Button, Card, Container, Heading, Section, Text } from "./index";

describe("ui primitives", () => {
  it("Container centralizes width and lateral spacing", () => {
    const element = Container({ children: "content", size: "md" });

    assert.equal(element.type, "div");
    assert.match(element.props.className, /mx-auto/);
    assert.match(element.props.className, /max-w-container-md/);
    assert.match(element.props.className, /px-container/);
  });

  it("Section uses closed spacing and tone variants", () => {
    const element = Section({
      children: "section",
      spacing: "lg",
      tone: "brand",
    });

    assert.equal(element.type, "section");
    assert.match(element.props.className, /bg-brand/);
    assert.match(element.props.className, /py-16/);
  });

  it("Heading separates semantic level from visual size", () => {
    const element = Heading({
      children: "Title",
      level: 1,
      size: "display",
    });

    assert.equal(element.type, "h1");
    assert.match(element.props.className, /text-display-md/);
    assert.match(element.props.className, /text-headline/);
  });

  it("Text exposes compact readable variants", () => {
    const element = Text({
      children: "Lead",
      tone: "inverse",
      variant: "lead",
    });
    const body = Text({
      children: "Body",
      variant: "body",
    });

    assert.equal(element.type, "p");
    assert.match(element.props.className, /text-lg/);
    assert.match(element.props.className, /text-brand-foreground/);
    assert.match(body.props.className, /text-paragraph/);
  });

  it("Button renders links and button controls with focus styles", () => {
    const link = Button({ children: "Go", href: "/teste", variant: "primary" });
    const button = Button({ children: "Send", type: "submit", variant: "outline" });

    assert.equal(link.props.href, "/teste");
    assert.match(link.props.className, /focus-visible:outline/);
    assert.equal(button.type, "button");
    assert.equal(button.props.type, "submit");
    assert.match(button.props.className, /border-border/);
  });

  it("Card exposes closed visual density and interaction states", () => {
    const element = Card({
      children: "card",
      fullHeight: true,
      interactive: true,
      padding: "lg",
      tone: "surface",
    });

    assert.equal(element.type, "div");
    assert.match(element.props.className, /p-8/);
    assert.match(element.props.className, /h-full/);
    assert.match(element.props.className, /hover:border-action/);
  });

  it("Card and Button can inherit controlled block color variables", () => {
    const card = Card({
      children: "card",
      style: {
        "--block-accent": "#0a3299",
        "--block-bg": "#ffffff",
        "--block-fg": "#0a3299",
      } as CSSProperties,
      tone: "custom",
    });
    const button = Button({ children: "Go", href: "/teste", variant: "blockAccent" });

    assert.match(card.props.className, /var\(--block-bg\)/);
    assert.equal(card.props.style["--block-accent"], "#0a3299");
    assert.match(button.props.className, /var\(--block-accent\)/);
  });
});

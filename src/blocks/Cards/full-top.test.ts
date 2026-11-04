import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import type { CardsBlock as CardsProps, Media } from "../../payload-types";
import { Card } from "../../components/ui";
import { PresentedMediaImage } from "../shared/PresentedMediaImage";
import { CardsBlock, normalizeCardImageLayout } from "./Component";

const image = {
  id: 1,
  alt: "Imagem de teste",
  url: "/api/media/file/card.png",
  width: 900,
  height: 600,
} as Media;

type InspectedProps = {
  children: ReactNode;
  className: string;
  padding: string;
  presentation: { aspectRatio: string };
  sizeClassNames: { medium: string };
};

function findElement(node: ReactNode, type: unknown): ReactElement<InspectedProps> | null {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findElement(child, type);
      if (found) return found;
    }
    return null;
  }
  if (!isValidElement(node)) return null;
  if (node.type === type) return node as ReactElement<InspectedProps>;
  const children = (node.props as { children?: ReactNode }).children;
  const nested = findElement(children, type);
  if (nested) return nested;
  if (typeof node.type === "function" && children === undefined) {
    return findElement((node.type as (props: unknown) => ReactNode)(node.props), type);
  }
  return null;
}

function renderCard(imageLayout?: string, mediaPosition?: string) {
  const props = {
    blockType: "cards",
    items: [{
      id: "card-test",
      title: "Card de teste",
      description: "Texto de teste",
      mediaSource: "image",
      mediaPosition,
      imageLayout,
      image,
    }],
  } as CardsProps;
  const tree = CardsBlock(props);
  const card = findElement(tree, Card);
  const media = findElement(tree, PresentedMediaImage);
  assert.ok(card);
  assert.ok(media);
  return { card, media };
}

describe("Cards full-top image", () => {
  it("keeps saved cards without the new field in the contained layout", () => {
    assert.equal(normalizeCardImageLayout(undefined), "contained");
    assert.equal(normalizeCardImageLayout("unexpected"), "contained");
    const { card, media } = renderCard();
    assert.equal(card.props.padding, "md");
    assert.equal(media.props.presentation.aspectRatio, "original");
    assert.equal(media.props.sizeClassNames.medium, "w-3/4 max-w-full mx-auto");
    assert.doesNotMatch(media.props.className, /border/);
  });

  it("extends only a top image to the card edges and keeps text padded", () => {
    const { card, media } = renderCard("fullTop", "top");
    assert.equal(card.props.padding, "none");
    assert.equal(media.props.presentation.aspectRatio, "16:9");
    assert.equal(media.props.sizeClassNames.medium, "w-full");
    assert.doesNotMatch(media.props.className, /border|rounded|mb-5/);
    assert.match(JSON.stringify(card.props.children), /px-6 pt-6/);
    assert.equal(renderCard("fullTop", "left").card.props.padding, "md");
  });
});

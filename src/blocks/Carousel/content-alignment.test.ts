import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { CarouselClient, carouselContentAlignmentClasses } from "./CarouselClient";
import { CarouselBlock, normalizeCarouselContentAlignment } from "./Component";

const items = [{ image: { id: 1, alt: "Imagem", url: "/slide.png" } as never }];

function findClient(node: ReactNode): ReactElement<{ contentAlignment: string }> | null {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findClient(child);
      if (found) return found;
    }
    return null;
  }
  if (!isValidElement(node)) return null;
  if (node.type === CarouselClient) return node as ReactElement<{ contentAlignment: string }>;
  return findClient((node.props as { children?: ReactNode }).children);
}

describe("Carousel content alignment", () => {
  it("preserves left alignment for absent or unknown stored values", () => {
    assert.equal(normalizeCarouselContentAlignment(undefined), "left");
    assert.equal(normalizeCarouselContentAlignment("unknown"), "left");
    assert.equal(carouselContentAlignmentClasses.left, "");
    assert.equal(findClient(CarouselBlock({ blockType: "carousel", items }))?.props.contentAlignment, "left");
  });

  it("passes centered alignment to the slide presentation", () => {
    assert.match(carouselContentAlignmentClasses.center, /items-center text-center/);
    assert.equal(findClient(CarouselBlock({ blockType: "carousel", display: { contentAlignment: "center" }, items }))?.props.contentAlignment, "center");
  });
});

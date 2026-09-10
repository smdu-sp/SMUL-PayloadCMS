import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement, isValidElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { CardsBlock as CardsProps, Media } from "../../payload-types";
import { CardsBlock } from "./Component";
import { MediaImage } from "../shared/MediaImage";

const media: Media = {
  id: 1,
  alt: "Imagem de teste",
  usage: "content",
  url: "/api/media/file/cards-test.png",
  width: 900,
  height: 600,
  focalX: 25,
  focalY: 80,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

type Item = CardsProps["items"][number];

// Inspect the actual props passed through MediaImage. Next's default image
// export requires its bundler and cannot be rendered directly by Node/tsx.
function findImage(node: ReactNode): ReturnType<typeof MediaImage> {
  if (Array.isArray(node)) {
    for (const child of node) {
      const image = findImage(child);
      if (image) return image;
    }
    return null;
  }
  if (!isValidElement(node)) return null;
  if (node.type === MediaImage) {
    return MediaImage(node.props as Parameters<typeof MediaImage>[0]);
  }
  if (typeof node.type === "function") {
    return findImage((node.type as (props: unknown) => ReactNode)(node.props));
  }
  return findImage((node.props as { children?: ReactNode }).children);
}

function renderImage(overrides: Partial<Item> = {}) {
  const element = findImage(createElement(CardsBlock, {
    blockType: "cards",
    variant: "default",
    items: [{
      id: "test-card",
      title: "Card de teste",
      description: "Descricao do card",
      mediaSource: "image",
      image: media,
      ...overrides,
    }],
  }));
  assert.ok(element);
  return renderToStaticMarkup(createElement("img", {
    className: element.props.className,
    style: element.props.style,
    alt: element.props.alt,
  }));
}

describe("Cards image presentation rendering", () => {
  it("uses medium/original defaults when the presentation group is absent", () => {
    for (const mediaPosition of ["top", "left", "right"] as const) {
      const img = renderImage({ mediaPosition });
      assert.match(img, mediaPosition === "top" ? /w-3\/4/ : /w-28/);
      assert.doesNotMatch(img, /aspect-|object-cover|object-position/);
    }
  });

  it("applies the asset focal point to cover crops in every media position", () => {
    for (const mediaPosition of ["top", "left", "right"] as const) {
      const img = renderImage({
        mediaPosition,
        imagePresentation: { size: "small", aspectRatio: "1:1", fit: "cover" },
      });
      assert.match(img, /aspect-square/);
      assert.match(img, /object-cover/);
      assert.match(img, /object-position:25% 80%/);
    }
  });

  it("keeps contain and original images free of focal offsets", () => {
    const contained = renderImage({
      imagePresentation: { size: "large", aspectRatio: "4:3", fit: "contain" },
    });
    assert.match(contained, /aspect-\[4\/3\]/);
    assert.match(contained, /object-contain/);
    assert.doesNotMatch(contained, /object-position/);
    const original = renderImage({
      imagePresentation: { size: "medium", aspectRatio: "original", fit: "cover" },
    });
    assert.doesNotMatch(original, /aspect-|object-cover|object-position/);
  });

  it("defaults a missing fit to cover and tolerates media without a focal point", () => {
    const imagePresentation = { size: "large", aspectRatio: "16:9", fit: null } as const;
    assert.match(renderImage({ imagePresentation }), /object-position:25% 80%/);
    const img = renderImage({
      imagePresentation,
      image: { ...media, focalX: null, focalY: null },
    });
    assert.match(img, /object-cover/);
    assert.doesNotMatch(img, /object-position/);
  });

  it("leaves icon rendering independent of image presentation", () => {
    const img = renderImage({
      mediaSource: "icon",
      image: null,
      icon: media,
      imagePresentation: { size: "large", aspectRatio: "1:1", fit: "cover" },
    });
    assert.match(img, /object-contain/);
    assert.doesNotMatch(img, /aspect-|object-position/);
  });
});

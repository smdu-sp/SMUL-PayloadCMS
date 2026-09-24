import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { VideoBlock } from "./Component";

const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

describe("VideoBlock custom theme", () => {
  it("applies the local palette to the section around the player", () => {
    const markup = renderToStaticMarkup(createElement(VideoBlock, {
      appearance: {
        colors: { background: "#ffffff", foreground: "#222222" },
        scheme: "custom",
      },
      blockType: "videoBlock",
      caption: "Legenda local",
      title: "Video local",
      url: videoUrl,
    }));

    assert.match(markup, /--block-background:#ffffff/);
    assert.match(markup, /--block-foreground:#222222/);
    assert.match(markup, /Legenda local/);
  });

  it("ignores stored custom colors after switching to a preset", () => {
    const markup = renderToStaticMarkup(createElement(VideoBlock, {
      appearance: {
        colors: { background: "#ff0000", foreground: "#00ff00" },
        scheme: "muted",
      },
      blockType: "videoBlock",
      url: videoUrl,
    }));

    assert.doesNotMatch(markup, /--block-background:#ff0000/);
    assert.doesNotMatch(markup, /--block-foreground:#00ff00/);
    assert.match(markup, /data-color-scheme="muted"/);
  });
});

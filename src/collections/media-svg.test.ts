import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { UploadConfig } from "payload";
import { MediaImage } from "../blocks/shared/MediaImage";
import type { Media as MediaDocument } from "../payload-types";
import { allowedMediaMimeTypes, Media } from "./Media";

describe("SVG media policy", () => {
  it("accepts SVG while keeping the existing media formats", () => {
    assert.ok(allowedMediaMimeTypes.includes("image/svg+xml"));
    assert.ok(allowedMediaMimeTypes.includes("image/png"));
    assert.ok(allowedMediaMimeTypes.includes("image/avif"));
    assert.ok(allowedMediaMimeTypes.includes("application/pdf"));
  });

  it("serves SVG with a restrictive CSP and bypasses the image optimizer", () => {
    const upload = Media.upload as UploadConfig;
    const headers = new Headers({ "Content-Type": "image/svg+xml" });
    upload.modifyResponseHeaders?.({ headers });
    assert.match(headers.get("Content-Security-Policy") ?? "", /script-src|default-src 'none'/);
    assert.match(headers.get("Content-Security-Policy") ?? "", /sandbox/);
    assert.equal(headers.get("X-Content-Type-Options"), "nosniff");

    const image = MediaImage({
      media: { id: 1, alt: "Marca", mimeType: "image/svg+xml", url: "/api/media/file/logo.svg" } as MediaDocument,
    });
    assert.equal(image?.props.unoptimized, true);
  });
});

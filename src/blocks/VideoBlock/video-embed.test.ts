import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getVideoEmbedSrc,
  normalizeVideoAspectRatio,
  normalizeVideoProvider,
  parseVideoEmbedUrl,
} from "./video-embed";

describe("parseVideoEmbedUrl", () => {
  describe("YouTube", () => {
    it("reconhece URL com parametro ?v=", () => {
      const result = parseVideoEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      assert.deepEqual(result, { id: "dQw4w9WgXcQ", provider: "youtube" });
    });

    it("reconhece URL curta youtu.be", () => {
      const result = parseVideoEmbedUrl("https://youtu.be/dQw4w9WgXcQ");
      assert.deepEqual(result, { id: "dQw4w9WgXcQ", provider: "youtube" });
    });

    it("reconhece URL de embed /embed/", () => {
      const result = parseVideoEmbedUrl("https://www.youtube.com/embed/dQw4w9WgXcQ");
      assert.deepEqual(result, { id: "dQw4w9WgXcQ", provider: "youtube" });
    });

    it("reconhece URL de Shorts /shorts/", () => {
      const result = parseVideoEmbedUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ");
      assert.deepEqual(result, { id: "dQw4w9WgXcQ", provider: "youtube" });
    });

    it("reconhece URL de Live /live/", () => {
      const result = parseVideoEmbedUrl("https://www.youtube.com/live/dQw4w9WgXcQ");
      assert.deepEqual(result, { id: "dQw4w9WgXcQ", provider: "youtube" });
    });

    it("reconhece dominio youtube-nocookie.com", () => {
      const result = parseVideoEmbedUrl(
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      );
      assert.deepEqual(result, { id: "dQw4w9WgXcQ", provider: "youtube" });
    });

    it("rejeita ID com tamanho invalido (< 11 chars)", () => {
      const result = parseVideoEmbedUrl("https://youtu.be/abc123");
      assert.equal(result, null);
    });

    it("rejeita ID com caracteres invalidos", () => {
      const result = parseVideoEmbedUrl("https://youtu.be/dQw4w9WgX!!");
      assert.equal(result, null);
    });
  });

  describe("Vimeo", () => {
    it("reconhece URL de video vimeo.com", () => {
      const result = parseVideoEmbedUrl("https://vimeo.com/123456789");
      assert.deepEqual(result, { id: "123456789", provider: "vimeo" });
    });

    it("reconhece URL de player player.vimeo.com/video/", () => {
      const result = parseVideoEmbedUrl("https://player.vimeo.com/video/123456789");
      assert.deepEqual(result, { id: "123456789", provider: "vimeo" });
    });

    it("rejeita ID com letras no Vimeo", () => {
      const result = parseVideoEmbedUrl("https://vimeo.com/abc");
      assert.equal(result, null);
    });
  });

  describe("Rejeicoes de seguranca", () => {
    it("rejeita string com tag HTML", () => {
      assert.equal(parseVideoEmbedUrl('<iframe src="...">'), null);
    });

    it("rejeita embed code HTML completo", () => {
      assert.equal(
        parseVideoEmbedUrl(
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>',
        ),
        null,
      );
    });

    it("rejeita string vazia", () => {
      assert.equal(parseVideoEmbedUrl(""), null);
    });

    it("rejeita valor nao-string", () => {
      assert.equal(parseVideoEmbedUrl(null), null);
      assert.equal(parseVideoEmbedUrl(undefined), null);
      assert.equal(parseVideoEmbedUrl(42), null);
    });

    it("rejeita URL de dominio desconhecido", () => {
      assert.equal(parseVideoEmbedUrl("https://dailymotion.com/video/abc"), null);
    });

    it("rejeita URL sem protocolo https/http", () => {
      assert.equal(parseVideoEmbedUrl("ftp://youtube.com/watch?v=dQw4w9WgXcQ"), null);
    });

    it("rejeita URL malformada", () => {
      assert.equal(parseVideoEmbedUrl("nao-e-uma-url"), null);
    });
  });
});

describe("getVideoEmbedSrc", () => {
  it("gera URL youtube-nocookie para YouTube", () => {
    const src = getVideoEmbedSrc({ id: "dQw4w9WgXcQ", provider: "youtube" });
    assert.equal(src, "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });

  it("gera URL do player Vimeo", () => {
    const src = getVideoEmbedSrc({ id: "123456789", provider: "vimeo" });
    assert.equal(src, "https://player.vimeo.com/video/123456789");
  });
});

describe("normalizeVideoAspectRatio", () => {
  it("retorna 16:9 como padrao para valor desconhecido", () => {
    assert.equal(normalizeVideoAspectRatio("21:9"), "16:9");
    assert.equal(normalizeVideoAspectRatio(null), "16:9");
    assert.equal(normalizeVideoAspectRatio(undefined), "16:9");
  });

  it("retorna 4:3 quando informado", () => {
    assert.equal(normalizeVideoAspectRatio("4:3"), "4:3");
  });

  it("retorna 1:1 quando informado", () => {
    assert.equal(normalizeVideoAspectRatio("1:1"), "1:1");
  });

  it("retorna 16:9 quando informado", () => {
    assert.equal(normalizeVideoAspectRatio("16:9"), "16:9");
  });
});

describe("normalizeVideoProvider", () => {
  it("retorna youtube para valor valido", () => {
    assert.equal(normalizeVideoProvider("youtube"), "youtube");
  });

  it("retorna vimeo para valor valido", () => {
    assert.equal(normalizeVideoProvider("vimeo"), "vimeo");
  });

  it("retorna null para valor desconhecido", () => {
    assert.equal(normalizeVideoProvider("dailymotion"), null);
    assert.equal(normalizeVideoProvider(null), null);
    assert.equal(normalizeVideoProvider(undefined), null);
  });
});

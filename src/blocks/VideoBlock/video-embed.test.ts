import { describe, expect, it } from "vitest";
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
      expect(result).toEqual({ id: "dQw4w9WgXcQ", provider: "youtube" });
    });

    it("reconhece URL curta youtu.be", () => {
      const result = parseVideoEmbedUrl("https://youtu.be/dQw4w9WgXcQ");
      expect(result).toEqual({ id: "dQw4w9WgXcQ", provider: "youtube" });
    });

    it("reconhece URL de embed /embed/", () => {
      const result = parseVideoEmbedUrl("https://www.youtube.com/embed/dQw4w9WgXcQ");
      expect(result).toEqual({ id: "dQw4w9WgXcQ", provider: "youtube" });
    });

    it("reconhece URL de Shorts /shorts/", () => {
      const result = parseVideoEmbedUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ");
      expect(result).toEqual({ id: "dQw4w9WgXcQ", provider: "youtube" });
    });

    it("reconhece URL de Live /live/", () => {
      const result = parseVideoEmbedUrl("https://www.youtube.com/live/dQw4w9WgXcQ");
      expect(result).toEqual({ id: "dQw4w9WgXcQ", provider: "youtube" });
    });

    it("reconhece dominio youtube-nocookie.com", () => {
      const result = parseVideoEmbedUrl(
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      );
      expect(result).toEqual({ id: "dQw4w9WgXcQ", provider: "youtube" });
    });

    it("rejeita ID com tamanho invalido (< 11 chars)", () => {
      const result = parseVideoEmbedUrl("https://youtu.be/abc123");
      expect(result).toBeNull();
    });

    it("rejeita ID com caracteres invalidos", () => {
      const result = parseVideoEmbedUrl("https://youtu.be/dQw4w9WgX!!");
      expect(result).toBeNull();
    });
  });

  describe("Vimeo", () => {
    it("reconhece URL de video vimeo.com", () => {
      const result = parseVideoEmbedUrl("https://vimeo.com/123456789");
      expect(result).toEqual({ id: "123456789", provider: "vimeo" });
    });

    it("reconhece URL de player player.vimeo.com/video/", () => {
      const result = parseVideoEmbedUrl("https://player.vimeo.com/video/123456789");
      expect(result).toEqual({ id: "123456789", provider: "vimeo" });
    });

    it("rejeita ID com letras no Vimeo", () => {
      const result = parseVideoEmbedUrl("https://vimeo.com/abc");
      expect(result).toBeNull();
    });
  });

  describe("Rejeicoes de seguranca", () => {
    it("rejeita string com tag HTML", () => {
      expect(parseVideoEmbedUrl('<iframe src="...">')).toBeNull();
    });

    it("rejeita embed code HTML completo", () => {
      expect(
        parseVideoEmbedUrl(
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>',
        ),
      ).toBeNull();
    });

    it("rejeita string vazia", () => {
      expect(parseVideoEmbedUrl("")).toBeNull();
    });

    it("rejeita valor nao-string", () => {
      expect(parseVideoEmbedUrl(null)).toBeNull();
      expect(parseVideoEmbedUrl(undefined)).toBeNull();
      expect(parseVideoEmbedUrl(42)).toBeNull();
    });

    it("rejeita URL de dominio desconhecido", () => {
      expect(parseVideoEmbedUrl("https://dailymotion.com/video/abc")).toBeNull();
    });

    it("rejeita URL sem protocolo https/http", () => {
      expect(parseVideoEmbedUrl("ftp://youtube.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    });

    it("rejeita URL malformada", () => {
      expect(parseVideoEmbedUrl("nao-e-uma-url")).toBeNull();
    });
  });
});

describe("getVideoEmbedSrc", () => {
  it("gera URL youtube-nocookie para YouTube", () => {
    const src = getVideoEmbedSrc({ id: "dQw4w9WgXcQ", provider: "youtube" });
    expect(src).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });

  it("gera URL do player Vimeo", () => {
    const src = getVideoEmbedSrc({ id: "123456789", provider: "vimeo" });
    expect(src).toBe("https://player.vimeo.com/video/123456789");
  });
});

describe("normalizeVideoAspectRatio", () => {
  it("retorna 16:9 como padrao para valor desconhecido", () => {
    expect(normalizeVideoAspectRatio("21:9")).toBe("16:9");
    expect(normalizeVideoAspectRatio(null)).toBe("16:9");
    expect(normalizeVideoAspectRatio(undefined)).toBe("16:9");
  });

  it("retorna 4:3 quando informado", () => {
    expect(normalizeVideoAspectRatio("4:3")).toBe("4:3");
  });

  it("retorna 1:1 quando informado", () => {
    expect(normalizeVideoAspectRatio("1:1")).toBe("1:1");
  });

  it("retorna 16:9 quando informado", () => {
    expect(normalizeVideoAspectRatio("16:9")).toBe("16:9");
  });
});

describe("normalizeVideoProvider", () => {
  it("retorna youtube para valor valido", () => {
    expect(normalizeVideoProvider("youtube")).toBe("youtube");
  });

  it("retorna vimeo para valor valido", () => {
    expect(normalizeVideoProvider("vimeo")).toBe("vimeo");
  });

  it("retorna null para valor desconhecido", () => {
    expect(normalizeVideoProvider("dailymotion")).toBeNull();
    expect(normalizeVideoProvider(null)).toBeNull();
    expect(normalizeVideoProvider(undefined)).toBeNull();
  });
});


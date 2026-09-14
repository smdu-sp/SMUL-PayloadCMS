export type VideoProvider = "youtube" | "vimeo";
export type VideoAspectRatio = "16:9" | "4:3" | "1:1";

export type ParsedVideoEmbed = {
  id: string;
  provider: VideoProvider;
};

const youtubeHosts = new Set([
  "m.youtube.com",
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "youtu.be",
]);

const youtubeIdPattern = /^[A-Za-z0-9_-]{11}$/;
const vimeoIdPattern = /^\d+$/;

function firstPathSegment(url: URL): string | null {
  return url.pathname.split("/").filter(Boolean)[0] ?? null;
}

export function parseVideoEmbedUrl(value: unknown): ParsedVideoEmbed | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed || trimmed.includes("<") || trimmed.includes(">")) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.toLowerCase();

  if (youtubeHosts.has(host)) {
    const id =
      host === "youtu.be"
        ? firstPathSegment(url)
        : url.searchParams.get("v") ??
          (["embed", "shorts", "live"].includes(firstPathSegment(url) ?? "")
            ? url.pathname.split("/").filter(Boolean)[1]
            : null);

    return id && youtubeIdPattern.test(id)
      ? { id, provider: "youtube" }
      : null;
  }

  if (host === "vimeo.com" || host === "www.vimeo.com") {
    const id = firstPathSegment(url);
    return id && vimeoIdPattern.test(id) ? { id, provider: "vimeo" } : null;
  }

  if (host === "player.vimeo.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    const id = parts[0] === "video" ? parts[1] : null;
    return id && vimeoIdPattern.test(id) ? { id, provider: "vimeo" } : null;
  }

  return null;
}

export function getVideoEmbedSrc(parsed: ParsedVideoEmbed): string {
  if (parsed.provider === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${parsed.id}`;
  }

  return `https://player.vimeo.com/video/${parsed.id}`;
}

export function normalizeVideoAspectRatio(
  aspectRatio: VideoAspectRatio | string | null | undefined,
): VideoAspectRatio {
  if (aspectRatio === "4:3" || aspectRatio === "1:1") return aspectRatio;
  return "16:9";
}

export function normalizeVideoProvider(
  provider: VideoProvider | string | null | undefined,
): VideoProvider | null {
  if (provider === "youtube" || provider === "vimeo") return provider;
  return null;
}

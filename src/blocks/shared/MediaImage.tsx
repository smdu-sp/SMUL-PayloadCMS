import Image from "next/image";
import type { Media } from "../../payload-types";

const localizeMediaUrl = (url: string): string => {
  try {
    const mediaUrl = new URL(url);
    const isLocalPayloadMedia =
      ["localhost", "127.0.0.1"].includes(mediaUrl.hostname) &&
      mediaUrl.pathname.startsWith("/api/media/file/");

    if (isLocalPayloadMedia) {
      return `${mediaUrl.pathname}${mediaUrl.search}`;
    }

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    if (serverUrl) {
      const appUrl = new URL(serverUrl);

      if (mediaUrl.origin === appUrl.origin) {
        return `${mediaUrl.pathname}${mediaUrl.search}`;
      }
    }
  } catch {
    return url;
  }

  return url;
};

export function MediaImage({
  className,
  fill = false,
  media,
  priority,
  preload,
  sizes = "100vw",
}: {
  className?: string;
  fill?: boolean;
  media?: Media | number | null;
  preload?: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  if (!media || typeof media !== "object" || !media.url) return null;

  const src = localizeMediaUrl(media.url);
  const eager = preload ?? priority;

  if (fill) {
    return (
      <Image
        alt={media.alt}
        className={className}
        fill
        preload={eager}
        sizes={sizes}
        src={src}
      />
    );
  }

  return (
    <Image
      alt={media.alt}
      className={className}
      height={media.height || 900}
      preload={eager}
      sizes={sizes}
      src={src}
      width={media.width || 1200}
    />
  );
}


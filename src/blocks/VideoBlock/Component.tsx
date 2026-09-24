import { BlockThemeScope, Container, Heading, Section, Text } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import {
  normalizeColorScheme,
  type EditorialColorOverrides,
} from "../../lib/theme/block-color-theme";
import type { VideoAspectRatio, VideoProvider } from "./video-embed";
import {
  getVideoEmbedSrc,
  normalizeVideoAspectRatio,
  parseVideoEmbedUrl,
} from "./video-embed";

export type VideoBlockProps = {
  appearance?: {
    colors?: EditorialColorOverrides | null;
    scheme?: "custom" | string | null;
  } | null;
  aspectRatio?: VideoAspectRatio | string | null;
  blockType: "videoBlock";
  caption?: string | null;
  id?: string | null;
  provider?: VideoProvider | string | null;
  title?: string | null;
  url?: string | null;
};

const aspectRatioClasses: Record<VideoAspectRatio, string> = {
  "1:1": "aspect-square",
  "4:3": "aspect-[4/3]",
  "16:9": "aspect-video",
};

export function VideoBlock({
  appearance,
  aspectRatio,
  caption,
  title,
  url,
}: VideoBlockProps) {
  const parsed = parseVideoEmbedUrl(url);
  if (!parsed) return null;

  const normalizedAspectRatio = normalizeVideoAspectRatio(aspectRatio);
  const iframeTitle = title?.trim() || "Video incorporado";
  const customTheme = appearance?.scheme === "custom";

  const section = (
    <Section
      spacing="default"
      scheme={customTheme ? "default" : normalizeColorScheme(appearance?.scheme)}
    >
      <Container size="lg">
        {title ? (
          <div className="mb-5">
            <Heading level={2} size="lg">
              <span className="text-balance break-words">{title}</span>
            </Heading>
          </div>
        ) : null}

        <div
          className={classNames(
            "overflow-hidden rounded-lg border border-border bg-muted",
            aspectRatioClasses[normalizedAspectRatio],
          )}
        >
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            src={getVideoEmbedSrc(parsed)}
            title={iframeTitle}
          />
        </div>

        {caption ? (
          <div className="mt-3 text-center">
            <Text variant="small">
              <span className="break-words">{caption}</span>
            </Text>
          </div>
        ) : null}
      </Container>
    </Section>
  );

  return customTheme
    ? <BlockThemeScope palette={appearance?.colors}>{section}</BlockThemeScope>
    : section;
}

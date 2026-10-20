import type { Media } from "../../payload-types";
import type { ImagePresentationSize } from "../../fields/image-presentation";
import { classNames } from "../../components/ui/classNames";
import {
  getFocalPointStyle,
  getImagePresentationAspectRatio,
  getImagePresentationClassName,
  getImagePresentationFitClassName,
  type ImagePresentation,
} from "./image-presentation";
import { MediaImage } from "./MediaImage";

export function PresentedMediaImage({
  className,
  imageClassName,
  media,
  presentation,
  priority,
  sizeClassNames,
  sizes,
}: {
  className?: string;
  imageClassName?: string;
  media?: Media | number | null;
  presentation?: ImagePresentation;
  priority?: boolean;
  sizeClassNames?: Partial<Record<ImagePresentationSize, string>>;
  sizes?: string;
}) {
  if (!media || typeof media !== "object" || !media.url) return null;

  const hasFrame = presentation?.aspectRatio !== "original" || Boolean(presentation?.canvas);
  if (!hasFrame) {
    return (
      <MediaImage
        className={classNames(
          "h-auto",
          getImagePresentationClassName(presentation, { sizeClassNames }),
          className,
          imageClassName,
        )}
        media={media}
        priority={priority}
        sizes={sizes}
      />
    );
  }

  return (
    <div
      className={classNames(
        "relative overflow-hidden",
        getImagePresentationClassName(presentation, { sizeClassNames }),
        className,
      )}
      style={{ aspectRatio: getImagePresentationAspectRatio(presentation, media) }}
    >
      <MediaImage
        className={classNames(
          getImagePresentationFitClassName(presentation) || "object-cover",
          imageClassName,
        )}
        fill
        media={media}
        priority={priority}
        sizes={sizes}
        style={getFocalPointStyle(media, presentation)}
      />
    </div>
  );
}

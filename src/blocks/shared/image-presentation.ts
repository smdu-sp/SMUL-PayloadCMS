import type {
  ImagePresentationAspectRatio,
  ImagePresentationFit,
  ImagePresentationSize,
} from "../../fields/image-presentation";

export type ImagePresentation = {
  size?: ImagePresentationSize | null;
  aspectRatio?: ImagePresentationAspectRatio | null;
  fit?: ImagePresentationFit | null;
} | null | undefined;

type ImagePresentationClassNameOptions = {
  sizeClassNames?: Partial<Record<ImagePresentationSize, string>>;
};

const SIZE_CLASSNAMES: Record<ImagePresentationSize, string> = {
  small: "w-full lg:max-w-xs lg:mx-auto",
  medium: "w-full lg:max-w-md lg:mx-auto",
  large: "w-full lg:max-w-2xl lg:mx-auto",
  full: "w-full",
};

const ASPECT_CLASSNAMES: Record<ImagePresentationAspectRatio, string> = {
  original: "",
  "1:1": "aspect-square",
  "4:3": "aspect-[4/3]",
  "16:9": "aspect-video",
  portrait: "aspect-[3/4]",
};

const FIT_CLASSNAMES: Record<ImagePresentationFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
};

export function getImagePresentationClassName(
  presentation: ImagePresentation,
  options?: ImagePresentationClassNameOptions,
): string {
  const size = presentation?.size ?? "full";
  const aspectRatio = presentation?.aspectRatio ?? "16:9";
  const fit = aspectRatio === "original" ? null : presentation?.fit ?? "cover";
  const sizeClassNames = {
    ...SIZE_CLASSNAMES,
    ...options?.sizeClassNames,
  };

  return [
    sizeClassNames[size],
    ASPECT_CLASSNAMES[aspectRatio],
    fit ? FIT_CLASSNAMES[fit] : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function getFocalPointStyle(
  media: { focalX?: number | null; focalY?: number | null } | null | undefined,
  presentation: ImagePresentation,
): { objectPosition?: string } {
  const aspectRatio = presentation?.aspectRatio ?? "16:9";
  const fit = aspectRatio === "original" ? null : presentation?.fit ?? "cover";

  if (fit !== "cover") return {};
  if (typeof media?.focalX !== "number" || typeof media?.focalY !== "number") {
    return {};
  }

  return { objectPosition: `${media.focalX}% ${media.focalY}%` };
}

import type { Media } from "../../payload-types";
import { Icon, type IconSize, type IconTone } from "../../components/ui";
import { MediaImage } from "./MediaImage";

export type BlockIconProps = {
  ariaLabel?: string;
  className?: string;
  icon?: (number | null) | Media;
  iconSource?: "custom" | "none" | "standard" | string | null;
  size?: IconSize;
  sizes?: string;
  standardIcon?: string | null;
  tone?: IconTone;
};

export function BlockIcon({
  ariaLabel,
  className,
  icon,
  iconSource,
  size,
  sizes,
  standardIcon,
  tone,
}: BlockIconProps) {
  if (iconSource === "none") {
    return null;
  }

  const isExplicitCustom = iconSource === "custom";
  const isExplicitStandard = iconSource === "standard";

  // If explicit standard, render Icon when standardIcon is present
  if (isExplicitStandard) {
    if (!standardIcon) return null;
    return (
      <Icon
        ariaLabel={ariaLabel}
        className={className}
        name={standardIcon}
        size={size}
        tone={tone}
      />
    );
  }

  // If explicit custom, render MediaImage when icon is present
  if (isExplicitCustom) {
    if (!icon) return null;
    return (
      <MediaImage
        className={className}
        media={icon}
        sizes={sizes}
      />
    );
  }

  // Legacy fallback: if standardIcon is set, use it; otherwise if icon media is set, use it
  if (standardIcon) {
    return (
      <Icon
        ariaLabel={ariaLabel}
        className={className}
        name={standardIcon}
        size={size}
        tone={tone}
      />
    );
  }

  if (icon) {
    return (
      <MediaImage
        className={className}
        media={icon}
        sizes={sizes}
      />
    );
  }

  return null;
}

import type { SVGProps } from "react";
import {
  type StandardIconName,
  normalizeStandardIcon,
} from "../../domain/icons.ts";
import { classNames } from "./classNames.ts";

export type IconSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type IconTone =
  | "accent"
  | "current"
  | "danger"
  | "default"
  | "muted"
  | "primary"
  | "secondary"
  | "success"
  | "warning";

export type IconProps = {
  /**
   * Accessible description when the icon communicates standalone meaning.
   * When provided, the icon is announced by assistive technologies with role="img".
   * When omitted, the icon is treated as decorative (aria-hidden="true").
   */
  ariaLabel?: string;
  className?: string;
  name: StandardIconName | string | null | undefined;
  size?: IconSize;
  tone?: IconTone;
} & Omit<SVGProps<SVGSVGElement>, "name">;

const sizeClasses: Record<IconSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
  "2xl": "h-10 w-10",
  "3xl": "h-12 w-12",
};

const sizePixelMap: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
};

const toneClasses: Record<IconTone, string> = {
  accent: "text-accent-foreground",
  current: "text-current",
  danger: "text-danger",
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-success",
  warning: "text-warning",
};

function InfoGlyph() {
  return (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </>
  );
}

function WarningGlyph() {
  return (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  );
}

function DocumentGlyph() {
  return (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </>
  );
}

function BuildingGlyph() {
  return (
    <>
      <rect height="20" rx="2" ry="2" width="16" x="4" y="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </>
  );
}

function LocationGlyph() {
  return (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  );
}

function PhoneGlyph() {
  return (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  );
}

function EmailGlyph() {
  return (
    <>
      <rect height="16" rx="2" width="20" x="2" y="4" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  );
}

function CheckGlyph() {
  return <polyline points="20 6 9 17 4 12" />;
}

function ArrowGlyph() {
  return (
    <>
      <line x1="5" x2="19" y1="12" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  );
}

function ExternalLinkGlyph() {
  return (
    <>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </>
  );
}

const glyphs: Record<StandardIconName, () => React.JSX.Element> = {
  arrow: ArrowGlyph,
  building: BuildingGlyph,
  check: CheckGlyph,
  document: DocumentGlyph,
  email: EmailGlyph,
  "external-link": ExternalLinkGlyph,
  info: InfoGlyph,
  location: LocationGlyph,
  phone: PhoneGlyph,
  warning: WarningGlyph,
};

export function Icon({
  ariaLabel,
  className,
  height,
  name,
  size = "lg",
  style,
  tone = "current",
  width,
  ...rest
}: IconProps) {
  const normalized = normalizeStandardIcon(name);
  const Glyph = glyphs[normalized];
  const isDecorative = !ariaLabel;
  const pixelSize = sizePixelMap[size];

  return (
    <svg
      aria-hidden={isDecorative ? "true" : undefined}
      aria-label={ariaLabel}
      className={classNames(
        "shrink-0",
        sizeClasses[size],
        toneClasses[tone],
        className,
      )}
      fill="none"
      focusable="false"
      height={height ?? pixelSize}
      role={isDecorative ? undefined : "img"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      style={{
        height: typeof height === "number" ? `${height}px` : height ?? `${pixelSize}px`,
        width: typeof width === "number" ? `${width}px` : width ?? `${pixelSize}px`,
        ...style,
      }}
      viewBox="0 0 24 24"
      width={width ?? pixelSize}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Glyph />
    </svg>
  );
}

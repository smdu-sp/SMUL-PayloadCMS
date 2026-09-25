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
  accent: "text-[var(--block-accent)]",
  current: "text-current",
  danger: "text-danger",
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

function HomeGlyph() {
  return (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </>
  );
}

function UsersGlyph() {
  return (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  );
}

function ImageGlyph() {
  return (
    <>
      <rect height="18" rx="2" width="20" x="2" y="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </>
  );
}

function PanelTopGlyph() {
  return (
    <>
      <rect height="18" rx="2" width="20" x="2" y="3" />
      <path d="M2 9h20" />
    </>
  );
}

function PanelBottomGlyph() {
  return (
    <>
      <rect height="18" rx="2" width="20" x="2" y="3" />
      <path d="M2 15h20" />
    </>
  );
}

function SettingsGlyph() {
  return (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6h.08A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.12.6.65 1.03 1.26 1.03H21a2 2 0 1 1 0 4h-.09A1.65 1.65 0 0 0 19.4 15Z" />
    </>
  );
}

function HistoryGlyph() {
  return (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l3 2" />
    </>
  );
}

function ShapesGlyph() {
  return (
    <>
      <circle cx="8" cy="8" r="5" />
      <rect height="9" rx="1" width="9" x="11" y="11" />
    </>
  );
}

function LogOutGlyph() {
  return (
    <>
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
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
  history: HistoryGlyph,
  home: HomeGlyph,
  image: ImageGlyph,
  info: InfoGlyph,
  location: LocationGlyph,
  "log-out": LogOutGlyph,
  "panel-bottom": PanelBottomGlyph,
  "panel-top": PanelTopGlyph,
  phone: PhoneGlyph,
  settings: SettingsGlyph,
  shapes: ShapesGlyph,
  users: UsersGlyph,
  warning: WarningGlyph,
};

export function Icon({
  ariaLabel,
  className,
  height,
  name,
  size = "lg",
  style,
  tone = "accent",
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

import type { ReactNode } from "react";

import { classNames } from "./classNames";

const headingSizes = {
  md: "text-heading-md",
  lg: "text-heading-lg",
  display: "text-display-md sm:text-display-lg",
} as const;

const headingTones = {
  default: "text-heading",
  inverse: "text-secondary-foreground",
  accent: "text-accent",
} as const;

const headingAlignments = {
  end: "text-right",
  start: "text-left",
  center: "text-center",
} as const;

export type HeadingLevel = 1 | 2 | 3 | 4;
export type HeadingSize = keyof typeof headingSizes;
export type HeadingTone = keyof typeof headingTones;

type HeadingProps = {
  align?: keyof typeof headingAlignments;
  children: ReactNode;
  level?: HeadingLevel;
  size?: HeadingSize;
  tone?: HeadingTone;
};

export function Heading({
  align = "start",
  children,
  level = 2,
  size = "lg",
  tone = "default",
}: HeadingProps) {
  const Component = `h${level}` as const;

  return (
    <Component
      className={classNames(
        "font-heading font-semibold leading-tight",
        headingSizes[size],
        headingTones[tone],
        headingAlignments[align],
      )}
    >
      {children}
    </Component>
  );
}

import type { ReactNode } from "react";

import { classNames } from "./classNames";

const cardTones = {
  default: "border border-border bg-surface text-foreground",
  surface: "border border-border bg-surface text-foreground",
  muted: "border border-border bg-muted text-foreground",
  accent: "border border-border bg-accent text-accent-foreground",
  brand: "bg-secondary text-secondary-foreground",
} as const;

const cardPaddings = {
  sm: "p-5",
  md: "p-6",
  lg: "p-8",
} as const;

export type CardTone = keyof typeof cardTones;
export type CardPadding = keyof typeof cardPaddings;

type CardProps = {
  children: ReactNode;
  fullHeight?: boolean;
  interactive?: boolean;
  padding?: CardPadding;
  tone?: CardTone;
};

export function Card({
  children,
  fullHeight = false,
  interactive = false,
  padding = "md",
  tone = "surface",
}: CardProps) {
  return (
    <div
      className={classNames(
        "flex flex-col overflow-hidden rounded-lg",
        cardPaddings[padding],
        cardTones[tone],
        fullHeight && "h-full",
        interactive && "transition-colors hover:border-primary",
      )}
    >
      {children}
    </div>
  );
}

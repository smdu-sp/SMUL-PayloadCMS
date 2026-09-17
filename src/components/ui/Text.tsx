import type { ReactNode } from "react";

import { classNames } from "./classNames";

const textVariants = {
  body: "text-base leading-relaxed",
  lead: "text-lg leading-relaxed",
  small: "text-sm leading-normal",
  muted: "text-base leading-relaxed",
} as const;

const textTones = {
  default: "text-[var(--block-foreground)]",
  accent: "text-[var(--block-accent)]",
} as const;

const textWeights = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

export type TextTone = keyof typeof textTones;
export type TextVariant = keyof typeof textVariants;
export type TextWeight = keyof typeof textWeights;

type TextProps = {
  as?: "p" | "span";
  children: ReactNode;
  tone?: TextTone;
  transform?: "uppercase";
  variant?: TextVariant;
  weight?: TextWeight;
};

export function Text({
  as: Component = "p",
  children,
  tone = "default",
  transform,
  variant = "body",
  weight = "normal",
}: TextProps) {
  return (
    <Component
      className={classNames(
        textVariants[variant],
        textTones[tone],
        textWeights[weight],
        transform === "uppercase" && "uppercase",
      )}
    >
      {children}
    </Component>
  );
}

import type { ReactNode } from "react";
import type { ColorScheme, EditorialColorOverrides } from "../../lib/theme/block-color-theme";
import { ColorScope } from "./ColorScope";
import { classNames } from "./classNames";

const cardPaddings = { sm: "p-5", md: "p-6", lg: "p-8" } as const;
export type CardPadding = keyof typeof cardPaddings;
type CardProps = {
  children: ReactNode;
  className?: string;
  scheme?: ColorScheme | "inherit";
  overrides?: EditorialColorOverrides | null;
  fullHeight?: boolean;
  padding?: CardPadding;
};

export function Card({
  children,
  className,
  scheme = "surface",
  overrides,
  fullHeight = false,
  padding = "md",
}: CardProps) {
  return (
    <ColorScope
      scheme={scheme}
      overrides={overrides}
      className={classNames(
        "flex flex-col overflow-hidden rounded-lg border border-border",
        cardPaddings[padding],
        fullHeight && "h-full",
        className,
      )}
    >
      {children}
    </ColorScope>
  );
}

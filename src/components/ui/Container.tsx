import type { ReactNode } from "react";

import { classNames } from "./classNames";

const containerSizes = {
  narrow: "max-w-container-sm",
  default: "max-w-container-lg",
  wide: "max-w-container-xl",
  full: "max-w-none",
  sm: "max-w-container-sm",
  md: "max-w-container-md",
  lg: "max-w-container-lg",
  xl: "max-w-container-xl",
} as const;

export type ContainerSize = keyof typeof containerSizes;

type ContainerProps = {
  as?: "div" | "section";
  children: ReactNode;
  size?: ContainerSize;
};

export function Container({
  as: Component = "div",
  children,
  size = "lg",
}: ContainerProps) {
  return (
    <Component
      className={classNames(
        "mx-auto w-full px-container sm:px-container-wide",
        containerSizes[size],
      )}
    >
      {children}
    </Component>
  );
}

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { classNames } from "./classNames";

const buttonVariants = {
  solid: "bg-[var(--block-action)] text-[var(--block-action-foreground)] border border-transparent hover:underline",
  outline: "border border-current bg-transparent text-[var(--block-foreground)] hover:underline",
  ghost: "bg-transparent text-[var(--block-foreground)] hover:underline",
} as const;

const buttonSizes = {
  sm: "min-h-9 px-3 py-2 text-sm",
  md: "min-h-11 px-5 py-3 text-base",
  lg: "min-h-12 px-6 py-3 text-lg",
} as const;

export type ButtonSize = keyof typeof buttonSizes;
export type ButtonVariant = keyof typeof buttonVariants;

type SharedButtonProps = {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

type ButtonAsButtonProps = SharedButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
  };

type ButtonAsLinkProps = SharedButtonProps & {
  href: string;
  rel?: string;
  target?: "_blank";
};

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button({
  children,
  size = "md",
  variant = "solid",
  ...props
}: ButtonProps) {
  const className = classNames(
    "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-50",
    buttonVariants[variant],
    buttonSizes[size],
  );

  if ("href" in props && props.href) {
    return (
      <Link
        className={className}
        href={props.href}
        rel={props.rel}
        target={props.target}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

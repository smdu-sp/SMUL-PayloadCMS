import type { ReactNode } from "react";
import { classNames } from "./classNames";

export const statusVariants = ["info", "success", "warning", "danger"] as const;
export type StatusVariant = (typeof statusVariants)[number];

const statusContent: Record<StatusVariant, { icon: string; label: string; marker: string }> = {
  info: { icon: "i", label: "Informacao", marker: "bg-info" },
  success: { icon: "OK", label: "Sucesso", marker: "bg-success" },
  warning: { icon: "!", label: "Atencao", marker: "bg-warning" },
  danger: { icon: "X", label: "Erro", marker: "bg-danger" },
};

export function normalizeStatusVariant(
  value?: string | null,
  fallback: StatusVariant = "info",
): StatusVariant {
  return statusVariants.includes(value as StatusVariant) ? value as StatusVariant : fallback;
}

export function Status({
  children,
  className,
  title,
  variant = "info",
}: {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  variant?: StatusVariant;
}) {
  const status = statusContent[variant];

  return (
    <div
      className={classNames(
        "rounded-lg border border-[var(--block-border)] bg-[var(--block-background)] p-6 text-[var(--block-foreground)]",
        className,
      )}
      data-status={variant}
    >
      <div className="flex gap-4">
        <span
          aria-hidden="true"
          className={classNames(
            "mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[var(--color-background)]",
            status.marker,
          )}
        >
          {status.icon}
        </span>
        <div className="min-w-0">
          <p className="sr-only">{status.label}</p>
          {title ? <div>{title}</div> : null}
          <div className={title ? "mt-4" : ""}>{children}</div>
        </div>
      </div>
    </div>
  );
}

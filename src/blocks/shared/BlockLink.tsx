import Link from "next/link";
import { Button, type ButtonSize, type ButtonVariant } from "../../components/ui";
import { resolveLink, type NavigationLink } from "../../lib/navigation/resolve-link";

export type LinkValue = NavigationLink;

type BlockLinkAppearance = "text" | ButtonVariant;

export function BlockLink({
  appearance = "text",
  link,
  size = "md",
}: {
  appearance?: BlockLinkAppearance;
  link?: LinkValue | null;
  size?: ButtonSize;
}) {
  const resolvedLink = resolveLink(link);
  if (!resolvedLink) return null;

  if (appearance !== "text") {
    return (
      <Button
        href={resolvedLink.href}
        rel={resolvedLink.rel}
        size={size}
        target={resolvedLink.target}
        variant={appearance}
      >
        {resolvedLink.label}
      </Button>
    );
  }

  return (
    <Link
      className="font-semibold text-[var(--block-foreground)] underline decoration-2 underline-offset-4 hover:decoration-4"
      href={resolvedLink.href}
      rel={resolvedLink.rel}
      target={resolvedLink.target}
    >
      {resolvedLink.label}
    </Link>
  );
}


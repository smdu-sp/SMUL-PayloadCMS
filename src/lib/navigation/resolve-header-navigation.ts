import type { Header, Page } from "../../payload-types";
import { resolveLink, type ResolvedLink } from "./resolve-link";

export type ResolvedHeaderLink = ResolvedLink & {
  id: string;
};

export type ResolvedHeaderItem =
  | {
      id: string;
      kind: "category";
      label: string;
      links: ResolvedHeaderLink[];
    }
  | {
      kind: "link";
      link: ResolvedHeaderLink;
    };

export type ResolvedHeaderNavigation = {
  items: ResolvedHeaderItem[];
  mode: "normal" | "submenus";
};

function resolveInternalLink(
  label: string | null | undefined,
  page: number | Page | null | undefined,
  id: string,
): ResolvedHeaderLink | null {
  const normalizedLabel = label?.trim();
  if (!normalizedLabel) return null;

  const link = resolveLink({
    label: normalizedLabel,
    page,
    type: "internal",
  });

  return link ? { ...link, id } : null;
}

function resolveNormalItems(header?: Header | null): ResolvedHeaderItem[] {
  return (header?.navigation ?? []).flatMap((item, index) => {
    const link = resolveInternalLink(
      item.label,
      item.page,
      item.id ?? `normal-${index}`,
    );

    return link ? [{ kind: "link" as const, link }] : [];
  });
}

export function resolveHeaderNavigation(
  header?: Header | null,
): ResolvedHeaderNavigation {
  const normalItems = resolveNormalItems(header);

  if (header?.navigationMode !== "submenus") {
    return { items: normalItems, mode: "normal" };
  }

  const submenuItems: ResolvedHeaderItem[] = [];

  (header.menuItems ?? []).forEach((item, itemIndex) => {
    const itemId = item.id ?? `submenu-${itemIndex}`;

    if (item.type === "category") {
      const label = item.label.trim();
      const links = (item.links ?? []).flatMap((child, childIndex) => {
        const link = resolveInternalLink(
          child.label,
          child.page,
          child.id ?? `${itemId}-link-${childIndex}`,
        );
        return link ? [link] : [];
      });

      if (label && links.length) {
        submenuItems.push({ id: itemId, kind: "category", label, links });
      }
      return;
    }

    const link = resolveInternalLink(item.label, item.page ?? null, itemId);
    if (link) submenuItems.push({ kind: "link", link });
  });

  return submenuItems.length
    ? { items: submenuItems, mode: "submenus" }
    : { items: normalItems, mode: "normal" };
}

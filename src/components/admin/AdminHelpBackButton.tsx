"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const subscribeToHydration = () => () => {};

export function resolveAdminBackHref(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "admin" && segments[1] === "collections" && segments[2]) {
    return `/admin/collections/${segments[2]}`;
  }

  if (segments[0] === "admin" && segments[1] === "globals" && segments[2]) {
    return `/admin/globals/${segments[2]}`;
  }

  return "/admin";
}

export function AdminHelpBackButton() {
  const pathname = usePathname();
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const href = hydrated ? resolveAdminBackHref(pathname) : "/admin";

  return (
    <Link aria-label="Voltar" className="admin-help__back-button" href={href} rel="noopener noreferrer" target="_self">
      <span aria-hidden="true">&larr;</span>
    </Link>
  );
}

"use client";

import Link from "next/link";

function getCollectionListHref(): string {
  if (typeof window === "undefined") {
    return "/admin";
  }

  const segments = window.location.pathname.split("/").filter(Boolean);

  if (segments[0] === "admin" && segments[1] === "collections" && segments[2]) {
    return `/admin/collections/${segments[2]}`;
  }

  if (segments[0] === "admin" && segments[1] === "globals" && segments[2]) {
    return `/admin/globals/${segments[2]}`;
  }

  return "/admin";
}

export function AdminHelpBackButton() {
  const href = getCollectionListHref();

  return (
    <Link aria-label="Voltar" className="admin-help__back-button" href={href} rel="noopener noreferrer" target="_self">
      <span aria-hidden="true">&larr;</span>
    </Link>
  );
}

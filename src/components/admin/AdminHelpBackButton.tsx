"use client";

import Link from "next/link";

export function AdminHelpBackButton() {
  return (
    <Link aria-label="Voltar" className="admin-help__back-button" href="/admin" rel="noopener noreferrer" target="_self">
      <span aria-hidden="true">&larr;</span>
    </Link>
  );
}

// src/components/admin/CustomNav.tsx
"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import type { StandardIconName } from "../../domain/icons";
import { Icon } from "../ui/Icon";

type NavItem = {
  href: string;
  icon: StandardIconName;
  label: string;
};

const collectionItems: NavItem[] = [
  { href: "/admin/collections/users", icon: "users", label: "Usuários" },
  { href: "/admin/collections/media", icon: "image", label: "Mídias" },
  { href: "/admin/collections/pages", icon: "document", label: "Páginas" },
];

const globalItems: NavItem[] = [
  { href: "/admin/globals/header", icon: "panel-top", label: "Cabeçalho" },
  { href: "/admin/globals/footer", icon: "panel-bottom", label: "Rodapé" },
  {
    href: "/admin/globals/site-settings",
    icon: "settings",
    label: "Configurações do site",
  },
];

const governanceItems: NavItem[] = [
  {
    href: "/admin/collections/audit-logs",
    icon: "history",
    label: "Logs de auditoria",
  },
  { href: "/admin/ajuda", icon: "info", label: "Ajuda" },
  { href: "/admin/icones", icon: "shapes", label: "Ícones" },
];

function NavLink({ href, icon, label }: NavItem) {
  return (
    <Link className="nav-link" href={href}>
      <Icon className="nav-link__icon" name={icon} size="sm" tone="current" />
      <span>{label}</span>
    </Link>
  );
}

function NavSection({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="nav-section">
      <span className="nav-label">{label}</span>
      {children}
    </div>
  );
}

export const CustomNav: React.FC = () => {
  return (
    <aside className="modern-nav">
      <div className="nav-home">
        <NavLink href="/admin" icon="home" label="Menu Principal" />
      </div>

      <NavSection label="Collections">
        {collectionItems.map((item) => <NavLink key={item.href} {...item} />)}
      </NavSection>

      <NavSection label="Globals">
        {globalItems.map((item) => <NavLink key={item.href} {...item} />)}
      </NavSection>

      <NavSection label="Governança">
        {governanceItems.map((item) => <NavLink key={item.href} {...item} />)}
      </NavSection>

      <div className="nav-footer">
        <Link href="/admin/logout" className="nav-link link-danger">
          <Icon className="nav-link__icon" name="log-out" size="sm" tone="current" />
          <span>Sair da conta</span>
        </Link>
      </div>
    </aside>
  );
};

export default CustomNav;

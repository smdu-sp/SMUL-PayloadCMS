// src/components/admin/CustomNav.tsx
'use client'

import React from 'react'
import Link from 'next/link'

export const CustomNav: React.FC = () => {
  return (
    <aside className="modern-nav">
      {/* MENU PRINCIPAL (Igual aos outros campos) */}
      <div style={{ marginBottom: '16px' }}>
        <Link href="/admin" className="nav-link">
          Menu Principal
        </Link>
      </div>

      {/* COLLECTIONS */}
      <div className="nav-section">
        <span className="nav-label">Collections</span>
        <Link href="/admin/collections/users" className="nav-link">Usuários</Link>
        <Link href="/admin/collections/media" className="nav-link">Mídias</Link>
        <Link href="/admin/collections/pages" className="nav-link">Páginas</Link>
      </div>

      {/* GLOBALS */}
      <div className="nav-section">
        <span className="nav-label">Globals</span>
        <Link href="/admin/globals/header" className="nav-link">Cabeçalho</Link>
        <Link href="/admin/globals/footer" className="nav-link">Rodapé</Link>
        <Link href="/admin/globals/site-settings" className="nav-link">Configurações do site</Link>
      </div>

      {/* GOVERNANÇA */}
      <div className="nav-section">
        <span className="nav-label">Governança</span>
        <Link href="/admin/collections/audit-logs" className="nav-link">Logs de auditoria</Link>
        
        <div style={{ marginTop: '8px' }}>
          <Link href="/admin/ajuda" className="nav-link">Ajuda</Link>
          <Link href="/admin/icones" className="nav-link">Ícones</Link>
        </div>
      </div>

      {/* SAIR DA CONTA */}
      <div className="nav-footer">
        <Link href="/admin/logout" className="nav-link link-danger">
          Sair da conta
        </Link>
      </div>
    </aside>
  )
}

export default CustomNav
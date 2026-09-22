'use client'

import React from 'react'

type ViewPageButtonProps = {
  rowData?: {
    slug?: string | null
  }
}

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const ViewPageButton: React.FC<ViewPageButtonProps> = ({ rowData }) => {
  const slug = rowData?.slug

  if (!slug) return null

  // Trata 'home' ou '/' para redirecionar para a raiz do site
  const formattedSlug = slug === 'home' || slug === '/' ? '' : slug
  const finalUrl = `${serverUrl}/${formattedSlug}`

  return (
    <a
      href={finalUrl}
      target="_blank"
      rel="noopener noreferrer"
      // Impede que o clique no botão abra a tela de edição da página no Payload
      onClick={(e) => e.stopPropagation()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 500,
        textDecoration: 'none',
        backgroundColor: 'var(--theme-elevation-150)',
        color: 'var(--theme-elevation-800)',
        border: '1px solid var(--theme-elevation-200)',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s ease',
      }}
    >
      Ver pagina 
    </a>
  )
}
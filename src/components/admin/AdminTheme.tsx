import { DEFAULT_THEME } from '../../lib/theme/default-theme';
import React from 'react';

/**
 * Camada visual institucional do Admin
 * Deriva as cores do theme oficial sem duplicar a fonte de verdade.
 * Baseada na cor principal #f94668 (Pink/Coral Vibrante)
 */
export const AdminTheme: React.FC = () => {
  const css = `
    /* 1. Tokens de Branding Institucionais */
    :root {
      --brand-primary: ${DEFAULT_THEME.primaryColor || '#0a3299'};
      --brand-secondary: ${DEFAULT_THEME.secondaryColor || '#0a3299'};
      --brand-accent: ${DEFAULT_THEME.accentColor || '#5cd6c9'};

      /* 2. Tokens Semânticos Base (Light) */
      --semantic-surface: #ffffff;
      --semantic-surface-muted: #f9fafb;
      --semantic-foreground: #111827;
      --semantic-muted: #6b7280;
      --semantic-border: #e5e7eb;

      /* 3. Estados */
      --state-success: #10b981;
      --state-alert: #f59e0b;
      --state-error: #ef4444;
    }

    [data-theme="dark"] {
      --semantic-surface: #0a0a0a;
      --semantic-surface-muted: #141414;
      --semantic-foreground: #f9fafb;
      --semantic-muted: #a3a3a3;
      --semantic-border: #262626;
    }

    /* 4. Camada Derivada do Admin (Payload Native overrides) */
    :root, [data-theme="light"] {
      --theme-bg: #edf2f7;
      --theme-text: var(--semantic-foreground);
      
      /* Escala de Elevações (Light) - mais escura para melhorar contraste */
      --theme-elevation-0: #edf2f7;
      --theme-elevation-50: #e7edf5;
      --theme-elevation-100: #dde7f1;
      --theme-elevation-150: #d0dae6;
      --theme-elevation-200: #bccad9;
      --theme-elevation-250: #95a6ba;
      --theme-elevation-300: #64768a;
      --theme-elevation-400: #4b5d73;
      --theme-elevation-500: #33465d;
      --theme-elevation-800: #1e293b;

      /* Estados */
      --theme-error-400: var(--state-error);
      --theme-error-500: #dc2626;
      --theme-success-400: var(--state-success);
      --theme-success-500: #059669;
      --theme-warning-400: var(--state-alert);
      --theme-warning-500: #d97706;

      /* Componentes Admin */
      --admin-brand-primary: var(--brand-primary);
      --admin-sidebar-bg: #e8edf5;
      --admin-sidebar-border: #d5deea;
      --admin-nav-item-active-bg: rgba(15, 23, 42, 0.10);
      --admin-nav-item-active-color: var(--theme-elevation-800);
      --admin-card-bg: var(--theme-elevation-50);
      --admin-card-border: var(--theme-elevation-200);
      --admin-input-bg: var(--theme-elevation-50);
      --admin-input-border: var(--theme-elevation-200);
    }

    [data-theme="dark"] {
      --theme-bg: var(--semantic-surface);
      --theme-text: var(--semantic-foreground);
      
      /* Escala de Elevações (Dark) - Neutral Grays to fix mismatch */
      --theme-elevation-0: #000000;
      --theme-elevation-50: #141414;
      --theme-elevation-100: #1f1f1f;
      --theme-elevation-150: #292929;
      --theme-elevation-200: #333333;
      --theme-elevation-250: #424242;
      --theme-elevation-300: #525252;
      --theme-elevation-400: #737373;
      --theme-elevation-500: #a3a3a3;
      --theme-elevation-800: #f5f5f5;

      /* Componentes Admin */
      --admin-brand-primary: #f94668;
      --admin-sidebar-bg: #0f0f0f;
      --admin-sidebar-border: var(--semantic-border);
      --admin-nav-item-active-bg: rgba(249, 70, 104, 0.15);
      --admin-nav-item-active-color: #ff6b87;
      --admin-card-bg: #141414;
      --admin-card-border: var(--semantic-border);
      --admin-input-bg: #0f0f0f;
      --admin-input-border: var(--semantic-border);
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

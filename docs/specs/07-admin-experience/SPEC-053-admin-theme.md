---
spec: SPEC-053
title: Admin Institutional Theme
status: planned
source: PAINEL-ADMIN-V2-SPECS-051-055.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades das Specs seguintes. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# 5. SPEC-053 — Admin Institutional Theme

## Objetivo

Definir um schema visual institucional padrão para o Admin.

---

## Problema

O projeto já possui Design System e Theme.

Criar uma segunda fonte de verdade apenas para o Admin geraria fragmentação.

Evitar:

```text
frontendPrimary
adminPrimary
loginPrimary
```

com valores independentes.

---

## Estratégia recomendada

Utilizar um núcleo institucional compartilhado.

```text
Institutional Tokens
        │
        ├── Public Frontend
        │
        └── Payload Admin
```

### Tokens de branding

Exemplo conceitual:

```text
brand.primary
brand.secondary
brand.accent
```

### Tokens semânticos

```text
surface.background
surface.foreground
surface.muted
surface.border

state.success
state.warning
state.danger
```

---

## Camada específica do Admin

Pode existir uma camada derivada:

```text
Admin Theme
├── sidebar
├── navigation
├── input
├── card
├── table
├── modal
└── login
```

Mas esses valores devem derivar da identidade institucional, não competir com ela.

---

## Relação recomendada

```text
SMUL / Institutional Identity
↓
Design Tokens
↓
Semantic Tokens
↓
Admin Theme
↓
Payload UI
```

---

## Critérios de aceite

- Admin possui identidade visual institucional.
- Theme não duplica desnecessariamente os tokens do frontend.
- Componentes usam tokens semânticos.
- Estados de sucesso, alerta e erro permanecem compreensíveis.
- Contraste é preservado.
- Login, menu e demais áreas consomem o mesmo sistema visual.

---

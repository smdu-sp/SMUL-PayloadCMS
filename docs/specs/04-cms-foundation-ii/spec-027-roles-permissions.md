---
spec: SPEC-027
title: Roles & Permissions
status: completed
source: SPECS-018-029-CMS-Foundation-II-ATUALIZADO.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# SPEC-027 — Roles & Permissions

## 1. Objetivo

Criar controle de acesso editorial mínimo.

## 2. Roles iniciais

Recomendação:

```text
admin
editor
```

Não criar RBAC complexo sem necessidade.

## 3. Matriz inicial

### Admin

Pode:

```text
Users
Pages
Media
Globals
Theme
SiteSettings
Navigation
```

### Editor

Pode:

```text
Pages
Media
alguns Globals editoriais
```

Não deve acessar:

```text
Users
configurações críticas
Theme sensível
```

A matriz final deve refletir necessidade real.

## 4. Passos

### Passo 1 — Adicionar role

Adicionar campo controlado em `Users`.

### Passo 2 — Criar access helpers

Exemplo:

```text
isAdmin
isEditor
adminOrEditor
```

### Passo 3 — Collections

Aplicar access control.

### Passo 4 — Globals

Aplicar access control.

### Passo 5 — Admin UI

Ocultar áreas sem permissão quando suportado.

### Passo 6 — Testes

Testar:

```text
admin
editor
não autenticado
```

## 5. Critérios de aceite

- [x] roles existem;
- [x] regras estão centralizadas;
- [x] editor não acessa Users;
- [x] acesso direto por API também respeita regras;
- [x] não depende só de esconder UI;
- [x] testes passam.

---

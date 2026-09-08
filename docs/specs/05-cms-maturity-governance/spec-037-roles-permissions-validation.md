---
spec: SPEC-037
title: Roles & Permissions Validation
status: planned
source: Specs030–041—MaturidadeEditorialeGovernançadoCMS.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# SPEC-037 — Roles & Permissions Validation

## Objetivo

Validar e formalizar o modelo:

```text
Admin
Editor
```

O foco não é simplesmente esconder menus.

A segurança deve existir também na API e no acesso direto ao Payload.

---

# Matriz de permissões

Criar documento:

```text
docs/cms/permissions.md
```

Com uma matriz semelhante:

| Recurso | Admin | Editor |
|---|---:|---:|
| Pages — visualizar | ✓ | ✓ |
| Pages — criar | ✓ | ✓ |
| Pages — editar | ✓ | ✓ |
| Pages — publicar | ✓ | definir |
| Pages — desativar | ✓ | definir |
| Media | ✓ | ✓ |
| Header | ✓ | definir |
| Footer | ✓ | definir |
| Theme | ✓ | ✗ |
| Users | ✓ | ✗ |
| Logs | ✓ | ✗ |

A decisão de `publicar` pelo Editor deve ser explícita.

Não assumir.

---

## Passos

### 1. Auditar access control atual

Verificar:

```text
Collections
Globals
Admin UI
Local API
REST/GraphQL se habilitados
```

### 2. Centralizar helpers

Exemplo:

```text
isAdmin
isEditor
adminOnly
editorOrAdmin
```

### 3. Testar Admin

### 4. Testar API

Esconder botão não conta como controle de acesso.

---

## Critérios de aceite

- [x] matriz foi aprovada.
- [x] regras estão centralizadas.
- [x] Editor não acessa Users.
- [x] Editor não acessa Logs.
- [x] Editor não altera configurações proibidas.
- [x] API respeita as mesmas regras.
- [x] testes de roles existem.

---

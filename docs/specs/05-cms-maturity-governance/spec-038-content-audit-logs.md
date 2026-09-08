---
spec: SPEC-038
title: Content Audit Logs
status: planned
source: Specs030–041—MaturidadeEditorialeGovernançadoCMS.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# SPEC-038 — Content Audit Logs

## Objetivo

Registrar:

```text
quem
fez o quê
em qual conteúdo
quando
```

com leitura exclusiva para Admin.

---

# Escopo inicial

Começar com:

```text
Pages
```

Depois avaliar expansão para:

```text
Globals
Media
Theme
```

Não fazer tudo imediatamente.

---

## Eventos mínimos

```text
create
update
publish
unpublish
deactivate
reactivate
```

Se hard delete for removido pela SPEC-039, ele não precisa ser evento normal de UI.

---

## Audit entry

Estrutura conceitual:

```text
AuditLog
├── actor
├── action
├── collection
├── documentId
├── documentTitle
├── timestamp
├── version?
└── changedFields?
```

---

## Não duplicar versões completas sem necessidade

Se Payload Versions já guarda snapshots do documento:

```text
Audit Log
→ evento

Payload Version
→ estado do conteúdo
```

Essa separação evita banco inflado e duas fontes concorrentes de histórico.

---

## changedFields

Se tecnicamente viável, armazenar:

```text
title
slug
layout
seo
...
```

como lista de campos modificados.

Não é obrigatório armazenar todo `before/after` no AuditLog.

---

## Imutabilidade

Usuário comum não pode:

- editar log;
- apagar log;
- criar log manualmente.

---

## Admin

Criar tela/listagem para:

```text
Data
Usuário
Ação
Página
```

com filtros úteis.

---

## Critérios de aceite

- [x] create gera log.
- [x] update gera log.
- [x] publish gera log.
- [x] unpublish gera log.
- [x] actor é identificado.
- [x] timestamp existe.
- [x] Editor não acessa logs.
- [x] Admin consegue consultar.
- [x] logs não são editáveis normalmente.

---

---
spec: SPEC-039
title: Soft Delete / Content Deactivation
status: planned
source: Specs030–041—MaturidadeEditorialeGovernançadoCMS.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# SPEC-039 — Soft Delete / Content Deactivation

## Objetivo

Parar de excluir Pages definitivamente pelo fluxo normal do CMS.

---

# Estado

Não reutilizar `_status`.

Payload já utiliza:

```text
draft
published
```

para workflow editorial.

Criar um estado independente, por exemplo:

```text
lifecycleStatus
├── active
└── inactive
```

ou estrutura equivalente.

---

# Comportamento

```text
active + published
→ público

active + draft
→ não público

inactive
→ nunca público
```

---

## Ação administrativa

Em vez de:

```text
Delete
```

o fluxo comum deve oferecer:

```text
Desativar
```

E posteriormente:

```text
Reativar
```

---

## Editor

Definir na SPEC-037 se Editor pode desativar.

Não assumir.

---

## Consultas

Queries públicas devem sempre considerar:

```text
lifecycleStatus = active
```

---

## Navigation

Uma Page inativa não deve continuar aparecendo em navegação pública.

---

## Relações

Se outra Page referenciar conteúdo desativado:

- não quebrar renderização;
- definir fallback;
- registrar comportamento esperado.

---

## Hard delete

Se ainda for necessário administrativamente:

- não expor no fluxo comum;
- tratar como operação excepcional;
- preferencialmente fora da UI editorial.

---

## Audit Log

Deve registrar:

```text
deactivate
reactivate
```

---

## Critérios de aceite

- [x] fluxo normal não destrói Page.
- [x] Page pode ser desativada.
- [x] Page pode ser reativada.
- [x] inativa não aparece publicamente.
- [x] navegação respeita estado.
- [x] histórico permanece.
- [x] AuditLog registra mudanças.
- [x] Draft/Published continua independente.

---

# CHECKPOINT GOVERNANÇA

Executar:

```text
Admin
→ cria
→ edita
→ publica
→ unpublish
→ desativa
→ reativa
```

E validar logs.

Depois:

```text
Editor
→ repetir apenas ações permitidas
```

Tentar diretamente ações proibidas pela API.

Resultado esperado:

```text
Access denied
```

---

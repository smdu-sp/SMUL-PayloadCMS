---
spec: SPEC-009
title: Documents and Outorga
status: planned
source: PlanodeImplementaçãoporSpecs—MeuImóvelRegular.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, execute os testes aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# SPEC-009 — Documents and Outorga

## Objetivo

Separar dois recursos institucionais com conteúdo altamente atualizável.

---

## Cartilha

Criar collection:

```text
Documents
```

Campos:

```text
title
description
file
externalUrl?
format
updatedAtLabel?
category
```

A rota:

```text
/cartilha
```

consome a collection.

---

## Outorga

Criar domínio isolado:

```text
src/domain/outorga/
├── calculate.ts
├── types.ts
└── calculate.test.ts
```

Parâmetros variáveis não devem ficar em constantes ocultas.

---

## Resultado

Quando não houver integração oficial, o resultado deve ser apresentado como estimativa.

---

---
spec: SPEC-008
title: Situação / CEDI Boundary
status: planned
source: PlanodeImplementaçãoporSpecs—MeuImóvelRegular.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, execute os testes aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# SPEC-008 — Situação / CEDI Boundary

## Objetivo

Criar a rota `/situacao` sem acoplar a interface ao contrato externo do CEDI.

---

## Estrutura

```text
src/lib/cedi/
├── client.ts
├── types.ts
├── errors.ts
└── mock-client.ts
```

---

## SQL

Implementar função pura:

```ts
sanitizeSql(value)
```

e testá-la separadamente.

Cliente e servidor devem validar a entrada.

---

## Contrato interno

Criar interface própria.

Exemplo conceitual:

```ts
interface CediClient {
  lookupBuildingHistory(
    sql: string
  ): Promise<CediLookupResult>
}
```

A UI conhece `CediClient`.

Ela não conhece diretamente:

- endpoint oficial;
- headers;
- credenciais;
- formato bruto da API.

---

## Estados obrigatórios

```text
idle
loading
success
not-found
invalid-input
unavailable
invalid-response
```

---

## Importante

Enquanto o contrato real do CEDI não estiver validado:

```text
mock-client
```

deve ser utilizado.

Não inventar uma API oficial.

---

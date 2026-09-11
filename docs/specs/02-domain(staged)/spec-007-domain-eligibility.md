---
spec: SPEC-007
title: Domain Eligibility
status: planned
source: PlanodeImplementaçãoporSpecs—MeuImóvelRegular.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, execute os testes aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# SPEC-007 — Domain Eligibility

## Objetivo

Implementar as regras de triagem sem dependência do React ou Payload.

---

## Estrutura

```text
src/domain/
├── eligibility/
│   ├── evaluate.ts
│   ├── types.ts
│   └── evaluate.test.ts
├── regularization-modes.ts
└── restrictions.ts
```

---

## Entrada conceitual

```ts
type EligibilityInput = {
  completionDate?: Date
  usage?: string
  builtArea?: number
  usageCategory?: string
  iptu2014Exempt?: boolean
  restrictions?: Restriction[]
}
```

---

## Saída conceitual

Nunca retornar apenas:

```text
eligible: true
```

Preferir:

```ts
type EligibilityResult = {
  status: 'probable' | 'blocked' | 'insufficient-data'
  probableMode?: RegularizationMode
  reasons: Reason[]
  warnings: Warning[]
  nextStep?: NextStep
}
```

Isso preserva a natureza de **triagem preliminar**.

---

## Casos obrigatórios de teste

- corte em 31/07/2014;
- modalidade automática;
- declaratória simplificada;
- limite de 500 m²;
- declaratória;
- limite de 1.500 m²;
- modalidade comum;
- IPTU 2014;
- impedimentos territoriais;
- dados insuficientes.

---

## UI

Somente após os testes da camada de domínio criar:

```text
EligibilityWizard
```

O Wizard apenas coleta dados e apresenta o resultado.

Não replica as regras.

---

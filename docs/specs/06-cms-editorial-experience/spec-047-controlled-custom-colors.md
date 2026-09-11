---
spec: SPEC-047
title: Controlled Custom Colors
status: planned
source: CMS-NOVO-CICLO-SPECS-042-050.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# 6. SPEC-047 — Controlled Custom Colors

## Objetivo

Adicionar Color Picker sem transformar o Payload em um editor de CSS.

### Estratégia recomendada

Presets continuam sendo a opção principal.

```text
Background:
○ Default
○ Surface
○ Primary
○ Secondary
○ Accent
○ Custom
```

O Color Picker aparece apenas quando:

```text
Custom
```

### Estrutura conceitual

```text
background
├── type
│   ├── preset
│   └── custom
├── preset?
└── customColor?
```

### Componentes internos

Evitar configurações como:

```text
Card title color
Card text color
Card border color
Card icon color
Card button color
```

Isso transforma o CMS em um editor de CSS.

### Modelo recomendado

```text
Block appearance
├── background
├── foreground
└── accent
```

Componentes internos herdam esses valores.

Exemplo conceitual:

```text
Block

--block-bg
--block-fg
--block-accent
```

```text
Card
→ var(--block-fg)

Button
→ var(--block-accent)
```

### Critérios de aceite

- Presets continuam disponíveis.
- `Custom` é uma opção explícita.
- Não existem dezenas de controles de cor por componente.
- Foreground e background são validados.
- Contraste mínimo é verificado.
- Componentes internos herdam tokens do Block.

---

# 7. Plano de acessibilidade

Meta recomendada:

```text
WCAG 2.2 AA
```

A acessibilidade deve ser tratada em duas camadas:

```text
Code accessibility
+
Editorial accessibility
```

---

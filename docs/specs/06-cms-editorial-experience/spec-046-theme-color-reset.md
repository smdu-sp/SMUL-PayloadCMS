---
spec: SPEC-046
title: Theme Color Reset
status: planned
source: CMS-NOVO-CICLO-SPECS-042-050.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

## SPEC-046 — Theme Color Reset

### Objetivo

Adicionar uma ação de **Reset** nas configurações de cores do Theme.

### Comportamento esperado

```text
customização atual
        ↓
Reset
        ↓
tokens padrão SMUL
```

### Estratégia recomendada

Os defaults devem viver no código.

```text
DEFAULT_THEME
```

O CMS deve armazenar apenas overrides.

```text
effectiveTheme =
defaultTheme
+
CMS overrides
```

Reset:

```text
remove overrides
```

### Benefícios

- evita duplicar defaults no banco;
- novas mudanças no tema padrão continuam sendo propagadas;
- reduz risco de valores antigos persistirem indefinidamente.

---

# 5. ADR — Custom Color Governance

Antes da implementação do Color Picker, registrar uma decisão arquitetural.

## Problema

A arquitetura original do projeto controla a personalização visual através de tokens e presets.

A introdução de Color Picker cria liberdade visual maior para o editor.

Isso pode conflitar com:

```text
Design System
Semantic Tokens
Branding
Consistência visual
Acessibilidade
```

### Perguntas que precisam ser respondidas

1. Onde cores customizadas serão permitidas?
2. Quais elementos podem receber cor customizada?
3. Presets continuam sendo a opção principal?
4. Como validar contraste?
5. Cores customizadas serão armazenadas como HEX?
6. Componentes internos herdam cores do Block?
7. Quais combinações devem ser bloqueadas?

---

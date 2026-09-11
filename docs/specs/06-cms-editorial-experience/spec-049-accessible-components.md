---
spec: SPEC-049
title: Accessible Components
status: planned
source: CMS-NOVO-CICLO-SPECS-042-050.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# 9. SPEC-049 — Accessible Components

## Objetivo

Centralizar acessibilidade nos primitives e componentes reutilizáveis.

### Princípio

```text
Primitive acessível
↓
Block acessível por construção
```

Evitar:

```text
cada Block implementando acessibilidade sozinho
```

### Componentes prioritários

```text
Button
Link
Dialog
Accordion
Navigation
Carousel
Gallery
Form controls
Media
```

### Pontos obrigatórios

- HTML semântico;
- foco visível;
- navegação por teclado;
- atributos ARIA apenas quando necessários;
- suporte a leitores de tela;
- estados disabled;
- mensagens de erro;
- redução de movimento;
- responsividade;
- zoom e reflow.

---

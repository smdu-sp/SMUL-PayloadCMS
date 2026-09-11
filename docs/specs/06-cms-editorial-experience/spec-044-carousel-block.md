---
spec: SPEC-044
title: Carousel Block
status: planned
source: CMS-NOVO-CICLO-SPECS-042-050.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

## SPEC-044 — Carousel Block

### Objetivo

Criar um Block de conteúdo sequencial.

Gallery e Carousel devem continuar sendo componentes separados.

```text
Gallery
→ exploração de conjunto

Carousel
→ conteúdo sequencial
```

### Estrutura conceitual

```text
Carousel
├── items[]
│   ├── image
│   ├── title?
│   ├── description?
│   └── link?
├── display
│   ├── slidesPerView
│   └── navigation
└── behavior
```

### Autoplay

Autoplay não deve ser o comportamento padrão.

```text
autoplay:
off ← default
on
```

Caso exista autoplay:

- deve ser possível pausar;
- rotação deve parar quando o usuário interagir;
- respeitar `prefers-reduced-motion`;
- controles anterior/próximo devem funcionar por teclado.

### Critérios de aceite

- Navegação manual funciona.
- Componente é responsivo.
- Navegação por teclado funciona.
- Foco é visível.
- Screen readers conseguem identificar estrutura e controles.
- Autoplay, caso habilitado, possui mecanismo de pausa.

---

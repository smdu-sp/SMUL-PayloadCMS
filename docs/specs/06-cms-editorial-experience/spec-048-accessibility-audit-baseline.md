---
spec: SPEC-048
title: Accessibility Audit & Baseline
status: planned
source: CMS-NOVO-CICLO-SPECS-042-050.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# 8. SPEC-048 — Accessibility Audit & Baseline

## Objetivo

Auditar o estado atual da aplicação antes de iniciar correções pontuais.

### Escopo

```text
HTML semântico
headings
landmarks
links
buttons
forms
focus
keyboard
contraste
imagens
modais
menus
accordions
carousel
vídeos
mensagens de erro
skip links
reduced motion
zoom
reflow
```

### Matriz sugerida

| Componente | Teclado | Focus | Screen Reader | Contraste | Status |
|---|---|---|---|---|---|
| Header |  |  |  |  |  |
| Footer |  |  |  |  |  |
| Hero |  |  |  |  |  |
| FAQ |  |  |  |  |  |
| Gallery |  |  |  |  |  |
| Carousel |  |  |  |  |  |
| Video |  |  |  |  |  |
| Forms |  |  |  |  |  |

### Resultado esperado

Criar um baseline claro contendo:

- componentes conformes;
- componentes parcialmente conformes;
- falhas;
- severidade;
- prioridade;
- impacto.

---

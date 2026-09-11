---
spec: SPEC-043
title: Gallery / Lightbox Block
status: planned
source: CMS-NOVO-CICLO-SPECS-042-050.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

## SPEC-043 — Gallery / Lightbox Block

### Objetivo

Criar um Block para exibir uma coleção de imagens em formato de galeria.

Ao selecionar uma imagem, ela deve abrir ampliada em um **Lightbox / Dialog**.

### Estrutura conceitual

```text
Gallery
├── title?
├── images[]
│   ├── media
│   ├── caption?
│   └── metadata editorial?
├── layout
│   ├── columns
│   └── preset
└── lightbox
```

### Fluxo esperado

```text
thumbnail
   ↓ click
dialog / lightbox
   ↓
imagem ampliada
   ↓
anterior / próxima
```

### Configurações recomendadas

```text
columns:
2
3
4
```

Evitar opções excessivas.

`masonry` deve ser implementado apenas se houver necessidade editorial concreta.

### Requisitos de acessibilidade

O Lightbox deve funcionar como um Dialog acessível.

Obrigatório:

- fechar com `Esc`;
- mover foco para o Dialog ao abrir;
- impedir que o foco escape enquanto aberto;
- botão de fechar acessível;
- devolver foco ao elemento que abriu o Lightbox;
- permitir navegação anterior/próxima pelo teclado;
- possuir nome acessível.

---

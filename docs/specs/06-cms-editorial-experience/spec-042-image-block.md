---
spec: SPEC-042
title: Image Block
status: planned
source: CMS-NOVO-CICLO-SPECS-042-050.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

## SPEC-042 — Image Block

### Objetivo

Criar um Block editorial dedicado à exibição de **uma única imagem**.

### Estrutura conceitual

```text
ImageBlock
├── media
├── caption?
├── appearance
│   ├── size
│   ├── aspectRatio
│   ├── fit
│   └── alignment
└── ...
```

### Regra arquitetural

O Block não deve duplicar a lógica de apresentação de imagem já criada anteriormente.

Ideal:

```text
Media
        ↓
ImagePresentationFields
        ↓
 ┌──────┼─────────┐
Hero  ImageBlock  Gallery
```

Caso os campos da antiga SPEC-034 estejam declarados diretamente dentro de cada Block, considerar extrair essa configuração para uma estrutura reutilizável.

### Critérios de aceite

- Editor consegue selecionar uma imagem da Media Library.
- Editor consegue configurar tamanho por preset.
- Editor consegue configurar aspect ratio.
- Editor consegue configurar `cover` ou `contain`.
- Editor consegue definir alinhamento.
- Imagem é responsiva.
- Não existem dimensões numéricas livres.

---

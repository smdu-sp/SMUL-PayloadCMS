---
spec: SPEC-040
title: Admin User Documentation
status: planned
source: Specs030–041—MaturidadeEditorialeGovernançadoCMS.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# SPEC-040 — Admin User Documentation

## Objetivo

Adicionar documentação acessível diretamente a partir do Admin para que um usuário consiga utilizar a ferramenta sem treinamento técnico constante.

---

# Conteúdo mínimo

Criar documentação para:

```text
Introdução
Criando uma página
Entendendo Blocks
Adicionando imagens
Links internos e externos
Estilos disponíveis
Draft
Preview
Publish
Unpublish
Desativação
SEO
Boas práticas
```

---

# Público

A documentação é para:

```text
Editor
Admin
```

não para desenvolvedor.

Evitar:

```text
CollectionConfig
React
Server Components
schema
hook
```

salvo quando indispensável.

---

## Estrutura sugerida

```text
Ajuda
│
├── Primeiros passos
├── Páginas
├── Blocks
├── Imagens
├── Links
├── Publicação
└── Boas práticas
```

---

## Dentro do Admin

Adicionar acesso visível:

```text
Documentação
```

ou:

```text
Ajuda
```

no painel.

A implementação pode ser:

- página customizada do Admin;
- documentação interna renderizada;
- link para documentação versionada do projeto;

desde que seja fácil para o editor acessar.

---

## Documentar Blocks

Cada Block deve possuir:

```text
nome
finalidade
campos principais
quando usar
quando não usar
```

Se possível:

```text
exemplo visual
```

---

## Critérios de aceite

- [x] documentação existe.
- [x] pode ser acessada pelo Admin.
- [x] Editor consegue acessá-la.
- [x] fluxo de Page está documentado.
- [x] Blocks estão documentados.
- [x] workflow editorial está documentado.
- [x] não exige conhecimento de código.

---

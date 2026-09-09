---
spec: SPEC-036
title: Controlled Block Styling
status: implemented
source: Specs030–041—MaturidadeEditorialeGovernançadoCMS.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# SPEC-036 — Controlled Block Styling

## Objetivo

Permitir alguma personalização visual dos Blocks sem entregar o Design System ao usuário.

---

# Regra principal

O editor deve selecionar **intenção visual**, e não escrever CSS.

---

## Não permitir

```text
CSS
Tailwind classes
hex
RGB
margin numérica
padding numérico
font-size
font-family
box-shadow
border-radius livre
```

---

# Criar um campo compartilhado

Algo equivalente a:

```text
appearance
├── tone
├── spacing
├── width
└── alignment
```

Somente campos realmente aplicáveis devem aparecer.

---

## Tone

Exemplo:

```text
default
surface
muted
primary
secondary
accent
```

A aparência real vem da SPEC-031.

---

## Spacing

```text
compact
default
spacious
```

---

## Width

```text
narrow
default
wide
full
```

---

## Alignment

Somente quando semanticamente aplicável:

```text
left
center
```

---

# O campo não precisa existir em todos os Blocks

Por exemplo:

```text
RichText
→ width

CTA
→ tone

Hero
→ alignment + tone

FAQ
→ talvez nenhum
```

Não crie um mega `styleConfig` universal com vinte propriedades.

---

## Critérios de aceite

- [x] editor consegue variar visual de Blocks.
- [x] opções são fechadas.
- [x] nenhum CSS arbitrário é armazenado.
- [x] Design Tokens continuam sendo fonte do estilo.
- [x] combinações inválidas são evitadas.
- [x] mobile não depende de configuração manual.
- [x] defaults preservam páginas antigas.

---

# CHECKPOINT VISUAL

Após SPEC-036 validar:

### Cenário 1

Editor cria duas Pages diferentes.

Ele consegue variar apresentação sem fazer os sites parecerem produtos diferentes?

Resposta esperada:

```text
Sim.
```

### Cenário 2

Editor consegue colocar qualquer cor em qualquer Block?

Resposta esperada:

```text
Não.
```

### Cenário 3

Alterar a identidade SMUL exige editar Blocks?

Resposta:

```text
Não.
```

---

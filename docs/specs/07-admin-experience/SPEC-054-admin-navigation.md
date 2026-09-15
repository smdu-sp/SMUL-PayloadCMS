---
spec: SPEC-054
title: Admin Navigation & Information Architecture
status: planned
source: PAINEL-ADMIN-V2-SPECS-051-055.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades das Specs seguintes. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# 6. SPEC-054 — Admin Navigation & Information Architecture

## Objetivo

Melhorar a navegação e organização do menu lateral do Admin.

---

## Problema

“Melhorar o menu” é vago demais para implementação.

Antes de estilizar, é necessário organizar a informação.

O foco deve ser:

```text
Information Architecture
+
Navigation UX
```

---

## Estrutura conceitual sugerida

```text
Conteúdo
├── Páginas
├── Mídia
└── ...

Estrutura
├── Header
├── Footer
└── Navegação

Configurações
├── Tema
├── SEO
└── ...

Governança
├── Usuários
├── Logs
└── ...

Ajuda
└── Documentação
```

A composição final deve respeitar as Collections e Globals reais do projeto.

---

## Objetivo de UX

O editor deve conseguir responder rapidamente:

```text
Onde altero conteúdo?
Onde altero aparência?
Onde encontro mídia?
Onde estão as configurações?
Onde gerencio usuários?
Onde consulto logs?
Onde encontro ajuda?
```

sem precisar entender a arquitetura interna do Payload.

---

## Possíveis melhorias

Avaliar:

- agrupamento lógico;
- labels amigáveis;
- ícones;
- hierarquia visual;
- separadores;
- destaque da seção ativa;
- melhor uso de espaço;
- comportamento de colapso;
- navegação por teclado;
- responsividade.

---

## Critério central

> Um usuário não técnico deve conseguir inferir onde executar uma tarefa pela organização do menu, sem conhecer a estrutura técnica do Payload.

---

## Critérios de aceite

- Collections e Globals estão agrupados por função.
- Nomenclatura é editorial, não excessivamente técnica.
- Item ativo é visualmente identificável.
- Menu funciona por teclado.
- Estrutura funciona com Admin e Editor.
- Recursos restritos continuam ocultos ou bloqueados conforme permissões.
- Organização do menu não interfere no access control real da API.

---

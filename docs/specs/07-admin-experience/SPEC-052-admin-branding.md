---
spec: SPEC-052
title: Admin Branding
status: planned
source: PAINEL-ADMIN-V2-SPECS-051-055.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades das Specs seguintes. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# 4. SPEC-052 — Admin Branding

## Objetivo

Substituir a identidade visual padrão do Payload pela identidade institucional do projeto.

Evitar tratar isso apenas como:

> Remover logos do Payload

A formulação arquitetural correta é:

> Substituir o branding padrão do Payload pela identidade institucional.

---

## Escopo

Customizar, quando suportado:

```text
Admin Branding
├── logo
├── ícone
├── favicon / admin icon
├── nome da aplicação
├── textos de identificação
└── elementos visuais institucionais
```

### Resultado esperado

O usuário deve perceber que está acessando:

```text
Meu Imóvel Regular
Painel de Administração
```

e não uma instalação genérica do Payload.

---

## Restrições

Não alterar mecanismos internos sem necessidade.

Branding deve ser tratado como apresentação.

Evitar:

- hacks em componentes internos;
- substituições frágeis;
- forks desnecessários;
- CSS dependente de seletores internos instáveis.

---

## Critérios de aceite

- Logos padrão do Payload não dominam mais a experiência visual.
- Identidade institucional aparece nos principais pontos do Admin.
- Ícone institucional é utilizado onde aplicável.
- Nome da aplicação é exibido de forma consistente.
- Customização sobrevive a build e deploy.
- Não há alteração desnecessária na lógica do Payload.

---

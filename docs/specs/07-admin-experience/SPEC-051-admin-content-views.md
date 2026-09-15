---
spec: SPEC-051
title: Admin Content Views
status: planned
source: PAINEL-ADMIN-V2-SPECS-051-055.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades das Specs seguintes. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# 3. SPEC-051 — Admin Content Views

## Objetivo

Melhorar a visualização e gerenciamento das Collections mais utilizadas no Admin.

Prioridade inicial:

```text
Media
Pages
```

---

## 3.1 Media

A Media Library deve ser tratada visualmente como uma biblioteca de assets, e não apenas como uma tabela de registros.

### Modos desejados

```text
Media
├── List
├── Grid
└── Preview
```

### Grid

O modo Grid deve priorizar:

- thumbnail;
- nome do arquivo;
- tipo;
- dimensões, quando relevante;
- ações rápidas;
- seleção visual clara.

### List

O modo List deve continuar útil para:

- busca;
- ordenação;
- inspeção de metadados;
- gerenciamento em massa.

### Preview

O usuário deve conseguir visualizar o asset sem precisar navegar de forma desnecessária entre múltiplas telas.

### Diretriz

Para mídia, **Grid é altamente recomendado**, pois o conteúdo é predominantemente visual.

---

## 3.2 Pages

Não assumir que Pages precisam de Grid apenas por simetria com Media.

Pages não são assets visuais.

A visualização principal recomendada é uma lista enriquecida.

### Informações úteis

```text
Título
Slug
Status
Última alteração
Autor
Preview
Ações
```

### Possível estrutura

```text
Pages
├── List
├── filtros
├── busca
├── status
├── preview
└── ações rápidas
```

### Regra

Grid para Pages só deve existir se resolver um problema editorial concreto.

Não implementar apenas por aparência.

---

## Critérios de aceite

### Media

- Editor consegue alternar entre List e Grid.
- Grid exibe thumbnails de forma clara.
- Preview pode ser acessado rapidamente.
- Busca continua disponível.
- Ações importantes continuam acessíveis.
- Layout funciona com diferentes quantidades e formatos de mídia.

### Pages

- Lista apresenta informações relevantes sem exigir abertura de cada registro.
- Status editorial é facilmente identificável.
- Preview é acessível diretamente.
- Busca e filtros funcionam de forma clara.
- Ações recorrentes exigem menos navegação.

---

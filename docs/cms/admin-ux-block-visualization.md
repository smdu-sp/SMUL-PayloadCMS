# SPEC-024 — UX editorial dos Blocks

Este guia registra como montar as três composições de referência no catálogo consolidado. Os nomes abaixo são os exibidos no Payload Admin; não é necessário consultar os nomes técnicos.

## Como ler o catálogo

- **Conteúdo** reúne destaque principal, texto editorial, cards, grades de ícones, perguntas frequentes e caixas de aviso.
- **Mídia** reúne **Mídia e texto / imagem de destaque**. A posição da imagem define se o resultado é uma composição em duas colunas ou um destaque de mídia.
- **Ações** reúne chamadas finais e conjuntos de faixas de ação.
- Blocos recolhidos mostram título e quantidade de itens, perguntas ou chamadas quando esses dados existem.
- Aparências são escolhas fechadas do Design System. Em faixas de ação, Verde, Azul e Amarelo são labels editoriais mapeadas para os valores internos `primary`, `brand` e `accent`.
- **Destaque principal** é uma abertura editorial. Nesta fase ele não possui `counterNumbers`, cálculo de prazo, contador ou timer automático.

## Roteiros de montagem

### Home-like

1. **Destaque principal** — escolha o modelo de apresentação e, se necessário, imagem e ação principal.
2. **Texto editorial** — adicione a introdução.
3. **Cards e grades de benefícios** — selecione o modelo **Modalidades** para opções de regularização.
4. **Faixas de ação** — adicione e reordene as chamadas; selecione o tom visual de cada faixa.

### Info-like

1. **Mídia e texto / imagem de destaque** — use a imagem principal e o conteúdo de apoio.
2. **Cards e grades de benefícios** — use cards para benefícios simples.
3. **Perguntas frequentes** — adicione pares de pergunta e resposta.
4. **Caixa de aviso** — escolha entre Informativo e Atenção.

### Regularization-like

1. **Grade de ícones e informações** — informe o título da seção e os itens curtos.
2. **Mídia e texto / imagem de destaque** — escolha imagem à esquerda ou à direita.
3. **Chamada de ação** — encerre com um link para página interna ou serviço oficial.

## Limites desta entrega

Os roteiros validam a montagem com os nove Blocks existentes. Não foram criados Hero Countdown, Benefits Grid, Media Highlight ou Step-by-Step como novos schemas: seus usos possíveis foram orientados pelo catálogo consolidado, sem antecipar Blocks adiados por specs anteriores.

## Localização e miniaturas do catálogo

- O Admin usa a tradução oficial em português distribuída por `@payloadcms/translations`.
- Cada Block registra uma miniatura 3:2 por `admin.images.thumbnail`, sem alterar o `slug` ou os dados persistidos.
- As miniaturas em `public/block-previews` reproduzem a estrutura e o conteúdo demonstrativo de `seed-showcase.ts` com os tokens institucionais.
- O Block de vídeo possui uma amostra representativa baseada no componente atual, pois ainda não integra o catálogo seed.

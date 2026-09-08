```yaml
spec: SPEC-033
title: Hero Background Media, Card Image Presentation & Full-Width Image Banner
status: updated
source: spec-033-hero-background-media.md
```

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe o canvas de edição da SPEC-041 nem controles de edição destrutiva do asset. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# SPEC-033 — Mídia de Fundo, Imagens em Cards e Banner Full-Width

## 1. Objetivo

Ampliar o suporte de mídia dos Blocks atuais sem transformar o CMS em um editor gráfico livre. Esta Spec cobre três entregas relacionadas:

1. adicionar imagem de fundo responsiva ao `Hero`;

1. permitir que os `Cards` apresentem imagem, ícone ou apenas texto, com posições controladas;

1. criar o Block `FullWidthImageBanner`, um banner com imagem ocupando toda a largura visual do layout e versões específicas para desktop e mobile.

A mídia original permanece preservada na Collection `Media`. O CMS controla a seleção do asset e opções editoriais fechadas; o frontend controla layout, responsividade, crop, acessibilidade e Design Tokens.

## 2. Escopo

| Entrega | Tipo | Resultado |
| --- | --- | --- |
| Hero com background | Evolução do Block existente | Hero com imagem de fundo, fallback e overlay semântico. |
| Cards com mídia configurável | Evolução do Block existente | Card com `icon`, `image` ou nenhum recurso visual, em posições aprovadas. |
| Banner full-width | Novo Page Block | Imagem cobre toda a largura da área visual, com asset desktop e opcional para mobile. |

## 3. Princípios de arquitetura

O schema não deve armazenar CSS, classes Tailwind, HEX, RGB, dimensões livres ou valores arbitrários de crop. A escolha feita no CMS deve representar uma **intenção editorial**.

```
CMS
├── seleciona Media
├── seleciona variant fechada
├── seleciona posição/apresentação aprovada
└── informa conteúdo editorial

Frontend
├── resolve layout
├── aplica Design Tokens
├── controla responsividade
├── garante acessibilidade
└── preserva fallback
```

Não criar uploads duplicados para cada apresentação do mesmo asset. Um arquivo de mídia pode ser apresentado como background, imagem de card, mídia lateral ou banner conforme o contexto do Block.

# 4. Hero com imagem de fundo

## 4.1. Schema de referência

Evoluir o Hero já existente sem criar um segundo Block com a mesma finalidade:

```
Hero
├── content
├── actions
├── background
│   ├── image: Media relationship
│   ├── mobileImage?: Media relationship
│   ├── overlay: none | light | dark
│   └── focalPoint?: preset
└── variant
```

`mobileImage` é opcional. Quando não for informado, o frontend deve utilizar `image` com comportamento responsivo seguro.

## 4.2. Regras

A imagem de fundo deve usar a Collection `Media`, ter fallback quando ausente, responder corretamente em mobile e preservar a legibilidade de títulos, textos e ações. A imagem decorativa não deve gerar informação duplicada para leitores de tela.

O campo `overlay` deve utilizar enum fechado:

```
none
light
dark
```

Se for necessário controlar foco visual, usar presets semânticos, por exemplo `center`, `top`, `bottom`, `left` e `right`. Não permitir `opacity = 0.342`, `background = #123456` ou coordenadas livres diretamente no Block.

## 4.3. Fallback

A ordem de fallback deve ser:

```
background.image
↓
background.mobileImage, quando viewport mobile e configurada
↓
background sem imagem
↓
layout padrão do Hero
```

O fallback não pode deixar texto ilegível nem produzir uma área vazia inesperada.

# 5. Ajustes nos Cards

## 5.1. Objetivo

Permitir que os Cards apresentem diferentes recursos visuais sem criar Blocks duplicados. Cada item pode usar um **ícone**, uma **imagem** ou nenhum recurso visual, conforme a finalidade editorial.

## 5.2. Schema de referência

Ajustar o Block `Cards` existente ou o Block especializado que o representa, preservando compatibilidade com dados já publicados:

```
Cards
├── title?
├── description?
├── presentation
│   ├── mediaSource: none | icon | image
│   ├── mediaPosition: top | left | right
│   ├── imageSize: small | medium | large
│   └── imageAspect: original | square | 4:3 | 16:9
└── items[]
    ├── title
    ├── description
    ├── icon?: standard icon identifier
    ├── image?: Media relationship
    └── link?
```

Quando a configuração for por item e não por todo o conjunto, `mediaSource`, `mediaPosition`, `imageSize` e `imageAspect` devem ser movidos para dentro de `items[]`. A decisão deve seguir o comportamento visual real do design e evitar combinações incoerentes.

## 5.3. Regras editoriais

| Opção | Comportamento |
| --- | --- |
| `none` | Card textual, sem ícone ou imagem. |
| `icon` | Usa o catálogo padrão de ícones; SVG arbitrário não é permitido. |
| `image` | Usa relacionamento com `Media`; o arquivo original não é alterado. |
| `top` | Mídia acima do título, adequada para grades de cards. |
| `left` | Mídia ao lado esquerdo do texto, quando houver espaço suficiente. |
| `right` | Mídia ao lado direito do texto, quando aprovado pelo layout. |

Não permitir simultaneamente `icon` e `image` no mesmo item, salvo se uma variante específica tiver justificativa visual comprovada. Se nenhum recurso for informado, o card deve renderizar corretamente como conteúdo textual.

## 5.4. Apresentação de imagens em Cards

Os controles devem ser presets fechados:

```
imageSize: small | medium | large
imageAspect: original | square | 4:3 | 16:9
fit: cover | contain
```

Não permitir valores numéricos livres, como `width = 713px`, nem edição destrutiva. A imagem deve preservar `alt`, dimensões responsivas e comportamento de carregamento compatível com o frontend.

## 5.5. Compatibilidade

Cards existentes sem `presentation`, `mediaSource` ou `mediaPosition` devem manter o comportamento atual. O default recomendado é:

```
mediaSource: none
mediaPosition: top
imageSize: medium
imageAspect: original
```

Os defaults podem ser ajustados ao comportamento atual do projeto, desde que conteúdo antigo continue renderizando.

# 6. Novo Block — FullWidthImageBanner

## 6.1. Objetivo

Criar um banner editorial com imagem cobrindo toda a largura visual da página ou da seção, sem exigir que o editor controle dimensões, margens, breakpoints ou CSS.

O Block é diferente do background do Hero porque representa uma seção de mídia própria, podendo aparecer entre outros Blocks e possuir conteúdo e ação opcionais.

## 6.2. Schema de referência

```
FullWidthImageBanner
├── desktopImage: Media relationship
├── mobileImage?: Media relationship
├── content?
│   ├── eyebrow?
│   ├── title?
│   ├── description?
│   └── actions[]?
├── contentPosition: left | center | right
├── overlay: none | light | dark
├── imageFit: cover | contain
├── focalPoint: center | top | bottom | left | right
└── variant: default | compact | immersive
```

`desktopImage` é obrigatório. `mobileImage` é opcional, mas deve ser utilizado quando a composição desktop não for adequada para telas estreitas.

## 6.3. Regras de layout

O frontend controla a largura total, altura mínima, espaçamento, breakpoint, crop e sobreposição. O editor não informa `width`, `height`, `min-height`, `padding`, `margin`, `object-position` ou qualquer valor CSS.

A variante `cover` deve preencher a área sem distorcer a imagem. A variante `contain` só deve ser habilitada quando houver justificativa editorial, pois pode produzir áreas vazias. A escolha final deve respeitar a composição visual aprovada.

## 6.4. Desktop e mobile

A seleção deve seguir esta lógica:

```
desktopImage
↓
se viewport mobile e mobileImage existir → mobileImage
↓
caso contrário → desktopImage responsiva
```

A `mobileImage` deve ser uma composição alternativa do mesmo conteúdo visual, e não necessariamente uma cópia redimensionada. O schema deve impedir que o editor deixe ambas as imagens sem valor.

Validar pelo menos:

```
320px
375px
768px
desktop padrão
desktop largo
```

## 6.5. Conteúdo sobreposto

O conteúdo é opcional. Quando existir sobre a imagem, deve haver contraste suficiente e overlay compatível. O conteúdo não pode ser comunicado somente pela imagem. Títulos, descrições e ações devem permanecer disponíveis para tecnologias assistivas.

O Block deve suportar também o modo somente imagem quando a imagem for decorativa ou quando o conteúdo editorial estiver em outro Block. Nesse caso, o `alt` e a finalidade da mídia devem seguir a política da Collection `Media`.

## 6.6. Fallback

Se `mobileImage` estiver ausente, usar `desktopImage` com comportamento responsivo. Se `desktopImage` estiver ausente, o schema deve rejeitar o conteúdo ou o renderer deve apresentar fallback seguro, conforme a estratégia de validação do projeto. Um banner sem imagem não deve resultar em uma seção visual quebrada.

# 7. Acessibilidade

Para todos os casos:

- imagens decorativas não devem duplicar informação em leitores de tela;

- imagens informativas devem possuir texto alternativo coerente;

- conteúdo sobreposto deve respeitar contraste;

- ações devem usar links ou botões semanticamente corretos;

- foco de teclado deve ser visível;

- o layout deve permanecer utilizável sem depender apenas de cor;

- a ordem de leitura mobile deve ser intencional;

- cards com imagem e link devem evitar regiões clicáveis ambíguas.

# 8. Validações editoriais

Implementar validações mínimas:

| Regra | Resultado esperado |
| --- | --- |
| `FullWidthImageBanner.desktopImage` ausente | Erro editorial claro. |
| `Cards.mediaSource = image` sem `image` | Erro no item ou fallback definido. |
| `Cards.mediaSource = icon` sem `icon` | Erro no item ou fallback definido. |
| `icon` e `image` simultâneos | Rejeitar ou resolver por regra explícita; não deixar ambíguo. |
| `mobileImage` sem `desktopImage` | Rejeitar. |
| Overlay inválido | Rejeitar por enum. |
| Título/descrição longos | Renderizar sem quebra estrutural. |
| Imagem ausente em Hero | Usar fallback visual seguro. |

As mensagens devem ser editoriais, por exemplo: `Selecione uma imagem para o banner desktop.`

# 9. Implementação técnica

## 9.1. Arquivos esperados

```
src/blocks/Hero/
├── config.ts
├── Component.tsx
└── Hero.test.tsx

src/blocks/Cards/
├── config.ts
├── Component.tsx
└── Cards.test.tsx

src/blocks/FullWidthImageBanner/
├── config.ts
├── Component.tsx
└── FullWidthImageBanner.test.tsx
```

Registrar o novo Block no schema de `Pages` e no `RenderBlocks`. Não criar um segundo `Hero` para resolver a imagem de fundo. O `FullWidthImageBanner` deve ter um `blockType` estável e não ser implementado como um conjunto de campos genéricos dentro de outro Block.

## 9.2. Compatibilidade e migration

Antes de alterar o schema, verificar conteúdo persistido. Campos novos devem ser opcionais quando possível e possuir defaults compatíveis. Renames, mudanças de tipo ou migrações destrutivas exigem plano de migration e fixture com conteúdo antigo.

## 9.3. Relação com outras Specs

| Spec | Relação |
| --- | --- |
| SPEC-034 | Pode consolidar presets de tamanho, aspecto, fit e focal point usados pelos Cards e pelo Banner. |
| SPEC-035 | Fornece os ícones padrão usados pelos Cards. |
| SPEC-036 | Fornece `tone`, `spacing`, `width` e `alignment` sem CSS livre. |
| SPEC-041 | Continua fora do escopo; não editar o asset original. |

# 10. Testes obrigatórios

## Hero

- [ ] Com imagem desktop.

- [ ] Com imagem desktop e mobile.

- [ ] Sem imagem.

- [ ] Com cada overlay permitido.

- [ ] Título e descrição longos.

- [ ] Viewports 320 px, 768 px e desktop.

## Cards

- [ ] Card textual.

- [ ] Card com ícone padrão.

- [ ] Card com imagem.

- [ ] Imagem acima do texto.

- [ ] Imagem à esquerda.

- [ ] Imagem à direita, quando habilitada.

- [ ] Imagem ausente.

- [ ] Título e descrição longos.

- [ ] Quantidade variável de cards.

- [ ] Teclado, foco e links.

## FullWidthImageBanner

- [ ] Banner com imagem desktop.

- [ ] Banner com imagem desktop e mobile.

- [ ] Banner sem conteúdo sobreposto.

- [ ] Banner com título, descrição e ação.

- [ ] Cada posição de conteúdo permitida.

- [ ] Cada overlay permitido.

- [ ] Crop e fit em mobile.

- [ ] Tamanhos 320 px, 375 px, 768 px, desktop padrão e desktop largo.

- [ ] Imagem original preservada.

- [ ] Contraste e leitura por teclado.

# 11. Fora de escopo

Não implementar nesta Spec:

- canvas de edição de imagem;

- crop destrutivo;

- filtros, brilho, contraste, desenho ou texto gravado no asset;

- valores livres de CSS;

- upload de SVG arbitrário;

- countdown real ou cálculo de prazo;

- uma segunda implementação de Hero;

- um Page Builder genérico.

# 12. Critérios de aceite

- [ ] Hero aceita background via Collection `Media`.

- [ ] Hero suporta imagem alternativa para mobile quando necessário.

- [ ] Hero possui fallback seguro e overlay por preset.

- [ ] Cards suportam texto, ícone ou imagem sem duplicar Blocks.

- [ ] Cards suportam posições de mídia aprovadas.

- [ ] Cards usam presets de tamanho, proporção e fit.

- [ ] Novo `FullWidthImageBanner` pode ser inserido e reordenado no CMS.

- [ ] Banner ocupa toda a largura visual sem controle CSS pelo editor.

- [ ] Banner suporta imagem desktop e imagem mobile opcional.

- [ ] Banner preserva acessibilidade, contraste e leitura responsiva.

- [ ] Asset original não é modificado.

- [ ] Conteúdo antigo continua renderizando.

- [ ] `RenderBlocks` e schema de `Pages` foram atualizados.

- [ ] Testes automatizados e validação manual passam.

- [ ] Lint, typecheck e build passam.
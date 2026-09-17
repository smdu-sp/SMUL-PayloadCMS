# Auditoria da arquitetura de cores

## Resumo executivo

A arquitetura atual ja possui uma base de `BlockColorTheme`, mas ainda nao atende
completamente ao modelo de Color Schemes e Nested Color Scopes.

O principal problema remanescente e que alguns schemes nao possuem pares proprios
coerentes e componentes como Rich Text, banners, FAQ e variantes secundarias de
Button ainda escapam do scope local.

O fluxo atual e:

```text
SiteSettings.branding
-> resolveThemeColors()
-> mapThemeToCssVariables()
-> --color-* globais
-> resolveBlockColorTheme()
-> --block-* locais
-> primitives
```

A direcao e correta, mas ainda existem vazamentos:

```text
--block-* local
|-- Heading, Text, Button e Icon: parcialmente correto
|-- Rich Text: usa --color-* globais
|-- BlockLink textual: usa --color-link global
|-- Button secondary: muda o fundo sem resolver novo par
|-- banners com overlay: usam tone="inverse" manual
`-- superficies HTML diretas: nao abrem nested scope
```

## Arquivos relevantes encontrados

As specs 031 e 036 estao em diretorios diferentes dos caminhos inicialmente
indicados:

- `docs/specs/05-cms-maturity-governance/spec-031-smul-visual-identity.md`
- `docs/specs/05-cms-maturity-governance/spec-036-controlled-block-styling.md`
- `docs/specs/06-cms-editorial-experience/semantic-color-tokens-architecture.md`
- `docs/specs/06-cms-editorial-experience/block-color-theme-architecture.md`

Implementacao relevante:

- `src/styles/tokens.css`
- `src/app/(frontend)/globals.css`
- `src/lib/theme/default-theme.ts`
- `src/lib/theme/map-theme-to-css-variables.ts`
- `src/lib/theme/block-color-theme.ts`
- `src/globals/SiteSettings.ts`
- `src/components/ui/Section.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/Heading.tsx`
- `src/components/ui/Text.tsx`
- `src/components/ui/Icon.tsx`
- `src/blocks/shared/BlockLink.tsx`

## Tokens atuais

| Tokens | Classificacao | Responsabilidade / consumidores | Origem | Decisao |
|---|---|---|---|---|
| `background`, `foreground` | Institutional/base | Pagina e fallback global | Defaults/CMS | Permanecer |
| `surface`, `surface-muted` | Institutional/base | Cards, paineis e tabelas | Defaults | Permanecer; adicionar par explicito para `surface` |
| `primary`, `primary-foreground`, `primary-hover`, `primary-light`, `primary-soft` | Compatibility/legacy | Classes antigas e branding | Identidade institucional | Manter como aliases; descontinuar consumo direto gradualmente |
| `secondary`, `secondary-foreground` | Compatibility/legacy | Superficie forte e overlays | Identidade institucional | Manter como aliases |
| `accent`, `accent-foreground`, `accent-pink` | Base/legacy | Destaques estruturais | Identidade institucional | `accent` pode permanecer canonico; `accent-pink` deve virar fallback de ilustracao |
| `muted`, `muted-foreground` | Global semantic pair | Superficies suaves | Defaults | Permanecer como par |
| `border`, `border-brand` | Global semantic | Bordas | Defaults | Permanecer |
| `focus`, `success`, `warning`, `danger` | System state | Foco e estados | Defaults | Permanecer fora dos schemes estruturais |
| `secondary-green`, `secondary-purple`, `secondary-orange` | Institutional/unclear | Sem consumidores relevantes encontrados | Paleta SMUL | Candidatos a namespace de ilustracao ou deprecacao |
| `page`, `page-foreground` | Global semantic alias | Pagina | `background`/`foreground` | Manter como alias |
| `brand`, `brand-foreground`, `brand-hover` | Global semantic | Areas institucionais fortes | Legacy `primary*` | Permanecer |
| `action`, `action-foreground`, `action-hover` | Global semantic pair | Botoes e CTAs | CMS Button/Button text | Permanecer canonico |
| `heading`, `headline` | Canonico + editorial alias | Headings | CMS Headline | `heading` canonico; `headline` alias editorial |
| `text`, `paragraph` | Compatibility + editorial alias | Texto corrido | CMS Paragraph | Consolidar consumo em `foreground`; manter aliases |
| `text-muted` | Global semantic alias | Texto secundario | `muted-foreground` | Manter temporariamente |
| `link`, `link-hover` | Global semantic | Links fora de Block Scope | CMS Button/legacy link | Manter global; BlockLink dentro de scope deve usar `action` |
| `surface-strong`, `surface-strong-foreground` | Global semantic pair | Scheme secondary | Legacy secondary | Permanecer |
| `accent-soft` | Alias redundante | Poucos consumidores | Accent | Candidato a deprecacao |
| `highlight`, `highlight-foreground` | Ambiguo | Estrutura e ilustracao misturadas | CMS Illustration Highlight | Separar; manter como alias estrutural temporario |
| `secondary-accent`, `secondary-accent-foreground` | Ambiguo | Sem consumidores estruturais claros | Illustration Secondary/legacy | Migrar conceitualmente para namespace de ilustracao |
| `tertiary-accent` | Ambiguo | Sem consumidor encontrado | Illustration Tertiary | Migrar para namespace de ilustracao |
| `illustration-stroke`, `illustration-main` | Illustration | Preparacao para ilustracoes | CMS | Permanecer |
| `block-background`, `block-foreground`, `block-heading` | Block-scoped | Section/Card e primitives | Resolver de scheme | Permanecer |
| `block-action`, `block-action-foreground`, `block-accent` | Block-scoped | Button/Icon | Resolver de scheme | Permanecer |

Faltam aliases explicitos e completos para:

```text
--color-surface-foreground
--color-illustration-highlight
--color-illustration-secondary
--color-illustration-tertiary
```

## Mapeamento atual do CMS

### Elements

| Campo CMS | Field persistido | Mapeamento atual | Desejado | Consumidores | Problema |
|---|---|---|---|---|---|
| Background | `backgroundColor` | `background`, `page` | `background` | Pagina, scheme default | Correto |
| Headline | `headlineColor` | `heading`, `headline` | `heading` | Heading global e default scope | Correto; Rich Text ignora scope |
| Paragraph | `paragraphColor` | `foreground`, `text`, `paragraph` | `foreground` | Body, Text, default scope | Correto; aliases redundantes |
| Button | `buttonColor` | `action`, `primary` parcialmente, `link` | `action` | Button e links | Esta acoplado a link |
| Button text | `buttonTextColor` | `action-foreground` | `actionForeground` | Button | Correto |

### Illustration

| Campo CMS | Field persistido | Mapeamento atual | Token desejado | Problema |
|---|---|---|---|---|
| Stroke | `strokeColor` | `illustration-stroke` | `illustration.stroke` | Correto |
| Main | `mainColor` | `illustration-main` | `illustration.main` | Correto |
| Highlight | `highlightColor` | `accent` e `highlight` estruturais | `illustration.highlight` | Mistura ilustracao com UI estrutural |
| Secondary | `secondaryIllustrationColor` | `secondary-accent` | `illustration.secondary` | Namespace ambiguo |
| Tertiary | `tertiaryColor` | `tertiary-accent` | `illustration.tertiary` | Namespace ambiguo |

## Happy Hues para Semantic Tokens

O mapeamento de Elements e estruturalmente compativel:

| Happy Hues | Papel interno |
|---|---|
| Background | `background` |
| Headline | `heading` |
| Paragraph | `foreground` |
| Button | `action` |
| Button text | `actionForeground` |

A nomenclatura editorial pode permanecer inalterada.

A incompatibilidade esta no grupo Illustration: `highlightColor` atualmente
influencia o `accent` estrutural dos Blocks. Isso precisa ser separado sem
renomear fields persistidos.

## Presets e tones atuais

| Scheme | Background | Foreground | Heading | Action pair | Diagnostico |
|---|---|---|---|---|---|
| `default` | global background | global paragraph | global headline | global action pair | Coerente se os pares CMS forem validos |
| `surface` | surface | global paragraph | global headline | global action pair | Pode produzir texto claro sobre surface claro |
| `muted` | muted | global paragraph | global headline | global action pair | Pode quebrar com paleta global radical |
| `primary` | brand | brand foreground | brand foreground | global action pair | Button pode ter a mesma cor do fundo |
| `brand` | igual a primary | igual a primary | igual a primary | global action pair | Alias historico valido |
| `secondary` | surface strong | surface strong foreground | surface strong foreground | global action pair | Background pair correto; acao pode desaparecer |
| `accent` | highlight | highlight foreground | highlight foreground | global action pair | Mistura cor estrutural com Illustration Highlight |

Os schemes ja retornam seis propriedades, mas ainda nao sao combinacoes
completamente autossuficientes.

## Pontos onde a heranca quebra

1. `.cms-rich-text` usa tokens globais e ignora `--block-foreground` e
   `--block-heading`.
2. A variante `secondary` de Button cria fundo `surface`, mas mantem cores do
   scope externo sem abrir novo scope ou usar um par garantido.
3. BlockLink textual usa `text-link` global, nao o scope atual.
4. FAQ cria uma superficie `bg-surface` por `div`, sem nested scope.
5. Full Width Image Banner muda fundo/overlay, mas compensa manualmente com
   `tone="inverse"`.
6. Hero nao distingue completamente overlay claro e escuro pelo scope;
   Heading/Text usam override `inverse`.
7. Text com `variant="muted"` ou `tone="muted"` usa `muted-foreground` global.
8. Heading e Text ainda expoem `inverse`, permitindo contornar o scope.

## Componentes que criam novas superficies

Devem abrir nested scope:

- `Card` quando usar `surface`, `muted`, `primary/brand`, `secondary` ou `accent`;
- paineis do FAQ;
- Hero com overlay claro ou escuro;
- Full Width Image Banner com overlay;
- controles claros do Carousel quando estiverem em contexto escuro;
- CTA/Card customizado existente.

Nao precisam abrir scope:

- wrappers puramente estruturais;
- containers;
- areas de midia sem texto;
- overlays puramente decorativos sem conteudo proprio.

Caso especial:

- Gallery Lightbox usa preto/branco hardcoded como camada funcional. Deve ser
  auditado separadamente para evitar redesign acidental.

## Aliases e redundancias encontradas

- `heading` e `headline`: canonico + alias editorial.
- `foreground`, `text` e `paragraph`: tres nomes para o mesmo papel.
- `action` e `button`: tecnico + terminologia CMS.
- `actionForeground` e `buttonText`: tecnico + terminologia CMS.
- `primary` e `brand`: legacy/preset versus papel semantico.
- `accent`, `highlight` e Illustration Highlight: conflito real de namespace.
- `secondary`, `secondary-accent` e Illustration Secondary: conflito real.
- `accent-pink`, `tertiary-accent` e Illustration Tertiary: cadeia redundante.
- Os aliases semanticos sao declarados em `tokens.css` e no `:root` de
  `globals.css`.
- O `@theme inline` possui bridges homonimas do Tailwind que nao devem ser
  interpretadas como segunda fonte de verdade.

Nenhum alias deve ser removido nesta refatoracao. A estrategia adequada e marcar
os tokens canonicos, manter bridges e migrar consumidores gradualmente.

## Impacto em dados persistidos

Mudancas previstas:

- nenhuma remocao de fields;
- nenhum rename;
- nenhuma mudanca de tipo;
- nenhum novo field obrigatorio;
- nenhuma alteracao em relationships;
- nenhum novo valor editorial obrigatorio de `tone`;
- campos Happy Hues permanecem com os mesmos nomes;
- campos legados continuam aceitos como fallback.

A separacao de Illustration deve acontecer no mapeamento para CSS, nao no schema
persistido.

## Migration necessaria?

Nao.

O trabalho e uma refatoracao de resolucao, aliases CSS, primitives e wrappers.
Os documentos atuais continuam validos.

O CTA ja possui dados customizados da SPEC-047. Eles devem ser encaminhados ao
mesmo pipeline central, sem remocao ou expansao desses campos.

## Plano de implementacao

1. Formalizar `ColorScheme` e `ColorScope` como APIs reutilizaveis sobre o
   resolvedor atual.
2. Manter `BlockColorTheme` com exatamente seis papeis.
3. Tornar os schemes autossuficientes:
   - `surface` usa seu proprio foreground/heading;
   - `muted` usa seu par;
   - schemes escuros usam uma acao invertida coerente;
   - `accent` deixa de depender do campo Illustration Highlight.
4. Separar completamente Illustration:

   ```text
   illustration-stroke
   illustration-main
   illustration-highlight
   illustration-secondary
   illustration-tertiary
   ```

5. Criar um `ColorScope` reutilizavel e fazer `Section` e `Card` delegarem a ele.
6. Permitir Card estrutural com heranca e Card visual com nested scope conhecido,
   preservando o comportamento atual como fallback.
7. Atualizar primitives:
   - Heading -> scope heading;
   - Text -> scope foreground;
   - Button -> sempre action/actionForeground;
   - Icon -> scope accent;
   - BlockLink -> scope action;
   - Rich Text -> scope atual.
8. Substituir compensacoes `inverse` nos Blocks por scopes em Hero, Full Width
   Image Banner, FAQ, controles internos relevantes do Carousel e CTA existente.
9. Adicionar regressao com scope externo escuro e Cards `surface`, `primary` e
   `secondary`, contendo Heading, Text, Icon e Button.
10. Testar uma paleta radicalmente diferente, verificando que scopes internos nao
    reutilizem acidentalmente foreground/heading do pai.
11. Atualizar documentacao com inventario, matrizes, precedencia, aliases,
    estrategia de deprecacao e divida tecnica.

## Arquitetura final pretendida

```text
CMS terminology
-> Global Semantic Theme
-> Color Scheme
-> Color Scope
-> BlockColorTheme
-> Primitives
```

Para customizacoes existentes e futuras:

```text
semantic overrides
-> mesmo resolvedor de Color Scheme
-> Color Scope
-> BlockColorTheme
-> Primitives
```

Nao devem existir pipelines separados para preset, custom e component variant.

## Fora de escopo

- novo Color Picker;
- geracao automatica de paleta;
- color picker por componente interno;
- CSS ou Tailwind arbitrario;
- campos `cardTitleColor`, `cardTextColor` ou equivalentes;
- refactor completo de `SiteSettings`;
- remocao de compatibilidade legada;
- migration conceitual;
- redesign visual dos Blocks.

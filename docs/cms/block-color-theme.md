# Block Color Theme

Esta nota registra o contrato de cores local usado por Blocks e primitives.

## Contrato

Todo escopo de Block resolve exatamente seis papeis:

| Papel | Responsabilidade |
|---|---|
| `background` | Fundo principal do escopo |
| `foreground` | Texto corrido e conteudo padrao |
| `heading` | Titulos e headings |
| `action` | Botoes e acoes principais |
| `actionForeground` | Conteudo sobre a cor de acao |
| `accent` | Icones, badges e pequenos destaques |

O contrato e implementado por `resolveBlockColorTheme()` em
`src/lib/theme/block-color-theme.ts`.

## Modos

- `inherit`: usa os papeis do tema semantico global.
- `preset`: transforma um `tone` aprovado em uma receita completa.
- `custom`: cria uma paleta semantica local a partir de overrides editoriais.
  CTA, RichText e ImageText estao habilitados para esse modo.

Nos Blocks habilitados, selecionar outro preset oculta e desativa a paleta customizada. Os
valores permanecem armazenados para uma eventual volta ao modo `custom`, mas
nao alteram a renderizacao enquanto outro preset estiver ativo.

## Presets

Os presets preservados sao `default`, `surface`, `muted`, `primary`,
`secondary`, `accent` e o alias historico `brand`.

`default` herda o tema global. Os demais presets sempre resolvem todos os seis
papeis, mesmo quando alteram apenas parte da receita herdada.

## Escopo CSS

O contrato e publicado localmente como:

```text
--block-background
--block-foreground
--block-heading
--block-action
--block-action-foreground
--block-accent
```

Os mesmos nomes possuem fallback em `src/styles/tokens.css`. `Section` cria o
escopo de um Block e `Card` pode criar um escopo composto mais especifico.
Heading, Text, Button e Icon consomem essas variaveis por heranca.

## Precedencia

```text
override semantico explicito
-> preset resolvido
-> tema semantico global
-> campo legado persistido
-> default institucional
```

Os campos legados de `SiteSettings.branding` continuam sendo fontes de fallback
do tema global. Nenhum field foi renomeado ou removido.

## Protecao automatica de contraste

A protecao funciona em duas camadas:

1. o CMS valida a paleta e informa combinacoes editoriais invalidas;
2. o renderer resolve novamente os tokens e substitui valores inseguros caso
   dados invalidos cheguem por draft, API, importacao ou documento legado.

O modo `Tema customizado` tambem exibe uma verificacao em tempo real.
Ela compara texto, acao e destaque com o fundo efetivo, identifica tokens
herdados e, quando houver fallback, mostra a cor solicitada e a cor que sera
usada na pagina. O campo e apenas de interface e nao altera o documento salvo.

O renderer aplica as seguintes regras:

| Token | Contraste minimo | Fallback seguro |
|---|---:|---|
| `foreground` | `4.5:1` contra `background` | preto ou branco, escolhendo o maior contraste |
| `heading` | `4.5:1` contra `background` | `foreground` efetivo |
| `action` | `3:1` contra `background` | `foreground` efetivo |
| `actionForeground` | `4.5:1` contra `action` | preto ou branco, escolhendo o maior contraste |
| `accent` | `4.5:1` contra `background` | `foreground` efetivo |
| `border` | `1.5:1` contra `background` | `foreground` efetivo |

`contrastingForeground()` compara as opcoes neutras clara e escura e seleciona
a de maior contraste. A implementacao fica em `src/lib/theme/semantic-theme.ts`;
as regras por token ficam em `src/lib/theme/block-color-theme.ts`.

### Exemplo

Usar a mesma cor em todos os papeis produz contraste `1:1`:

```text
background: #09edd3
foreground: #09edd3
action:     #09edd3
accent:     #09edd3
```

Nesse caso, o fundo permanece `#09edd3`, enquanto texto, titulo, acao e destaque
sao substituidos pelos fallbacks seguros. No Live Preview isso pode parecer que
somente o campo de fundo foi aplicado; o comportamento e intencional e evita
publicar conteudo ilegivel.

## Consumo atual no CTA

| Token | Uso visual |
|---|---|
| `background` | Fundo do Card |
| `foreground` | Titulo e descricao |
| `action` | Botao ou link principal preenchido |
| `brand` | Disponivel no tema local, mas sem consumidor visual direto no CTA atual |
| `accent` | Disponivel no tema local, mas sem consumidor visual direto no CTA atual |

No Payload Admin, o CTA exibe apenas os controles `background`, `foreground` e
`action`. Os campos `brand` e `accent` permanecem no schema para preservar
documentos existentes, mas ficam ocultos enquanto nao houver consumidor visual
direto no Block. O painel de contraste segue a mesma lista de tokens visiveis.

## Consumo atual no Rich Text

O Rich Text exibe somente `background` e `foreground`. Titulos, texto corrido e
links derivam do `foreground`; `brand`, `action` e `accent` permanecem no schema,
mas ficam ocultos no Payload Admin enquanto nao tiverem consumidor visual direto.
O painel de contraste tambem considera apenas os controles visiveis.

## Consumo atual no ImageText

O ImageText tambem exibe somente `background` e `foreground`. Titulo, conteudo e
CTA textual derivam do `foreground`; `brand`, `action` e `accent` permanecem no
schema, mas ficam ocultos no Payload Admin. O painel de contraste acompanha essa
mesma lista reduzida.

## Consumo atual no ImageBlock

O ImageBlock exibe `background` e `foreground`. O primeiro pinta a secao do
bloco; o segundo estiliza a legenda opcional. Os demais papeis permanecem no
schema, mas ficam ocultos no Payload Admin por nao terem consumidor visual
direto. O painel de contraste considera somente o texto sobre o fundo efetivo.

## Consumo atual no VideoBlock

O VideoBlock exibe `background` e `foreground` para a secao, titulo e legenda.
O player incorporado permanece isolado da paleta editorial. Os demais tokens
continuam no schema, mas ficam ocultos no Payload Admin enquanto nao houver
consumidor visual direto.

## Limites

- Tokens de ilustracao continuam separados em `--color-illustration-*`.
- Nenhum campo por elemento interno foi criado.
- Nenhum CSS ou classe Tailwind pode ser informado pelo editor.
- Os campos aceitam entrada HEX manual e oferecem um Color Picker grafico por
  meio de `src/components/admin/HexColorPicker.tsx`. O picker atualiza o mesmo
  valor persistido pelo campo de texto e respeita os estados `readOnly` e
  `disabled` do Payload Admin.
- A paleta customizada e habilitada gradualmente por Block, com validacao de
  renderizacao antes de cada expansao.

## Divida tecnica auditada

Alguns componentes visuais especializados ainda usam aliases historicos como
`bg-primary`, `bg-secondary` ou `text-primary` para overlays e indicadores. Eles
continuam funcionais pela camada de compatibilidade, mas devem ser classificados
semanticamente antes de uma troca futura. Esta spec nao adicionou novos usos
diretos desses aliases.

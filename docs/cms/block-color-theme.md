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
- `custom`: aplica overrides semanticos sobre uma receita. O modo existe para
  integracao arquitetural; esta implementacao nao adiciona controles editoriais.

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

## Limites

- Tokens de ilustracao continuam separados em `--color-illustration-*`.
- Nenhum campo por elemento interno foi criado.
- Nenhum CSS ou classe Tailwind pode ser informado pelo editor.
- Nenhum Color Picker foi criado nesta etapa.
- Os controles customizados que ja existiam no CTA foram apenas adaptados ao
  contrato central, sem expansao para outros Blocks.

## Divida tecnica auditada

Alguns componentes visuais especializados ainda usam aliases historicos como
`bg-primary`, `bg-secondary` ou `text-primary` para overlays e indicadores. Eles
continuam funcionais pela camada de compatibilidade, mas devem ser classificados
semanticamente antes de uma troca futura. Esta spec nao adicionou novos usos
diretos desses aliases.

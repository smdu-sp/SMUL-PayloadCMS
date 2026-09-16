# Semantic color tokens

Esta nota registra a camada semantica de cores usada pela configuracao global do site.

## Papeis

| Token | Papel visual | Origem atual |
|---|---|---|
| `--color-brand` | Identidade institucional e areas fortes | `buttonColor` |
| `--color-action` | Botoes principais e chamadas clicaveis | `buttonColor` |
| `--color-heading` | Titulos editoriais e headings de secao | `headlineColor` |
| `--color-headline` | Alias editorial para titulos | `headlineColor` |
| `--color-link` | Links textuais | `buttonColor` |
| `--color-paragraph` | Texto corrido editorial | `paragraphColor` |
| `--color-surface` | Cards e paineis claros | fallback do Design System |
| `--color-muted` | Fundos suaves e areas de apoio | fallback do Design System |
| `--color-accent` | Destaques menores, icones e detalhes | `accentColor` |
| `--color-highlight` | Alias editorial para destaque | `highlightColor` |
| `--color-secondary-accent` | Destaque secundario | `secondaryIllustrationColor`, fallback `secondaryAccentColor` ou `secondaryColor` |
| `--color-tertiary-accent` | Destaque terciario | `tertiaryColor`, fallback `tertiaryAccentColor` |
| `--color-illustration-stroke` | Contorno de ilustracoes | `strokeColor` |
| `--color-illustration-main` | Cor principal de ilustracoes | `mainColor` |

Estados de sistema continuam separados:

```text
--color-success
--color-warning
--color-danger
--color-focus
```

## Regras

- Components devem consumir tokens por papel visual.
- `buttonColor` alimenta os aliases tecnicos `primary`, `brand`, `action` e `link`.
- `secondaryIllustrationColor` alimenta o alias tecnico `secondary`.
- `highlightColor` alimenta o alias tecnico `accent`.
- `secondaryColor` permanece como superficie forte (`surface-strong`).
- `accentColor` permanece para detalhes e destaques menores.
- Color pickers futuros devem gravar em papeis semanticos, nao em propriedades internas como `cardTitleColor`, `cardBorderColor` ou `iconColor`.
- Pares customizados de foreground/background devem passar por validacao de contraste.

## Campos globais

A aba de configuracao do site expoe campos opcionais no grupo `branding`. Ausencia, vazio ou `null` significam herdar o fallback. A lista visivel segue a composicao do Happy Hues.

### Elements

| Campo editorial | Field | Token/papel |
|---|---|---|
| Background | `backgroundColor` | `background` / `page` |
| Headline | `headlineColor` | `headline` / `heading` |
| Paragraph | `paragraphColor` | `paragraph` / `text` |
| Button | `buttonColor` | `action` |
| Button text | `buttonTextColor` | `actionForeground` |

### Illustration

| Campo editorial | Field | Token/papel |
|---|---|---|
| Stroke | `strokeColor` | `illustrationStroke` |
| Main | `mainColor` | `illustrationMain` |
| Highlight | `highlightColor` | `highlight` |
| Secondary | `secondaryIllustrationColor` | `secondaryAccent` |
| Tertiary | `tertiaryColor` | `tertiaryAccent` |

Os campos legados `primaryColor`, `secondaryColor`, `accentColor`, `actionColor`, `actionForegroundColor`, `linkColor`, `secondaryAccentColor` e `tertiaryAccentColor` continuam ocultos no schema apenas para compatibilidade com documentos persistidos. Seus valores nao participam mais da paleta renderizada.

## Primitives

| Primitive | Token principal |
|---|---|
| `Button` | `action` |
| `BlockLink` | `link` |
| `Heading` | `heading` |
| `Section` | `brand`, `action`, `surface-strong`, `accent` conforme tone |
| `Card` | `surface`, `muted`, `accent`, `brand` |
| `Icon` | `action`, `brand`, `accent` ou estados |

## Compatibilidade

Os tokens antigos continuam existindo:

```text
--color-primary
--color-secondary
--color-accent
```

Eles sao mantidos para compatibilidade e como fonte inicial dos novos papeis semanticos.

---
spec: unnumbered
title: Semantic Color Tokens Architecture
status: implemented
summary: Reestruturar os tokens semanticos de cor antes de expandir color picker e customizacao editorial por Block.
source: Discussao editorial sobre conflitos entre cores globais, headings, botoes e futuros color pickers.
---

> **Regra de execucao:** implemente exclusivamente esta Spec. Nao antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicaveis, registre decisoes e declare explicitamente o que nao foi implementado.

# Semantic Color Tokens Architecture

## 1. Objetivo

Reestruturar a camada semantica de tokens de cor para evitar que uma unica cor configuravel carregue responsabilidades visuais diferentes.

O problema atual e que poucos tokens globais, como cor principal, secundaria e destaque, acabam sendo usados por papeis distintos da interface. Quando o editor muda a cor principal para verde, por exemplo, alguns elementos continuam visualmente ligados ao azul porque headings, links, botoes ou surfaces ainda dependem de tokens antigos ou derivados implicitos.

Esta Spec cria uma base mais clara para que futuros color pickers possam mapear escolhas editoriais para papeis visuais especificos, sem transformar o CMS em editor de CSS.

---

## 2. Escopo

- Auditar o uso atual de tokens de cor em primitives, Blocks e CSS global.
- Definir uma taxonomia semantica minima para cores globais.
- Separar papeis visuais que hoje podem estar acoplados, como marca, acao, headings e destaques.
- Atualizar primitives para consumir tokens pelo papel visual correto.
- Manter compatibilidade visual com o tema atual quando nao houver configuracao nova.
- Documentar a matriz de tokens e responsabilidades.
- Adicionar testes para garantir que primitives e mapeamento de tema usam os tokens semanticos corretos.

---

## 3. Fora de escopo

- Nao implementar o componente visual de color picker.
- Nao expandir custom colors para todos os Blocks.
- Nao criar controles por elemento interno, como cor de titulo, texto, borda, icone ou botao individual.
- Nao remover os tokens atuais sem camada de compatibilidade.
- Nao alterar identidade visual institucional sem decisao explicita.
- Nao criar novas collections.

---

## 4. Contexto e dependencias

Ler antes da implementacao:

```text
docs/specs/03-design-system/spec-012-design-tokens-foundation.md
docs/specs/03-design-system/spec-013-theme-global-branding.md
docs/specs/06-cms-editorial-experience/spec-046-theme-color-reset.md
docs/specs/06-cms-editorial-experience/spec-047-controlled-custom-colors.md
docs/cms/theme-color-reset.md
docs/cms/block-catalog.md
docs/cms/schema-evolution-migrations.md
src/styles/tokens.css
src/app/(frontend)/globals.css
src/lib/theme/default-theme.ts
src/lib/theme/map-theme-to-css-variables.ts
src/components/ui/
```

Esta Spec deve ser tratada como pre-requisito conceitual para a evolucao do color picker.

---

## 5. Regras de implementacao

- Tokens devem representar papeis visuais, nao nomes de cores.
- Presets continuam sendo a opcao principal para editores.
- Color picker futuro deve escrever em papeis semanticos, nao em seletores ou CSS arbitrario.
- Primitives devem depender de tokens semanticos estaveis.
- Blocks devem herdar cores de primitives ou tokens do proprio Block.
- Nao criar dezenas de campos de cor por componente interno.
- Nao hardcodar novas cores institucionais em componentes React.
- Manter fallback para documentos e configuracoes existentes.
- Validar contraste quando foreground/background forem configuraveis.

---

## 6. Impacto em dados persistidos

| Area | Mudanca | Classificacao | Migration |
|---|---|---|---|
| `SiteSettings.branding` | Possivel expansao futura de campos opcionais de cor por papel visual | Novo field opcional | Nao exige migration se houver fallback |
| CSS tokens | Novos tokens semanticos derivados dos atuais | Compatibilidade de tema | Nao exige migration |
| Primitives | Troca de token consumido por papel visual | Refatoracao interna | Nao exige migration |

Renames ou remocoes de campos existentes em `SiteSettings` nao devem ser feitos nesta Spec sem plano de migration explicito.

---

## 7. Implementacao esperada

### 7.1 Auditoria de tokens atuais

Mapear onde estes tokens sao usados:

```text
--color-primary
--color-secondary
--color-accent
--color-heading
--color-link
--color-brand
--color-surface
--color-muted
```

Registrar quais usos representam:

- identidade institucional;
- acao principal;
- heading editorial;
- link;
- superficie;
- destaque;
- estado de sistema.

### 7.2 Nova taxonomia semantica

Definir pelo menos os seguintes papeis internos:

```text
brand
action
heading
link
surface
muted
accent
```

Para a experiencia editorial futura, estes papeis devem ser apresentados em uma linguagem mais intuitiva, seguindo a composicao do Happy Hues:

```text
Elements:
background
headline
paragraph
button
buttonText

Illustration:
stroke
main
highlight
secondary
tertiary
```

Os nomes editoriais nao precisam ser iguais aos tokens tecnicos, mas devem mapear de forma clara para eles.

Estados de sistema devem continuar separados:

```text
success
warning
danger
focus
```

### 7.3 Mapeamento inicial

Manter o visual atual como fallback:

| Papel | Responsabilidade |
|---|---|
| `brand` | identidade institucional e areas fortes |
| `action` | botoes principais e chamadas clicaveis |
| `heading` | titulos editoriais e headings de secao |
| `link` | links textuais |
| `surface` | cards, paineis e superficies |
| `muted` | fundos suaves e areas de apoio |
| `accent` | icones, badges, detalhes e realces menores |

### 7.4 Atualizacao de primitives

Revisar, no minimo:

```text
Button
Card
Heading
Text
Icon
Section
BlockLink
```

Cada primitive deve consumir o token do papel visual adequado.

### 7.5 Preparacao para color picker

Documentar como o futuro color picker devera mapear campos para papeis:

```text
Cor de marca -> brand
Cor de acao -> action
Cor de titulos -> heading
Cor de links -> link
Cor de destaque -> accent
```

O color picker deve usar os dois grupos do Happy Hues:

### 7.5.1 Elements

Expor os papeis estruturais da pagina:

| Campo editorial | Papel tecnico sugerido | Uso esperado |
|---|---|---|
| Background | `background` / `surface` | Fundo de secoes, cards ou areas editoriais |
| Headline | `headline` / `heading` | Titulos de secao e headings editoriais |
| Paragraph | `paragraph` / `text` | Texto corrido e descricoes |
| Button | `button` / `action` | Botoes principais e chamadas clicaveis |
| Button text | `buttonText` / `actionForeground` | Texto dentro de botoes fortes |

### 7.5.2 Illustration

Expor os papeis de apoio visual:

| Campo editorial | Papel tecnico sugerido | Uso esperado |
|---|---|---|
| Stroke | `stroke` / `illustrationStroke` | Contornos em ilustracoes e detalhes graficos |
| Main | `main` / `illustrationMain` | Cor principal de ilustracoes e areas graficas |
| Highlight | `highlight` / `accent` | Icones, badges, detalhes e enfases menores |
| Secondary | `secondary` / `secondaryAccent` | Apoio visual, graficos simples ou variacoes de enfase |
| Tertiary | `tertiary` / `tertiaryAccent` | Uso raro para composicoes futuras, sem obrigar Blocks atuais |

Os grupos nao devem criar controles por elemento interno. Eles apenas abrem papeis semanticos adicionais.

O picker nao deve escrever em propriedades internas como:

```text
cardTitleColor
cardBorderColor
buttonTextColor
iconColor
```

---

## 8. Testes e validacao

Validacoes aplicaveis:

```text
lint
typecheck
unit
build
```

Testes esperados:

- mapeamento de tema para variaveis CSS;
- fallback para configuracoes antigas;
- primitives usam os tokens semanticos corretos;
- contraste permanece validavel para pares foreground/background;
- nenhuma API editorial passa a aceitar CSS arbitrario.

---

## 9. Criterios de aceite

- [x] tokens semanticos foram definidos por papel visual;
- [x] modo simples e modo avancado do futuro color picker foram documentados;
- [x] visual atual possui fallback compativel;
- [x] primitives principais usam papeis semanticos claros;
- [x] docs explicam como futuros color pickers devem mapear cores;
- [x] nao foram criados controles de cor por elemento interno;
- [x] impacto em dados persistidos foi avaliado;
- [x] testes aplicaveis foram executados;
- [x] build passa ou pendencia foi registrada;
- [x] o que nao foi implementado foi declarado.

---

## 10. Registro de implementacao

Foram adicionados aliases semanticos para aproximar o modelo tecnico da linguagem editorial:

```text
headline
paragraph
button
buttonText
stroke
main
highlight
secondary
tertiary
```

O tema global continua aceitando os tres campos atuais de branding. Eles alimentam a nova camada por fallback, sem exigir migration:

```text
buttonColor -> primary (alias), brand, action, link
headlineColor -> heading/headline
secondaryIllustrationColor -> secondary (alias)
highlightColor -> accent (alias)
secondaryColor -> surface-strong, secondaryAccent
accentColor -> accent/highlight
```

Tambem foram adicionados campos opcionais em `SiteSettings.branding` para customizacao semantica:

```text
backgroundColor
headlineColor
paragraphColor
buttonColor
buttonTextColor
strokeColor
mainColor
highlightColor
secondaryIllustrationColor
tertiaryColor
```

Quando vazios, esses campos herdam os tokens legados ou os defaults SMUL. O reset de tema limpa todos os overrides de cor. Os campos antigos permanecem no schema como fallback oculto, nao como controles visiveis para o editor.

As primitives principais passaram a consumir os papeis semanticos, e os tokens antigos continuam existindo como base de compatibilidade.

Nao foi implementado nesta etapa:

- componente visual de color picker;
- controles por elemento interno;
- migration de documentos persistidos.

---

## 11. Prompt base para execucao

```text
Implemente exclusivamente a spec sem numeracao descrita em:

docs/specs/06-cms-editorial-experience/semantic-color-tokens-architecture.md

Antes de alterar arquivos:

1. Leia a Spec inteira.
2. Inspecione o projeto atual.
3. Liste os arquivos que pretende alterar.
4. Identifique conflitos com a arquitetura existente.
5. Informe se a Spec exige migration.
6. Nao implemente o color picker visual nesta etapa.
7. Nao crie campos de cor por elemento interno.
8. Preserve conteudo e visual existentes por fallback.
9. Nao adicione dependencias sem justificativa.
10. Execute lint, typecheck, testes aplicaveis e build.

Ao finalizar, entregue:

## Implementacao

### Arquivos criados

### Arquivos modificados

### Decisoes arquiteturais

### Migrations

### Testes executados

### Resultado

### Criterios de aceite atendidos

### Criterios pendentes

### Desvios da Spec

### Divida tecnica encontrada

### O que NAO foi implementado
```

---

## 12. Convencoes desta spec sem numeracao

- Esta spec nao deve ser adicionada a sequencia historica numerada ate receber uma decisao de priorizacao.
- O arquivo usa lowercase kebab-case ASCII.
- A implementacao deve atualizar `docs/specs/README.md` apenas se esta spec passar a fazer parte da sequencia oficial.

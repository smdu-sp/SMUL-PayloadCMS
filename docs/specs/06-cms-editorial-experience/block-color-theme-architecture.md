---
spec: unnumbered
title: Block Color Theme Architecture
status: implemented
summary: Introduzir um escopo semântico de cores por Block que unifique presets existentes, herança global e futura customização por Color Picker.
source: Evolução das SPEC-031, SPEC-036 e Semantic Color Tokens Architecture.
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não implemente o componente visual de Color Picker e não antecipe a SPEC-047. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# Block Color Theme Architecture

## 1. Objetivo

Criar uma camada intermediária de tema de cores por Block para permitir que:

- os presets existentes da SPEC-036 continuem funcionando;
- os Blocks herdem corretamente o tema global;
- futuras cores customizadas sejam aplicadas sem criar lógica específica em cada componente;
- primitives consumam papéis semânticos estáveis;
- o editor não precise configurar individualmente cada elemento visual;
- customizações locais continuem coerentes, legíveis e acessíveis.

A arquitetura deve evoluir de:

```text
Global Theme
↓
tone
↓
Block / Component
```

para:

```text
Institutional Theme
↓
Global Semantic Theme
↓
Tone Preset
↓
Block Theme Scope
↓
Primitives
```

O `Block Theme Scope` será o contrato único utilizado por Blocks e componentes internos.

---

## 2. Contexto

A SPEC-031 estabeleceu:

```text
SMUL Identity
↓
Design Tokens
↓
Semantic Tokens
↓
Primitives
↓
Blocks
```

A SPEC-036 introduziu styling editorial controlado:

```text
appearance
├── tone
├── spacing
├── width
└── alignment
```

com tons como:

```text
default
surface
muted
primary
secondary
accent
```

O editor seleciona intenção visual, e não cores concretas.

A arquitetura de Semantic Color Tokens posteriormente separou responsabilidades antes acopladas em poucos tokens globais.

O próximo passo é impedir que a futura customização por cor crie um segundo sistema paralelo ao sistema de presets.

---

## 3. Problema

Atualmente existem três necessidades diferentes:

```text
1. Herdar o tema global
2. Aplicar um preset controlado
3. Futuramente aplicar uma combinação customizada
```

Essas três possibilidades não devem resultar em três implementações diferentes.

Também deve ser evitado:

```text
if tone === primary
if customBackground
if customHeading
if customButton
...
```

espalhado por Blocks e primitives.

Sem uma camada intermediária, a customização tende a produzir campos específicos como:

```text
cardTitleColor
cardTextColor
faqHeadingColor
iconColor
buttonColor
buttonTextColor
```

Esse modelo não é permitido.

---

## 4. Princípio arquitetural

Todas as fontes de estilo devem resolver para o mesmo contrato:

```text
                inherit
                   │
                   │
preset ──────> BlockColorTheme <────── custom
                   │
                   ▼
               primitives
```

O Block e suas primitives não devem precisar saber se o tema veio de:

```text
Global Theme
Preset
Custom configuration
```

Eles apenas recebem os tokens semânticos resolvidos.

---

## 5. Contrato mínimo de Block Theme

Definir um contrato semântico pequeno e estável.

Conceitualmente:

```text
BlockColorTheme
├── background
├── foreground
├── heading
├── action
├── actionForeground
└── accent
```

Esses nomes podem ser adaptados à convenção existente do projeto, desde que as responsabilidades permaneçam equivalentes.

### 5.1 Responsabilidades

| Token | Responsabilidade |
|---|---|
| `background` | Fundo principal do Block |
| `foreground` | Texto corrido e conteúdo padrão |
| `heading` | Títulos e headings |
| `action` | Ações principais e botões |
| `actionForeground` | Conteúdo sobre a cor de ação |
| `accent` | Ícones, badges e pequenos destaques |

Não adicionar novos tokens sem necessidade concreta.

---

## 6. Pares semânticos

Cores de fundo e foreground devem ser tratadas como pares.

Pares mínimos:

```text
background ↔ foreground
background ↔ heading
action ↔ actionForeground
```

Quando aplicável:

```text
background ↔ link
surface ↔ surfaceForeground
brand ↔ brandForeground
```

A implementação deve preservar a possibilidade de validação de contraste entre os pares.

---

## 7. Relação com o tema global

O Block Theme deve herdar o Global Semantic Theme por padrão.

Exemplo conceitual:

```text
Global Theme

background
foreground
heading
action
actionForeground
accent
```

Sem configuração local:

```text
BlockColorTheme
↓
inherit global values
```

Nenhum override deve ser persistido desnecessariamente.

---

## 8. Relação com os presets existentes

Os presets da SPEC-036 continuam sendo a interface editorial principal.

```text
default
surface
muted
primary
secondary
accent
```

Um preset passa a representar uma **receita semântica**, e não apenas uma cor.

Exemplo conceitual:

```text
tone: primary

background
→ brand

foreground
→ brandForeground

heading
→ brandForeground

action
→ action

actionForeground
→ actionForeground

accent
→ accent
```

Outro exemplo:

```text
tone: surface

background
→ surface

foreground
→ surfaceForeground

heading
→ heading

action
→ action

actionForeground
→ actionForeground

accent
→ accent
```

Os valores concretos devem continuar vindo do Design System.

---

## 9. Modos do Block Theme

O resolver deve reconhecer três comportamentos conceituais:

```text
inherit
preset
custom
```

### 9.1 Inherit

```text
inherit
↓
nenhum override
↓
Global Semantic Theme
```

### 9.2 Preset

```text
preset
↓
receita semântica
↓
BlockColorTheme
```

### 9.3 Custom

Reservado para futura integração com a SPEC-047:

```text
custom
↓
overrides semânticos
↓
BlockColorTheme
```

Esta Spec deve preparar suporte técnico ao modo `custom`, mas não implementar a interface editorial de Color Picker.

---

## 10. Resolução do tema

Criar uma única camada responsável por resolver o tema efetivo.

Conceitualmente:

```text
resolveBlockColorTheme()
```

Fluxo:

```text
Global Semantic Theme
        ↓
appearance.tone
        ↓
preset / inherit / custom overrides
        ↓
resolved BlockColorTheme
```

A lógica não deve ser replicada individualmente em cada Block.

---

## 11. Variáveis CSS locais

O tema resolvido deve ser exposto através de um escopo local previsível.

Exemplo conceitual:

```text
--block-background
--block-foreground
--block-heading
--block-action
--block-action-foreground
--block-accent
```

Com fallback para os tokens globais.

Exemplo:

```css
--block-background: var(--color-background);
--block-foreground: var(--color-foreground);
--block-heading: var(--color-heading);
--block-action: var(--color-action);
--block-action-foreground: var(--color-action-foreground);
--block-accent: var(--color-accent);
```

A nomenclatura final deve respeitar o padrão atual do projeto.

---

## 12. Primitives

Primitives devem consumir o escopo local antes dos tokens globais.

Exemplo conceitual:

```text
Heading
→ block heading
→ global heading
```

```text
Text
→ block foreground
→ global foreground
```

```text
Button
→ block action
→ block actionForeground
```

```text
Icon
→ block accent
→ global accent
```

Não adicionar regras específicas por Block quando uma primitive puder resolver o comportamento.

---

## 13. Componentes compostos

Componentes internos devem herdar o Block Theme.

Exemplo:

```text
Block
├── Heading
├── Text
├── Card
│   ├── Icon
│   ├── Heading
│   └── Text
└── Button
```

Todos devem receber cores por herança semântica.

Não criar:

```text
cardHeadingColor
cardTextColor
cardIconColor
buttonBackgroundColor
```

---

## 14. Illustration tokens

Tokens específicos de ilustração permanecem separados do Block Theme estrutural.

Usar namespace explícito:

```text
illustration.stroke
illustration.main
illustration.highlight
illustration.secondary
illustration.tertiary
```

ou equivalente em CSS.

Componentes que não trabalham com ilustrações não devem depender desses tokens.

O Block Theme estrutural não deve crescer apenas para acomodar paletas específicas de ilustração.

---

## 15. Compatibilidade com tokens existentes

A implementação deve preservar:

```text
primary
secondary
accent
surface
muted
```

quando utilizados como aliases, presets ou compatibilidade histórica.

A precedência recomendada é:

```text
1. override semântico explícito
2. preset resolvido
3. semantic token global
4. legacy fallback
5. default institucional
```

A implementação deve adaptar essa precedência à arquitetura atual sem remover campos persistidos existentes.

---

## 16. Relação com SiteSettings

Esta Spec não deve reorganizar collections ou Globals persistidos apenas para melhorar nomenclatura.

Campos existentes podem continuar em:

```text
SiteSettings.branding
```

enquanto forem necessários por compatibilidade.

Entretanto, novos consumidores devem tratá-los como fonte para o `Global Semantic Theme`, e não acessar esses campos diretamente nos Blocks.

Fluxo esperado:

```text
SiteSettings / defaults
↓
mapThemeToSemanticTokens
↓
Global Semantic Theme
↓
resolveBlockColorTheme
↓
Block
```

---

## 17. Preparação para SPEC-047

A futura SPEC-047 deve utilizar esta arquitetura.

O Color Picker não deve aplicar estilos diretamente nos componentes.

Fluxo esperado:

```text
Editor
↓
Custom colors
↓
semantic overrides
↓
resolveBlockColorTheme()
↓
CSS variables do Block
↓
Primitives
```

O futuro schema editorial pode ser conceitualmente semelhante a:

```text
appearance
├── tone
│   ├── default
│   ├── surface
│   ├── muted
│   ├── primary
│   ├── secondary
│   ├── accent
│   └── custom
└── customTheme?
```

Esta Spec não deve adicionar os controles editoriais de `customTheme` caso eles ainda não existam.

---

## 18. Impacto em dados persistidos

| Área | Mudança | Classificação | Migration |
|---|---|---|---|
| `appearance.tone` | Preservado | Compatibilidade | Não |
| Tokens CSS | Adição de aliases/escopo local | Refatoração | Não |
| Primitives | Passam a consumir Block Theme | Refatoração interna | Não |
| Blocks | Remoção de lógica duplicada quando existente | Refatoração interna | Não |
| Custom colors | Apenas preparação arquitetural | Fora de persistência nesta Spec | Não |

Não renomear ou remover fields persistidos sem migration explícita.

---

## 19. Fora de escopo

Não implementar:

- componente visual de Color Picker;
- customização arbitrária de cores;
- campos individuais por componente;
- CSS livre;
- Tailwind classes editoriais;
- HEX livre em todos os Blocks;
- reorganização completa de `SiteSettings`;
- nova identidade institucional;
- novos presets sem necessidade;
- cálculo automático de paleta;
- substituição da SPEC-036.

---

## 20. Auditoria antes da implementação

Inspecionar pelo menos:

```text
src/styles/tokens.css
src/app/(frontend)/globals.css
src/lib/theme/
src/components/ui/
src/blocks/
```

Localizar:

- uso direto de `primary`;
- uso direto de `secondary`;
- uso direto de `accent`;
- branches específicos por `tone`;
- hardcoded colors;
- Blocks sobrescrevendo primitives;
- componentes que não herdam tokens corretamente.

Registrar dívida técnica encontrada sem necessariamente corrigi-la fora do escopo.

---

## 21. Testes

Executar quando aplicáveis:

```text
lint
typecheck
unit
build
```

Adicionar testes para:

### Resolver

```text
inherit
preset
fallback
```

### Presets

Garantir que:

```text
tone=primary
```

e demais tons resolvam para combinações completas de tokens.

### Primitives

Garantir que primitives usem:

```text
Block Theme
↓ fallback
Global Semantic Theme
```

### Compatibilidade

Páginas existentes devem manter o visual esperado quando nenhum novo override estiver configurado.

---

## 22. Critérios de aceite

- [x] existe um contrato único de `BlockColorTheme`;
- [x] contrato possui conjunto mínimo de papéis semânticos;
- [x] presets da SPEC-036 resolvem para esse contrato;
- [x] modo sem override herda corretamente o tema global;
- [x] existe uma única função/camada de resolução de Block Theme;
- [x] Blocks não replicam lógica de resolução de cor;
- [x] primitives consomem tokens locais com fallback global;
- [x] componentes internos herdam cores do Block;
- [x] nenhuma cor por componente interno foi criada;
- [x] tokens de ilustração permanecem separados;
- [x] fallbacks legados continuam funcionando;
- [x] documentos antigos não exigem migration;
- [x] arquitetura está preparada para SPEC-047;
- [x] Color Picker não foi implementado;
- [x] lint, typecheck, testes e build aplicáveis foram executados.

---

## 23. Checkpoint arquitetural

Após implementação, validar:

### Cenário 1 — Tema global

```text
Global Theme muda
↓
Blocks sem override mudam automaticamente
```

Resultado esperado:

```text
Sim
```

### Cenário 2 — Preset

```text
tone = primary
```

deve produzir uma combinação visual completa, não apenas alterar background.

Resultado esperado:

```text
Sim
```

### Cenário 3 — Componentes internos

Card, Heading, Text e Button devem herdar corretamente o contexto visual.

Resultado esperado:

```text
Sim
```

### Cenário 4 — Customização futura

É possível introduzir cores customizadas sem alterar a implementação de cada primitive?

Resultado esperado:

```text
Sim
```

### Cenário 5 — Page Builder

O editor consegue definir cor independente para cada pequeno elemento?

Resultado esperado:

```text
Não
```

---

## 24. Arquitetura final esperada

```text
SMUL Identity
      ↓
Institutional Defaults
      ↓
Global Semantic Theme
      ↓
┌───────────────┬───────────────┐
│               │               │
inherit       preset          custom
│               │               │
└───────────────┼───────────────┘
                ↓
        BlockColorTheme
                ↓
        Local CSS Scope
                ↓
        UI Primitives
                ↓
             Blocks
```

---

## 25. Relação com Specs existentes

```text
SPEC-031
Identidade Visual SMUL
        ↓
Semantic Color Tokens Architecture
        ↓
SPEC-036
Controlled Block Styling
        ↓
Block Color Theme Architecture
        ↓
SPEC-047
Controlled Custom Colors
```

A nova arquitetura não substitui nenhuma dessas etapas.

Ela formaliza a integração entre elas.

---

## 26. Registro de implementação

- `resolveBlockColorTheme()` centraliza os modos `inherit`, `preset` e `custom`.
- Os presets resolvem receitas completas para seis papéis semânticos.
- `Section` e `Card` publicam o tema resolvido em variáveis CSS locais.
- `Heading`, `Text`, `Button` e `Icon` consomem o escopo local.
- O CTA existente foi adaptado ao contrato sem adicionar controles editoriais.
- Fallbacks de `SiteSettings.branding` legados foram restaurados.
- Não houve mudança de schema persistido e nenhuma migration é necessária.

Não foram implementados Color Picker, novos campos customizados, novos presets,
paleta automática ou expansão de customização para outros Blocks.

---

## 27. Prompt base para execução

```text
Implemente exclusivamente a spec sem numeração descrita em:

docs/specs/06-cms-editorial-experience/block-color-theme-architecture.md

Antes de alterar arquivos:

1. Leia esta Spec inteira.
2. Leia SPEC-031, SPEC-036 e semantic-color-tokens-architecture.
3. Inspecione tokens, theme mapping, primitives e Blocks.
4. Liste arquivos que pretende alterar.
5. Identifique usos diretos de tokens antigos.
6. Informe se alguma alteração exige migration.
7. Preserve o comportamento dos presets atuais.
8. Não implemente o Color Picker.
9. Não crie campos de cor por elemento interno.
10. Não remova fallbacks existentes sem plano de migration.
11. Não adicione dependências sem justificativa.
12. Execute lint, typecheck, testes aplicáveis e build.

Ao finalizar, entregue:

## Implementação

### Arquivos criados

### Arquivos modificados

### Decisões arquiteturais

### Migrations

### Testes executados

### Resultado

### Critérios de aceite atendidos

### Critérios pendentes

### Desvios da Spec

### Dívida técnica encontrada

### O que NÃO foi implementado
```

---

## 28. Diretriz de expansão

O contrato inicial deve permanecer pequeno:

```text
background
foreground
heading
action
actionForeground
accent
```

Não adicionar automaticamente:

```text
link
border
surface
icon
card
```

ao `BlockColorTheme`.

Esses papéis podem continuar globais, derivados ou herdados enquanto não houver um caso concreto que exija variação local.

O sucesso desta arquitetura depende de preservar um contrato mínimo e previsível, evitando transformar a customização editorial em um page builder genérico.

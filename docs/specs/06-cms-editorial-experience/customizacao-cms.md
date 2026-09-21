# Plano de Implementação — Customização Controlada do CMS

## Objetivo

Evoluir a customização editorial do CMS sem transformar o sistema em um page builder genérico.

O ciclo deve consolidar primeiro os comportamentos visuais e de acessibilidade no Design System e, somente depois, ampliar os controles disponíveis ao editor.

A arquitetura de cores atual permanece como fundação:

```text
Institutional Defaults
        ↓
Minimal Base Palette
        ↓
Global Semantic Theme
        ↓
Color Scheme Recipes
        ↓
Color Scope
        ↓
Nested Color Scopes
        ↓
Primitives
        ↓
Blocks
```

A partir desta base, o próximo ciclo deve evoluir:

```text
Arquitetura de cores
        ↓
Surface & Border Normalization
        ↓
Interaction States Architecture
        ↓
Modular Appearance Fields
        ↓
Semantic State Components
        ↓
Accessibility Baseline & Audit
        ↓
Editorial Accessibility Guardrails
        ↓
Controlled Customization V2
```

---

# 0. Checkpoint da arquitetura atual

Antes de ampliar a customização, validar o estado atual da arquitetura.

## Objetivo

Garantir que as próximas funcionalidades não reintroduzam cores concretas, exceções locais ou regras específicas por Block.

## Validar

| Área | Resultado esperado |
|---|---|
| Cards | usam Color Scheme / Color Scope |
| FAQ | usa Color Scheme / Color Scope |
| Rich Text | respeita o scope atual |
| Button | usa `action` + `actionForeground` |
| Heading | usa `heading` |
| Text | usa `foreground` |
| Icon | usa `accent` |
| Nested surfaces | abrem scope próprio quando necessário |
| Hardcoded colors | somente quando funcionalmente justificadas |

## Não reintroduzir

```text
bg-white
text-white
cardBorderColor
faqBackground
buttonHoverColor
cardTextColor
cardHeadingColor
```

---

# 1. SPEC-056 — Visual Surface & Border Normalization

## Objetivo

Normalizar superfícies e bordas para que Cards, FAQ, imagens, painéis e outros componentes não dependam de cores concretas.

## Tokens mínimos

Formalizar ou revisar:

```text
surface
surfaceForeground

muted
mutedForeground

border
```

Adicionar `borderSubtle` somente se houver mais de um caso concreto que justifique a separação.

## Surface

Cards e FAQ podem continuar visualmente claros, mas devem utilizar intenção semântica:

```text
scheme = surface
```

e não:

```text
background = white
```

A cor concreta deve continuar sendo responsabilidade do Theme.

## Border

Componentes devem consumir:

```text
border
```

O contexto visual determina seu valor.

Exemplo:

```text
surface scheme
→ border adequado para superfície clara

brand scheme
→ border adequado para superfície forte
```

O componente não deve saber qual cor concreta está sendo utilizada.

## Auditar

- Card;
- FAQ;
- Image containers;
- Gallery;
- CTA;
- Tables;
- Panels;
- Banners;
- componentes com `border`;
- componentes que utilizam cores concretas para separar superfícies.

## Critérios de aceite

- Cards não dependem de branco hardcoded;
- FAQ não depende de branco hardcoded;
- borders são semânticos;
- borders funcionam em schemes claros e escuros;
- alteração radical da paleta não produz bordas invisíveis ou excessivamente claras;
- não foram adicionados campos editoriais de cor de borda.

---

# 2. SPEC-057 — Interaction States Architecture

## Objetivo

Criar uma arquitetura consistente para estados de interação.

Abrange:

```text
hover
focus
active
disabled
motion
```

## Não expor ao CMS

Não criar:

```text
hoverColor
hoverBackground
hoverScale
hoverOpacity
hoverBorder
transitionDuration
```

## Interaction presets

Criar uma linguagem de intenção controlada.

Ponto de partida conceitual:

```text
interaction
├── none
├── subtle
├── default
└── emphasized
```

A quantidade final de presets deve ser a menor necessária após auditoria dos componentes.

## Button

Auditar:

```text
hover
focus-visible
active
disabled
```

Button deve continuar consumindo os pares semânticos de seu scope.

## Links

Auditar:

```text
hover
focus-visible
active
```

Evitar depender apenas de aumento de font-weight quando isso causa layout shift ou feedback visual insuficiente.

## Cards interativos

Avaliar:

```text
hover
focus-within
border
surface
transform
```

O comportamento deve vir de presets controlados.

## Gallery

A estrutura de Gallery deve permitir feedback mais perceptível para:

```text
hover
focus
selected/open
```

Podem ser utilizados efeitos controlados como:

```text
zoom leve
overlay
border
opacity
```

desde que definidos pelo Design System.

## Carousel

Revisar:

- controles;
- hover;
- focus;
- active;
- disabled;
- `prefers-reduced-motion`.

## Focus

`focus` não deve ser tratado como derivação automática de `hover`.

```text
mouse interaction
≠
keyboard focus
```

Focus precisa continuar perceptível mesmo quando não existe hover.

## Motion

Toda nova animação ou transição significativa deve respeitar:

```css
@media (prefers-reduced-motion: reduce)
```

## Critérios de aceite

- existe uma linguagem controlada para interação;
- hover não depende de valores arbitrários do CMS;
- focus-visible está implementado onde necessário;
- keyboard não depende de hover;
- componentes animados respeitam reduced motion;
- não existem fields editoriais de CSS de interação.

---

# 3. SPEC-058 — Modular Appearance Fields

## Objetivo

Tornar a definição dos campos de aparência dos Blocks modular e reutilizável.

Evitar duplicação de schema e evitar um `styleConfig` universal.

## Field factories

Criar primitives/factories conceitualmente equivalentes a:

```ts
schemeField()
spacingField()
widthField()
alignmentField()
interactionField()
emphasisField()
```

A API final pode seguir melhor as convenções existentes no projeto.

## Composição

Permitir composição semelhante a:

```ts
createAppearanceGroup([
  schemeField(),
  spacingField(),
  interactionField(),
])
```

## Exemplos

### Hero

```text
appearance
├── scheme
├── spacing
└── alignment
```

### RichText

```text
appearance
└── width
```

### Gallery

```text
appearance
├── spacing
└── interaction
```

### CTA

```text
appearance
├── scheme
└── emphasis
```

## Regra

Cada Block recebe somente os controles que fazem sentido semanticamente.

Não criar:

```text
appearance
├── scheme
├── spacing
├── width
├── alignment
├── interaction
├── emphasis
├── border
├── ...
```

em todos os Blocks.

## Padronizar também

- labels;
- help text;
- defaults;
- localização;
- conditional fields;
- posição no Admin;
- nomes técnicos;
- validações.

## Critérios de aceite

- fields compartilhados são reutilizáveis;
- Blocks não duplicam configuração comum;
- cada Block expõe apenas opções aplicáveis;
- novos Blocks podem compor aparência sem copiar schema;
- nenhum mega `styleConfig` universal foi criado.

---

# 4. SPEC-059 — Semantic State Components

## Objetivo

Fazer os tokens funcionais existentes possuírem consumidores oficiais e coerentes.

Estados:

```text
info
success
warning
danger
```

Esses estados são separados do Theme visual:

```text
Theme
├── brand
├── action
├── accent
└── ...

System States
├── info
├── success
├── warning
└── danger
```

## Primitive

Criar ou normalizar um componente conceitualmente equivalente a:

```text
Alert / Status

variant:
├── info
├── success
├── warning
└── danger
```

Cada variante resolve internamente:

```text
background
foreground
border
icon
```

## CMS

O editor escolhe:

```text
Tipo do aviso:
Warning
```

e não:

```text
Background amarelo
Border laranja
Icon amarelo
Texto escuro
```

## Acessibilidade

O estado não pode ser comunicado apenas por cor.

Utilizar também:

- texto;
- ícone;
- label;
- semântica apropriada.

Exemplo conceitual:

```text
ⓘ Info
✓ Success
⚠ Warning
✕ Danger
```

## Auditar

- Alert Block;
- Notices;
- badges semânticos;
- mensagens de validação;
- componentes que atualmente usam cores de estado manualmente.

## Critérios de aceite

- `info/success/warning/danger` possuem componentes consumidores;
- cores funcionais não dependem do Theme editorial;
- significado não depende apenas de cor;
- CMS seleciona estado, não cores internas.

---

# 5. SPEC-060 — Accessibility Baseline & Block Audit

## Objetivo

Criar uma baseline objetiva de acessibilidade antes de ampliar a liberdade editorial.

## Meta

```text
WCAG 2.2 AA
```

## Matriz de auditoria

Avaliar cada Block em:

| Categoria | Verificar |
|---|---|
| HTML | semântica correta |
| Heading | hierarquia |
| Keyboard | acesso completo |
| Focus | sempre perceptível |
| Contrast | texto e UI |
| Images | alt/decorativa |
| Forms | labels e erros |
| Dialog | trap/return/Esc |
| Motion | reduced motion |
| Zoom | 200% e 400% |
| Reflow | sem perda funcional |
| Touch | targets adequados |

## Ordem de auditoria

Priorizar componentes complexos:

1. Navigation;
2. Hero;
3. CTA;
4. FAQ;
5. Gallery / Lightbox;
6. Carousel;
7. Video;
8. Forms, se existentes;
9. Alerts;
10. Cards interativos.

Depois revisar componentes simples.

## Automação

Adicionar testes de acessibilidade automatizados, preferencialmente usando:

```text
Playwright
+
axe-core
```

Criar uma página/cenário representativo de desenvolvimento, por exemplo:

```text
/accessibility-fixture
```

ou mecanismo equivalente não público contendo:

- todos os Blocks;
- schemes claros;
- schemes escuros;
- estados interativos;
- conteúdo realista.

## Testes manuais

Executar também:

```text
Tab
Shift+Tab
Enter
Space
Esc
Arrow keys
Zoom 200%
Zoom 400%
Keyboard only
Reduced motion
Screen reader nos fluxos complexos
```

Automação não substitui validação manual.

## Resultado da auditoria

Para cada problema encontrado registrar:

```text
Block
Problema
Critério relacionado
Severidade
Correção
Teste de regressão
```

## Critérios de aceite

- Blocks existentes foram auditados;
- problemas críticos foram corrigidos;
- existe fixture/cenário representativo;
- existe automação aplicável;
- keyboard foi validado;
- focus foi validado;
- contrast foi revisado;
- reduced motion foi revisado;
- componentes complexos possuem testes manuais documentados.

---

# 6. SPEC-061 — Editorial Accessibility Guardrails

## Objetivo

Impedir que customizações permitidas pelo CMS destruam propriedades de acessibilidade garantidas pelo Design System.

## Contraste

Para pares customizáveis, validar:

```text
background ↔ foreground
background ↔ heading
action ↔ actionForeground
```

Apresentar feedback conceitualmente equivalente a:

```text
Contraste: 6.8:1
✓ WCAG AA
```

ou:

```text
Contraste: 2.7:1
✕ Contraste insuficiente
```

## Erro vs Warning

### Erro

Usar quando o sistema consegue determinar objetivamente que a configuração é inválida.

### Warning

Usar quando o problema depende de conteúdo ou contexto e exige julgamento editorial.

Não transformar toda recomendação em bloqueio.

## Imagens

Schema conceitual:

```text
Imagem
├── Uso
│   ├── Informativa
│   └── Decorativa
│
└── Texto alternativo
```

### Informativa

```text
alt obrigatório
```

### Decorativa

O componente deve gerar comportamento equivalente a:

```html
alt=""
```

sem exigir conhecimento técnico do editor.

## Links

O editor fornece:

```text
Texto
Destino
```

O componente é responsável pela implementação acessível.

Evitar expor diretamente:

```text
role
tabIndex
aria-hidden
aria-describedby
```

salvo caso editorial extremamente específico e justificado.

## Critérios de aceite

- combinações de contraste conhecidas podem ser validadas;
- CMS diferencia erro e warning;
- imagens informativas exigem texto alternativo;
- imagens decorativas possuem fluxo próprio;
- editor não precisa conhecer ARIA;
- customização não pode silenciosamente destruir contraste obrigatório.

---

# 7. SPEC-062 — Controlled Customization V2

## Objetivo

Ampliar a liberdade editorial somente depois que Design System, interação e acessibilidade possuírem contratos estáveis.

## Interface conceitual

```text
Aparência

Esquema
[ Superfície ▼ ]

Espaçamento
[ Padrão ▼ ]

Ênfase
[ Normal ▼ ]

Interação
[ Sutil ▼ ]

▸ Personalização avançada
```

Cada Block deve mostrar apenas opções aplicáveis.

## Scheme

Exemplos:

```text
default
surface
muted
brand
accent
```

Não é obrigatório disponibilizar todos para todos os Blocks.

## Interaction

Quando aplicável:

```text
none
subtle
default
emphasized
```

## Emphasis

Pode controlar intenção visual como:

```text
subtle
default
strong
```

O Design System traduz isso para:

- tratamento de border;
- intensidade de surface;
- destaque visual;
- outros efeitos controlados.

O editor não configura os valores concretos.

## Custom Scheme

Somente quando necessário:

```text
Custom
├── Background
├── Foreground
├── Action
├── Action foreground
└── Accent
```

O contrato final deve reutilizar a arquitetura existente de:

```text
semantic overrides
↓
Color Scheme
↓
Color Scope
↓
BlockColorTheme
↓
Primitives
```

## Guardrails

Custom Scheme deve utilizar validações introduzidas na SPEC-061.

## Não permitir

```text
border-width: 3px
border-radius: 17px
hover-scale: 1.04
shadow-x
shadow-y
transition: 180ms
font-size arbitrário
CSS
Tailwind
```

Essas decisões permanecem no Design System.

## Critérios de aceite

- customização utiliza intenção visual;
- componentes continuam consistentes;
- custom scheme usa o pipeline semântico existente;
- contraste é validado;
- interactions são presets;
- nenhum CSS arbitrário é persistido;
- editor não controla propriedades estruturais internas.

---

# Dependências

```text
SPEC-056 — Surface & Border
              │
              ▼
SPEC-057 — Interaction States
              │
              ▼
SPEC-058 — Modular Appearance Fields
              │
              ├─────────────────┐
              ▼                 ▼
SPEC-059 — System States   SPEC-060 — Accessibility Audit
                                │
                                ▼
                    SPEC-061 — Accessibility Guardrails
                                │
                                ▼
                    SPEC-062 — Controlled Customization V2
```

A SPEC-059 pode tecnicamente ser executada em paralelo com parte da SPEC-058, mas a sequência acima reduz o número de conceitos em evolução simultânea.

---

# Ordem recomendada

| Ordem | Spec | Razão |
|---:|---|---|
| 1 | SPEC-056 | remove inconsistências atuais de superfícies e bordas |
| 2 | SPEC-057 | cria contrato para hover/focus/active/motion |
| 3 | SPEC-058 | torna schemas de aparência reutilizáveis |
| 4 | SPEC-059 | conecta tokens funcionais a componentes reais |
| 5 | SPEC-060 | cria baseline de acessibilidade |
| 6 | SPEC-061 | protege customizações editoriais |
| 7 | SPEC-062 | amplia a customização sobre uma base segura |

As SPECs 056–061 devem ser tratadas principalmente como infraestrutura.

A SPEC-062 é a expansão editorial propriamente dita.

---

# Fora deste ciclo

Não implementar neste ciclo:

```text
multi-site
multi-tenant
theme por site
theme por Page
theme marketplace
custom typography
custom radius
custom shadows
arbitrary layouts
visual drag-and-drop builder
```

## Possível evolução futura

Caso o CMS futuramente se torne serviço central para vários sites:

```text
Institutional Defaults
        ↓
Site Theme
        ↓
Page
        ↓
Block Scheme
        ↓
Nested Scope
```

Não antecipar essa arquitetura enquanto não existir necessidade concreta.

---

# Estrutura documental sugerida

```text
03-design-system/
├── spec-056-visual-surface-border-normalization.md
├── spec-057-interaction-states-architecture.md
└── spec-059-semantic-state-components.md

06-cms-editorial-experience/
├── spec-058-modular-appearance-fields.md
├── spec-060-accessibility-baseline-audit.md
├── spec-061-editorial-accessibility-guardrails.md
└── spec-062-controlled-customization-v2.md
```

Se essa numeração já estiver ocupada, utilizar os próximos números disponíveis sem alterar a divisão de responsabilidades.

---

# Regras gerais para todo o ciclo

## O editor escolhe intenção

Preferir:

```text
scheme = surface
interaction = subtle
emphasis = strong
```

em vez de:

```text
background = #ffffff
hoverBackground = #eeeeee
border = rgba(...)
shadow = ...
```

## O Design System controla implementação

Continuam sob responsabilidade do código:

```text
layout
grid
breakpoints
typography scale
border radius
shadow
transition duration
motion implementation
focus implementation
CSS
Tailwind
```

## Não criar exceções específicas por Block

Evitar:

```text
faqBackground
cardBorder
galleryHoverScale
heroButtonColor
```

Quando existir uma necessidade visual recorrente, modelar a intenção no Design System.

## Acessibilidade faz parte do contrato

Nenhuma nova liberdade editorial deve ser considerada concluída se puder gerar combinações inacessíveis sem feedback ou proteção.

---

# Resultado final esperado

Ao final deste ciclo:

```text
Design System
├── Semantic Theme
├── Color Schemes
├── Color Scopes
├── Surface semantics
├── Border semantics
├── Interaction presets
├── System states
└── Accessibility contracts
```

O CMS passa a compor esses recursos através de fields modulares:

```text
Block
├── Content
└── Appearance
    ├── Scheme
    ├── Spacing
    ├── Alignment
    ├── Emphasis
    └── Interaction
```

somente quando cada opção for semanticamente aplicável.

O objetivo não é oferecer liberdade visual irrestrita.

O objetivo é permitir que o editor produza páginas visualmente variadas e acessíveis sem conseguir quebrar o Design System.

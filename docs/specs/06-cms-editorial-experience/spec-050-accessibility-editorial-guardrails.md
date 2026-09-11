---
spec: SPEC-050
title: Accessibility Editorial Guardrails
status: planned
source: CMS-NOVO-CICLO-SPECS-042-050.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# 10. SPEC-050 — Accessibility Editorial Guardrails

## Objetivo

Impedir que conteúdo inserido no CMS destrua a acessibilidade fornecida pelo frontend.

### Media

Estrutura recomendada:

```text
Media
├── altText
├── decorative
└── caption?
```

Comportamento:

```text
decorative = true
→ alt=""
```

Caso contrário:

```text
altText obrigatório
```

### Links

Evitar textos genéricos como:

```text
Clique aqui
Saiba mais
Veja aqui
```

quando o contexto não for suficiente.

### Headings

Sempre que possível:

- restringir níveis;
- manter hierarquia coerente;
- não permitir heading apenas por estilo visual.

### Color Picker

Toda cor customizada deve passar por:

```text
contraste foreground/background
```

### Vídeos

Prever suporte editorial para:

```text
title
caption
transcript
closed captions / legenda
```

quando aplicável.

### Gallery

Cada imagem deve possuir contexto textual adequado.

### Carousel

Deve possuir:

- nome acessível;
- controles acessíveis;
- indicadores compreensíveis;
- pausa de autoplay caso exista.

---

# 11. Roadmap consolidado

## P0

```text
SPEC-032 — Aplicar Admin Localization & Block Catalog
```

## P1 — Media

```text
SPEC-042 — Image Block
SPEC-043 — Gallery / Lightbox
SPEC-044 — Carousel
SPEC-045 — Video Embed
```

## P1 — Styling

```text
SPEC-046 — Theme Color Reset
ADR — Custom Color Governance
SPEC-047 — Controlled Custom Colors
```

## P1 — Accessibility

```text
SPEC-048 — Accessibility Audit & Baseline
SPEC-049 — Accessible Components
SPEC-050 — Accessibility Editorial Guardrails
```

---

# 12. Checkpoint — Mídia

Após SPEC-045:

```text
Image ✓
Gallery ✓
Lightbox ✓
Carousel ✓
Video ✓
Admin UX ✓
Responsive ✓
Keyboard ✓
```

### Perguntas

1. O editor consegue trabalhar com imagens sem precisar de novos Blocks específicos para cada cenário?
2. Gallery e Carousel têm responsabilidades claramente diferentes?
3. Todos os novos componentes funcionam com teclado?
4. O catálogo do Admin comunica corretamente o objetivo de cada Block?
5. Não existe HTML arbitrário no Video Block?

---

# 13. Checkpoint — Styling

Após SPEC-047:

### Perguntas

1. Presets continuam sendo o caminho principal?
2. Cores customizadas são exceção explícita?
3. Editor consegue quebrar a identidade visual facilmente?
4. Foreground e background possuem verificação de contraste?
5. Componentes internos herdam cores em vez de possuir controles individuais?
6. Reset restaura corretamente o tema padrão?

Se o CMS estiver permitindo alterar cor de cada pequeno elemento individualmente, a arquitetura provavelmente está caminhando para um page builder genérico e deve ser revista.

---

# 14. Checkpoint — Acessibilidade

Após SPEC-050:

```text
WCAG 2.2 AA baseline
Keyboard
Focus
Screen reader
Contrast
Images
Dialogs
Carousel
Forms
Reduced motion
Editorial guardrails
```

### Resultado esperado

A acessibilidade deixa de ser uma correção pontual e passa a existir como propriedade da arquitetura:

```text
Design System
↓
Primitives acessíveis
↓
Blocks acessíveis
↓
CMS com guardrails editoriais
↓
Conteúdo publicado
```

---

# 15. Guardrail principal

A inclusão de Color Picker é a mudança de maior impacto arquitetural deste ciclo.

O projeto originalmente trabalha com:

```text
Editor
→ intenção visual

Design System
→ decisão visual concreta
```

Com cores customizadas, essa relação passa parcialmente para:

```text
Editor
→ decisão visual concreta
```

Portanto, o Color Picker deve ser tratado como uma capacidade controlada e não como liberdade irrestrita.

A regra continua sendo:

```text
É conteúdo?
→ CMS field

É variação visual conhecida?
→ variant

É liberdade visual controlada?
→ appearance preset / custom limitado

É novo padrão editorial?
→ Block

É regra global visual?
→ Design System

É comportamento reutilizável?
→ Primitive / Component

É acessibilidade estrutural?
→ Design System / Primitive

É acessibilidade de conteúdo?
→ CMS guardrail
```

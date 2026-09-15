---
spec: SPEC-055
title: Admin Login Experience
status: planned
source: PAINEL-ADMIN-V2-SPECS-051-055.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades das Specs seguintes. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

# 7. SPEC-055 — Admin Login Experience

## Objetivo

Atualizar a tela de login com identidade institucional.

---

## Escopo

```text
Login
├── logo institucional
├── ícone
├── cores
├── background
├── tipografia
├── textos
└── estados de erro
```

---

## Identidade

A interface deve comunicar claramente:

```text
Meu Imóvel Regular
Painel de Administração
```

ou nomenclatura institucional equivalente.

---

## Regra arquitetural

Customizar:

```text
apresentação
```

e preservar:

```text
mecanismo de autenticação
```

Não substituir autenticação nativa do Payload sem uma necessidade técnica ou de segurança real.

---

## Pontos de atenção

- contraste;
- foco visível;
- mensagens de erro;
- labels dos campos;
- navegação por teclado;
- compatibilidade com password managers;
- responsividade;
- loading state;
- disabled state.

---

## Critérios de aceite

- Logo institucional aparece no login.
- Cores seguem o Admin Theme.
- Campos continuam semanticamente corretos.
- Erros são claramente comunicados.
- Foco é visível.
- Login funciona por teclado.
- Nenhuma customização quebra o fluxo de autenticação do Payload.

---

# 8. Ordem recomendada de implementação

```text
SPEC-053 — Admin Institutional Theme
↓
SPEC-052 — Admin Branding
↓
SPEC-055 — Admin Login
↓
SPEC-054 — Admin Navigation
↓
SPEC-051 — Admin Content Views
↓
ADMIN V2 CHECKPOINT
```

---

# 9. Justificativa da ordem

## SPEC-053 primeiro

Theme deve ser a base visual.

Branding, login e navegação dependem das decisões de:

- cores;
- superfícies;
- contraste;
- estados;
- tokens.

---

## SPEC-052 depois

Com o Theme definido, aplicar identidade visual institucional.

---

## SPEC-055 em seguida

A tela de login reutiliza:

```text
Theme
+
Branding
```

portanto deve vir depois dessas duas.

---

## SPEC-054 depois

Com identidade e tokens definidos, reorganizar e estilizar a navegação.

---

## SPEC-051 por último

Content Views é provavelmente a parte mais invasiva.

Pode exigir:

- custom views;
- componentes específicos;
- maior interação com APIs do Admin;
- customização de list views;
- preview;
- grid de Media.

Por isso deve vir depois da base visual e estrutural estar estabilizada.

---

# 10. Admin V2 Checkpoint

Ao finalizar SPEC-051 até SPEC-055, validar:

```text
Branding institucional        ✓
Payload visualmente neutro    ✓
Theme consistente             ✓
Login institucional           ✓
Navegação compreensível       ✓
Media Library visual          ✓
Pages facilmente gerenciáveis ✓
Preview acessível             ✓
Responsividade do Admin       ✓
```

---

# 11. Checkpoint de UX

Responder:

1. O Admin parece parte do produto institucional?
2. O Payload deixou de dominar visualmente a experiência?
3. O editor entende onde editar conteúdo?
4. O editor entende onde alterar estrutura?
5. O editor entende onde alterar aparência?
6. A Media Library é realmente visual?
7. Pages apresentam as informações necessárias sem abrir cada documento?
8. Preview está acessível com poucos passos?
9. O menu continua claro com diferentes níveis de permissão?
10. A interface continua atualizável sem depender de hacks frágeis?

---

# 12. Checkpoint técnico

Validar:

```text
lint
typecheck
tests
build
```

Quando aplicável, testar também:

```text
Admin
Editor
Desktop
Tablet
Keyboard
Light / Dark mode, se suportado
```

---

# 13. Guardrails para implementação

## Não reconstruir o Payload Admin

Evitar:

```text
customizar tudo
fork do Payload
substituir autenticação
reescrever tabelas sem necessidade
CSS global agressivo
seletores internos frágeis
```

---

## Preferir APIs oficiais

Priorizar:

```text
Payload Admin Components
Custom Views
Custom Components
Admin Config
Collection Config
Hooks suportados
Theme / CSS variables
```

antes de qualquer override frágil.

---

## Preservar upgrade path

Antes de customizações profundas, avaliar:

```text
Quanto isso depende de internals do Payload?
Essa API é pública?
Uma atualização de versão quebraria isso?
Existe alternativa suportada?
```

---

## Access Control continua sendo backend

Ocultar item no menu não é segurança.

Sempre manter:

```text
Admin UI
+
API Access Control
```

coerentes.

---

# 14. Organização final das Specs

```text
00-project
01-cms-core
02-domain
03-design-system
04-cms-foundation-ii
05-cms-maturity-governance
06-cms-editorial-experience
07-admin-experience
```

### Pasta

```text
07-admin-experience/
```

### Arquivos

```text
SPEC-051-admin-content-views.md
SPEC-052-admin-branding.md
SPEC-053-admin-theme.md
SPEC-054-admin-navigation.md
SPEC-055-admin-login.md
```

---

# 15. Visão final esperada

```text
                INSTITUTIONAL DESIGN SYSTEM
                          │
                    Admin Theme
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
     Branding          Navigation          Login
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                      Payload Admin
                          │
              ┌───────────┴───────────┐
              │                       │
            Pages                   Media
              │                       │
         Rich List View          List / Grid
           Preview                Preview
              │                       │
              └───────────┬───────────┘
                          │
                      Editor UX
```

---

# 16. Resultado esperado do ciclo

Após o Painel Admin V2:

- Payload continua sendo a base administrativa;
- identidade visual padrão do Payload deixa de dominar a interface;
- Theme institucional é aplicado de forma consistente;
- login passa a refletir a identidade do projeto;
- navegação é organizada por contexto de trabalho;
- Media passa a ter uma experiência visual adequada;
- Pages ficam mais fáceis de localizar, revisar e abrir;
- Preview fica mais acessível;
- customizações continuam compatíveis com manutenção e evolução do projeto.

---

# 17. Regra final

A prioridade deste ciclo é:

```text
melhorar a experiência do editor
sem transformar o Payload Admin
em uma aplicação paralela difícil de manter
```

A customização deve ser suficiente para criar identidade e eficiência, mas limitada o bastante para preservar:

```text
estabilidade
manutenção
compatibilidade
upgrade path
segurança
```

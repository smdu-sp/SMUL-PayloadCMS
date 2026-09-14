# SPEC-028 - Evolucao de schema e migrations

Esta nota define o processo para alterar schemas de `Pages`, Blocks, Globals, `Media` e `Users` sem tratar dados persistidos como detalhe secundario.

## Classificacao obrigatoria

Toda mudanca de schema deve ser classificada antes do patch:

| Mudanca | Risco | Acao minima |
|---|---|---|
| Novo Block | Medio | Fixture nova, renderizacao testada e registro no catalogo. |
| Novo field opcional | Baixo | Fallback de renderizacao e documentacao. |
| Novo field obrigatorio | Alto | Migration ou default seguro para documentos existentes. |
| Novo enum ou variant | Medio | Normalizador/fallback para valores antigos e desconhecidos. |
| Rename | Alto | Plano de migration; nao tratar como simples renomeacao. |
| Remocao | Alto | Migration, backup e validacao humana antes de aplicar. |
| Mudanca de tipo | Alto | Migration explicita e fixture com dado antigo. |
| Mudanca de relationship | Alto | Migration explicita e teste com relacionamento antigo/novo. |

## Estado atual

As mudancas das SPECS 019 a 027 foram classificadas assim:

| Area | Mudanca | Classificacao | Migration |
|---|---|---|---|
| `Pages.layout` | Novos Blocks `iconGrid`, `faqAccordion`, `alertBox`, `actionBanners` | Novo Block | Nao exige migration; dados antigos continuam renderizando. |
| `Pages.layout` | Novo Block `imageBlock` | Novo Block | Nao exige migration; dados antigos continuam renderizando. |
| `Pages.layout` | Novo Block `gallery` | Novo Block | Nao exige migration; dados antigos continuam renderizando. |
| `Pages.layout` | Novo Block `carousel` | Novo Block | Nao exige migration; dados antigos continuam renderizando. |
| `cards.variant` | Nova variant `modalities` | Novo enum/variant | Nao exige migration; fallback de `Cards` retorna `default`. |
| `hero.variant` | `image` legado mapeado para `split` | Compatibilidade de enum | Nao exige migration; fallback preservado no componente. |
| `cta.variant` | `primary` legado mapeado para `brand`; desconhecidos para `default` | Compatibilidade de enum | Nao exige migration; fallback preservado no componente. |
| `imageText` | `imagePosition` legado aceito como fallback de `variant` | Campo legado absorvido | Nao exige migration neste ciclo. |
| `richText` | `width` legado aceito como fallback de `variant` | Campo legado absorvido | Nao exige migration neste ciclo. |
| `actionBanners.appearance` | Aparencias fechadas no Design System | Novo enum/variant | Nao exige migration; aparencia desconhecida vira `primary`. |
| `Header`, `Footer`, `SiteSettings` | Links globais mantidos em formatos existentes | Preservacao de schema | Nao exige migration; resolver central aceita formatos legados. |
| `Media.usage` | Novo field obrigatorio com default `content` | Novo field obrigatorio | Nao exige migration manual porque ha default seguro; revisar banco antes de producao. |
| `Users.role` | Novo field com default `admin` | Novo field com default | Nao exige migration manual local; usuarios sem role seguem tratados como admin legado. |
| `Pages.lifecycleStatus` | Novo field obrigatorio com default `active` | Novo field obrigatorio com default | Nao exige migration destrutiva; bases existentes devem ser auditadas antes de producao. |

## Processo

1. Classificar a mudanca na tabela acima.
2. Identificar documentos persistidos afetados.
3. Definir se precisa migration, fallback em runtime ou ambos.
4. Criar fixture antiga e fixture nova quando o schema de `Pages.layout` ou Blocks mudar.
5. Gerar migration apenas quando houver rename, remocao, mudanca de tipo, mudanca de relationship ou novo campo obrigatorio sem default seguro.
6. Submeter migration a revisao humana antes de aplicar em ambiente compartilhado.
7. Aplicar localmente, rodar seed/fixture quando aplicavel e validar renderizacao antiga e nova.
8. Executar lint, typecheck, testes e build.

## Fixture de compatibilidade

`src/cms-schema-evolution.test.ts` mantem:

- uma Page com Blocks e variants legados;
- uma Page com Blocks novos da expansao visual;
- renderizacao server-side das duas fixtures por `RenderBlocks`;
- verificacao de que fallbacks de variants continuam ativos.

## Limites

- Nenhuma migration destrutiva foi criada nesta SPEC porque o estado atual nao exige rename, remocao, mudanca de tipo ou mudanca de relationship.
- `counterNumbers` nao foi convertido em prazo dinamico.
- `Media & Text` nao foi renomeado destrutivamente; a compatibilidade fica no fallback de `ImageText`.

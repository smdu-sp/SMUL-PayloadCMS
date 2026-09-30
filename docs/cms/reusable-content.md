# SPEC-020 - Arquitetura de conteudo reutilizavel

Esta nota registra as decisoes da SPEC-020 para manter conteudos globais fora de Pages e Blocks.

## Responsabilidades

| Area | Fonte configuravel | Responsabilidade |
|---|---|---|
| Header | `src/globals/Header.ts` | Logo institucional opcional e menu principal configuravel por relacionamento com Pages. |
| Footer | `src/globals/Footer.ts` | Telefone, e-mail, endereco fisico, atendimento presencial, redes sociais oficiais e links institucionais. |
| SiteSettings | `src/globals/SiteSettings.ts` | Nome do site, prazo institucional, links oficiais, branding controlado e SEO padrao. |
| Theme | `src/collections/Themes.ts`, `src/lib/theme/resolve-active-theme.ts`, `src/lib/theme/get-theme.ts` e `src/lib/theme/map-theme-to-css-variables.ts` | Seleciona o tema nomeado ativo, preserva o fallback de SiteSettings e converte os papeis permitidos em variaveis CSS. |

## Campos reutilizaveis

| Helper | Uso | Motivo |
|---|---|---|
| `createLinkFields` | Links e CTAs em Blocks | Fonte unica em `src/fields/link.ts` para link interno/externo editorial em Blocks. |
| `createSocialLinkFields` | Redes sociais no Footer | Criado apenas porque redes sociais usam o mesmo par nome/URL oficial e podem crescer sem virar colecao generica. |

## Auditoria de repeticao

| Item encontrado | Situacao | Decisao |
|---|---|---|
| Menu principal | Configurado no Header seed | Mantido em Global. |
| Logo institucional | Campo opcional no Header | Mantido em Global; nao duplicar em Blocks comuns. |
| Portal de Licenciamento | Aparece em CTA editorial, Footer e SiteSettings | Mantido configuravel. A repeticao no seed existe para popular superficies diferentes; valores oficiais devem ser validados antes de publicacao. |
| Metadata padrao do layout | Antes havia titulo e descricao estaticos no layout frontend | Agora usa `SiteSettings.defaultSEO` e `siteName`, com fallback tecnico apenas para resiliencia. |
| Endereco fisico | O mapeamento cita Rua Sao Bento, 405 | Campo `Footer.address` criado e seed inicial preenchido a partir do mapeamento para validacao editorial. |
| Redes sociais | O mapeamento exige icones/redes, mas nao informa perfis oficiais | Campo `Footer.socialLinks` criado; seed fica vazio ate confirmacao dos perfis oficiais. |

## Divergencias para validacao editorial

- Telefone e e-mail nao possuem valores confirmados no projeto; permanecem vazios no seed e configuraveis no Footer.
- Perfis de redes sociais nao foram informados; permanecem vazios no seed e configuraveis no Footer.
- O endereco `Rua Sao Bento, 405` veio do mapeamento visual e deve ser confirmado antes de publicacao.
- Links oficiais repetidos entre Footer, SiteSettings e CTAs devem ser revisados pela equipe editorial quando houver fonte oficial definitiva.

## Limites da SPEC-020

- Nenhuma colecao generica `key/value` foi criada.
- Nenhum novo Page Block foi criado.
- Nenhum componente visual de Header/Footer foi implementado.
- Nenhum contato, rede social ou link foi hardcoded em componente React.

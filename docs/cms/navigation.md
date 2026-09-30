# SPEC-021 - Sistema de navegacao

Esta nota registra a centralizacao do contrato de links usada por Header, Footer, SiteSettings e Blocks com CTA.

## Contrato unico

O helper `src/fields/link.ts` define os campos:

| Campo | Uso |
|---|---|
| `label` | Texto visivel para o usuario. |
| `type` | Define link `internal` ou `external`. |
| `page` | Relacionamento com `pages` para links internos. |
| `url` | URL validada para links externos. |
| `newTab` | Abre em nova aba quando necessario. |

Links internos usam relationship com Pages. Assim, alteracoes futuras de slug nao quebram o dado armazenado no CMS.

## Resolucao de links

`src/lib/navigation/resolve-link.ts` centraliza:

- conversao de Page relationship para caminho publico;
- uso de URL externa quando `type` e `external`;
- atributos seguros `target="_blank"` e `rel="noopener noreferrer"`;
- rejeicao de links incompletos.

`BlockLink` consome esse resolver, evitando regras duplicadas nos componentes.

## Aplicacao

| Area | Decisao |
|---|---|
| Header normal | `navigation` preserva o formato existente `label/page` para manter compatibilidade com documentos atuais. |
| Header com submenus | `menuItems` aceita paginas diretas ou categorias com links internos, sem terceiro nivel. |
| Footer | `institutionalLinks` preserva o formato existente `label/url` para nao exigir migracao destrutiva no banco local. |
| SiteSettings | `officialLinks` preserva o formato existente `label/url` para nao exigir migracao destrutiva no banco local. |
| Blocks | Hero, Cards, CTA, ImageText, IconGrid, AlertBox e ActionBanners importam `createLinkFields` de `src/fields/link.ts`. |

O resolver central aceita tanto o contrato completo dos Blocks quanto os formatos legados dos Globals.

## Modos do Header

`Header.navigationMode` possui dois valores:

- `normal`: renderiza o array legado `navigation`;
- `submenus`: renderiza `menuItems`, que pode misturar paginas diretas e
  categorias com ate oito links internos.

O renderer normaliza a configuracao antes de chegar ao componente interativo.
Pages em rascunho ou inativas sao descartadas, categorias vazias nao aparecem e
um menu de submenus sem destinos validos volta para `navigation`.

No desktop, categorias abrem por botao. No mobile, o botao `Menu` controla toda
a navegacao. Escape fecha o nivel aberto e devolve o foco ao gatilho. Os links
continuam em listas semanticas dentro de `nav`; nao se usa `role="menu"`, pois
esta e uma navegacao de site.

## Busca

`Header.enableSearch` habilita um formulario GET para `/busca?q=...`. A rota
consulta apenas Pages publicadas e ativas por titulo, slug, titulo SEO e
descricao SEO. O termo e normalizado e limitado a 100 caracteres; resultados
sao paginados no servidor.

Busca integral dentro do JSON de todos os Blocks permanece fora deste escopo e
exigira um indice de texto mantido por hooks de publicacao.

## Limites da SPEC-021

- A hierarquia do Header possui no maximo um submenu.
- Links do menu principal continuam restritos a Pages internas.
- Breadcrumb nao faz parte deste escopo.
- Nenhuma permissao editorial nova foi criada.

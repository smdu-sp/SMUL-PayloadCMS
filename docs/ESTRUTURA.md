# Estrutura do projeto

Este mapa descreve responsabilidades e pontos de entrada. Para a lista completa de arquivos, consulte a árvore do repositório.

```text
src/
  access/                 Políticas de autorização e papéis do Payload
  admin/                  Conteúdo de ajuda do painel
  app/
    (frontend)/           Rotas públicas, busca, preview e layout do portal
    (payload)/            Rotas e configuração visual do painel Payload
  blocks/                 Configuração e apresentação dos blocos editoriais
    catalog.ts            Slugs e ordem dos blocos de Pages
    shared/               Recursos usados por mais de um bloco
  collections/            Schemas de Pages, Media, Themes, Users e AuditLogs
  components/             Apresentação compartilhada: admin, layout, tema e UI
  domain/                 Regras puras, como slugs e validação de URLs oficiais
  fields/                 Campos reutilizáveis do Payload
  globals/                Schemas de Header, Footer e SiteSettings
  lib/                    Acesso ao Payload, LDAP, auditoria, navegação, SEO e tema
    payload/page-route.ts Fluxo comum das rotas de páginas editoriais
  migrations/             Migrations existentes; evolução tratada em fluxo próprio
  seeds/                  Dados editoriais e contas de desenvolvimento
  styles/                 Tokens CSS
  payload.config.ts       Composição da configuração do Payload
  payload-types.ts        Tipos gerados pelo Payload

docs/
  cms/                    Decisões e guias da base editorial
  specs/                  Specs e índice da sequência de trabalho
    02-domain(staged)/    Specs de domínio ainda em preparação

public/                   Assets públicos e prévias dos blocos
media/                    Arquivos de mídia usados no desenvolvimento
```

O CMS guarda conteúdo configurável. `src/domain/` contém regras de negócio puras; `src/lib/` contém integrações e infraestrutura; `src/components/` e os componentes em `src/blocks/` apresentam o conteúdo; `src/app/` compõe as rotas. Configurações de blocos em `src/blocks/*/config.ts` são schemas do Payload e componentes em `src/blocks/*/Component.tsx` renderizam esses dados.

Ao adicionar um bloco aprovado por spec, atualize `src/blocks/catalog.ts`, o mapa de configurações em `src/collections/Pages.ts` e o mapa de apresentação em `src/components/RenderBlocks/index.tsx`. O TypeScript verifica se os dois mapas cobrem o catálogo.

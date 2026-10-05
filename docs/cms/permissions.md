# Arquitetura de roles e permissions

O CMS possui duas roles fixas e tipadas:

```text
admin
editor
```

Roles configuráveis, permissões por usuário, herança e escopos por propriedade não
fazem parte deste ciclo. A autorização segue o fluxo:

```text
User -> Role -> RolePermissions -> can() -> Policy -> Payload Access Control
```

## Segurança e normalização

- `src/access/roles.ts` aceita somente `admin` e `editor`.
- Usuário ausente, role ausente, `null` ou desconhecida não recebe permissão.
- `Users.role` é obrigatória e não possui default.
- O campo `Users.role` possui Field Access próprio por `users.assignRole`.
- Ocultar controles no Admin não substitui o Access Control do Payload.
- REST, GraphQL e Local API compartilham as policies configuradas nas Collections e
  Globals.

## Catálogo e matriz

O catálogo canônico fica em `src/access/permissions.ts` e a atribuição em
`src/access/role-permissions.ts`.

| Permission | Admin | Editor | Público |
|---|---:|---:|---:|
| `admin.access` | sim | sim | não |
| `pages.read` | sim | sim | publicadas |
| `pages.create` | sim | sim | não |
| `pages.update` | sim | sim | não |
| `pages.delete` | sim | não | não |
| `pages.publish` | sim | sim | não |
| `pages.preview` | sim | sim | não |
| `media.read` | sim | sim | sim |
| `media.create` | sim | sim | não |
| `media.update` | sim | sim | não |
| `media.delete` | sim | não | não |
| `header.read` | sim | sim | sim |
| `header.update` | sim | sim | não |
| `footer.read` | sim | sim | sim |
| `footer.update` | sim | sim | não |
| `users.read` | sim | não | não |
| `users.create` | sim | não | não |
| `users.update` | sim | não | não |
| `users.delete` | sim | não | não |
| `users.assignRole` | sim | não | não |
| `themes.read` | sim | não | sim, para renderização |
| `themes.create` | sim | não | não |
| `themes.update` | sim | não | não |
| `themes.delete` | sim | não | não |
| `siteSettings.read` | sim | não | sim, para renderização |
| `siteSettings.update` | sim | não | não |
| `auditLogs.read` | sim | não | não |

Leituras públicas são regras de policy, não permissões atribuídas a uma role. Em
particular, visitantes recebem somente Pages publicadas. Temas e configurações
necessários à renderização continuam legíveis anonimamente, mas não aparecem como
áreas administráveis para Editor.

## Policies

As Collections e Globals consomem policies em `src/access/policies/`:

- `pages.ts`: leitura pública filtrada, criação, atualização, exclusão e ciclo de vida;
- `media.ts`: leitura pública e mutações editoriais;
- `users.ts`: acesso ao Admin, CRUD de usuários e atribuição de role;
- `themes.ts`: leitura pública de renderização e gestão por Admin;
- `globals.ts`: Header, Footer e SiteSettings;
- `preview.ts`: autorização explícita de preview;
- `audit-logs.ts`: leitura administrativa e bloqueio de mutações manuais.

Adicionar uma nova role deve exigir prioritariamente registrá-la em `roles.ts` e
definir suas permissions em `role-permissions.ts`. Schemas e rotas não devem criar
condicionais específicos por role.

## Comportamento editorial preservado

- Admin e Editor criam, editam, publicam e despublicam Pages.
- Admin e Editor desativam e reativam Pages por `lifecycleStatus`.
- Somente Admin faz hard delete de Pages e Media.
- Admin e Editor editam Header e Footer.
- Users, Themes, SiteSettings e AuditLogs continuam áreas administrativas.
- A lista de Pages mantém edição em massa e seleção por checkbox desabilitadas.

## Preview e APIs

As rotas `/api/draft` e `/api/live-preview` exigem `pages.preview`. Depois da
autorização, a consulta Local API recebe simultaneamente:

```ts
user: auth.user
overrideAccess: false
```

Chamadas Local API seguem estas categorias:

- operação pública: `overrideAccess: false`, sem usuário;
- operação em nome de usuário: `user` e `overrideAccess: false`;
- seed, migration, auditoria ou validação interna: bypass explícito com
  `overrideAccess: true`.

O carregamento de um draft depois que o Draft Mode já foi autorizado é uma leitura
interna explícita. Conteúdo público, sitemap, busca, Header, Footer, SiteSettings e
tema executam as policies públicas.

## Bootstrap e migration

O endpoint LDAP autentica somente usuários previamente cadastrados e nunca cria ou
promove o primeiro usuário. O primeiro Admin deve ser criado explicitamente por:

```text
npm run seed:first-admin
npm run seed:dev-admin (somente desenvolvimento)
```

`Users.role` passou a ser obrigatória e sem default. A migration
`20261005_000000_backfill_user_roles` preserva roles válidas e exige mapeamento
explícito para cada valor ausente ou inválido por `CMS_USER_ROLE_BACKFILL`. Consulte
`docs/cms/schema-evolution-migrations.md` antes de aplicá-la.

## Cobertura

- testes unitários cobrem normalização, catálogo, matriz, `can()`, policies e plano
  de backfill;
- teste de integração usa uma base SQLite em memória e executa a Local API real com
  `overrideAccess: false` para Admin, Editor, anônimo, role nula e role inválida;
- o mesmo teste exerce REST para criação anônima, criação por Editor e exclusão
  negada ao Editor;
- GraphQL usa o mesmo Access Control das Collections exercitado pela Local API e REST.

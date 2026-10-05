# Plano de Implementação — Arquitetura Modular de Roles e Permissions

## Contexto

O CMS utiliza **Next.js + Payload CMS** e atualmente possui um esquema de autorização baseado principalmente em duas roles:

- `admin`
- `editor`

A estrutura atual centraliza parte das regras em:

```text
src/access/
├── roles.ts
└── roles.test.ts
```

As regras são consumidas pelas Collections, Globals, rotas de preview, autenticação LDAP e outros pontos da aplicação.

O objetivo desta implementação é evoluir o modelo atual para uma arquitetura modular baseada em:

```text
User
  ↓
Role
  ↓
Role → Permissions
  ↓
can(user, permission)
  ↓
Policies / Access Functions
  ↓
Payload Access Control
```

O Payload CMS deve continuar sendo o mecanismo responsável por aplicar as regras de acesso.

A aplicação será responsável por:

- definir as roles existentes;
- definir as permissions existentes;
- mapear roles para permissions;
- fornecer helpers reutilizáveis;
- fornecer policies por domínio.

---

# Objetivos

Implementar uma arquitetura de autorização que:

1. seja **fail-closed**;
2. elimine permissões implícitas;
3. elimine comparações de role espalhadas pela aplicação;
4. mantenha o Payload CMS como camada de enforcement;
5. permita adicionar novas roles sem modificar todas as Collections;
6. permita adicionar novas permissions de forma tipada;
7. mantenha a matriz atual de Admin e Editor;
8. prepare a base para futuras roles sem implementar complexidade desnecessária agora;
9. proteja corretamente REST API, GraphQL, Local API e rotas customizadas;
10. possua testes unitários e de integração suficientes para validar o enforcement.

---

# Princípios obrigatórios

## 1. Fail closed

Qualquer estado desconhecido deve resultar em **negação de acesso**.

Exemplos:

```text
role = null       → deny
role = undefined  → deny
role = "viewer"   → deny
role = "invalid"  → deny
user = null       → deny
```

Nunca interpretar ausência ou valor inválido como Admin.

---

## 2. Nenhuma permissão implícita

Não deve existir:

```ts
defaultValue: 'admin'
```

no campo `role`.

Criação de usuários deve definir explicitamente a role ou utilizar um default não privilegiado apenas se houver requisito claro para isso.

Preferência atual:

```text
role obrigatória
sem default
```

---

## 3. Role não é Permission

Collections e Globals não devem tomar decisões com base em:

```ts
user.role === 'admin'
```

ou:

```ts
isAdmin(user)
```

como regra de autorização principal.

Devem perguntar por capacidades:

```ts
can(user, 'pages.delete')
```

ou consumir uma policy:

```ts
canDeletePage
```

---

## 4. Policies encapsulam regras de domínio

A função `can()` responde apenas:

> O usuário possui determinada permission?

Policies podem responder:

> O usuário possui a permission e, considerando este contexto, pode executar esta operação?

Exemplo:

```text
Permission:
pages.read

Policy:
visitante pode ler somente Pages publicadas
```

---

## 5. Payload continua aplicando Access Control

As Collections e Globals devem continuar usando os mecanismos nativos do Payload:

```ts
access: {
  create,
  read,
  update,
  delete,
}
```

Field Access também deve ser usado quando apropriado.

---

# Arquitetura alvo

Criar a seguinte estrutura:

```text
src/
└── access/
    ├── roles.ts
    ├── permissions.ts
    ├── role-permissions.ts
    ├── can.ts
    ├── policies/
    │   ├── pages.ts
    │   ├── media.ts
    │   ├── users.ts
    │   ├── themes.ts
    │   ├── globals.ts
    │   └── preview.ts
    ├── roles.test.ts
    ├── permissions.test.ts
    ├── role-permissions.test.ts
    ├── can.test.ts
    └── policies.test.ts
```

Não é obrigatório manter exatamente um único `policies.test.ts`.

Se fizer mais sentido, os testes podem ficar próximos aos módulos:

```text
policies/
├── pages.ts
├── pages.test.ts
├── media.ts
├── media.test.ts
...
```

---

# Arquivos existentes relevantes

Considerar principalmente:

```text
src/access/
├── roles.ts
└── roles.test.ts

src/collections/
├── AuditLogs.ts
├── Media.ts
├── Pages.ts
├── Themes.ts
└── Users.ts

src/globals/
├── Footer.ts
├── Header.ts
└── SiteSettings.ts

src/app/(frontend)/api/
├── draft/route.ts
└── live-preview/route.ts

src/lib/ldap/
├── auth-strategy.ts
├── login-endpoint.ts
├── sync-user-hook.ts
└── types.ts

src/lib/payload/
├── get-page.ts
├── get-site-shell.ts
├── search-pages.ts
├── unpublish-workflow.test.ts
└── outros helpers

src/migrations/

src/seeds/
├── create-dev-admin.ts
├── create-first-admin.ts
└── ...
```

---

# Fase 0 — Auditoria antes de alterar comportamento

Antes de modificar schemas ou roles:

## Tarefa

Identificar todos os pontos onde a aplicação consulta diretamente:

```text
role
isAdmin
isEditor
admin
editor
```

Procurar especialmente por:

```ts
user.role
req.user.role
auth.user.role
isAdmin(
isEditor(
role ===
role !==
```

## Resultado esperado

Criar uma lista dos pontos encontrados antes de iniciar a migração.

Essa lista servirá para validar que nenhuma regra antiga permaneceu fora da nova arquitetura.

---

# Fase 1 — Corrigir os riscos atuais de segurança

Esta fase deve ser concluída antes da introdução da nova abstração.

---

## 1.1 Corrigir `roles.ts`

A normalização deve aceitar apenas roles conhecidas.

Exemplo esperado:

```ts
export const USER_ROLES = ['admin', 'editor'] as const

export type UserRole = (typeof USER_ROLES)[number]

export function normalizeRole(role: unknown): UserRole | null {
  if (typeof role !== 'string') return null

  return USER_ROLES.includes(role as UserRole)
    ? (role as UserRole)
    : null
}
```

### Regra obrigatória

```text
admin   → admin
editor  → editor

qualquer outro valor → null
```

---

## 1.2 Corrigir `isAdmin`

Se `isAdmin` continuar temporariamente existindo:

```ts
export function isAdmin(user: User | null | undefined): boolean {
  return normalizeRole(user?.role) === 'admin'
}
```

Não aceitar:

```text
null
undefined
role desconhecida
```

como Admin.

---

## 1.3 Corrigir `Users.role`

No arquivo:

```text
src/collections/Users.ts
```

o campo `role` deve ser:

```text
required: true
```

Remover:

```ts
defaultValue: 'admin'
```

Preferência:

```text
sem defaultValue
```

---

## 1.4 Criar migration/backfill

Antes de tornar a role obrigatória em schema, criar migration para usuários existentes.

### A migration deve

1. identificar usuários sem role;
2. identificar valores inválidos;
3. atribuir role explicitamente;
4. não inferir automaticamente `null → admin`.

### Regra

Administradores devem ser definidos explicitamente.

Se houver poucos usuários, utilizar IDs/e-mails conhecidos pela equipe ou outra estratégia controlada.

Não introduzir heurística insegura.

---

## 1.5 Remover bootstrap Admin do LDAP

Arquivo principal:

```text
src/lib/ldap/login-endpoint.ts
```

Remover a lógica equivalente a:

```text
se collection users estiver vazia
→ primeiro login LDAP vira admin
```

O bootstrap do primeiro administrador deve permanecer responsabilidade dos seeds:

```text
src/seeds/create-first-admin.ts
src/seeds/create-dev-admin.ts
```

LDAP deve cuidar de:

```text
autenticação
sincronização
identidade
```

e não de elevação de privilégio.

---

# Fase 2 — Criar catálogo de Permissions

Criar:

```text
src/access/permissions.ts
```

## Requisito

Permissions devem ser definidas como constantes tipadas.

Exemplo:

```ts
export const PERMISSIONS = [
  'admin.access',

  'pages.read',
  'pages.create',
  'pages.update',
  'pages.delete',
  'pages.publish',
  'pages.preview',

  'media.read',
  'media.create',
  'media.update',
  'media.delete',

  'header.read',
  'header.update',

  'footer.read',
  'footer.update',

  'users.read',
  'users.create',
  'users.update',
  'users.delete',
  'users.assignRole',

  'themes.read',
  'themes.create',
  'themes.update',
  'themes.delete',

  'siteSettings.read',
  'siteSettings.update',

  'auditLogs.read',
] as const

export type Permission = (typeof PERMISSIONS)[number]
```

A lista pode ser ajustada de acordo com a implementação real dos schemas.

Evitar permissions sem uso real.

---

# Fase 3 — Criar matriz Role → Permissions

Criar:

```text
src/access/role-permissions.ts
```

## Matriz inicial

Manter o comportamento atualmente documentado.

### Admin

Admin possui acesso completo ao CMS.

Inclui:

```text
Pages
Media
Header
Footer
Users
Themes
SiteSettings
AuditLogs
```

Admin também pode:

```text
publicar
despublicar
excluir definitivamente
gerenciar roles
```

---

### Editor

Editor administra conteúdo editorial.

Permissões esperadas:

```text
pages.read
pages.create
pages.update
pages.publish
pages.preview

media.read
media.create
media.update

header.read
header.update

footer.read
footer.update
```

Editor não pode:

```text
pages.delete
media.delete

users.*
themes.*
siteSettings.update
auditLogs.read
```

A matriz deve refletir a regra atual do projeto, não introduzir mudanças funcionais não solicitadas.

---

## Exemplo

```ts
export const rolePermissions = {
  admin: [
    // todas as permissions
  ],

  editor: [
    'admin.access',

    'pages.read',
    'pages.create',
    'pages.update',
    'pages.publish',
    'pages.preview',

    'media.read',
    'media.create',
    'media.update',

    'header.read',
    'header.update',

    'footer.read',
    'footer.update',
  ],
} satisfies Record<UserRole, readonly Permission[]>
```

---

# Fase 4 — Criar helper `can()`

Criar:

```text
src/access/can.ts
```

## Responsabilidade

Responder apenas:

```text
usuário possui a permission?
```

Exemplo:

```ts
export function can(
  user: User | null | undefined,
  permission: Permission,
): boolean {
  const role = normalizeRole(user?.role)

  if (!role) return false

  return rolePermissions[role].includes(permission)
}
```

A implementação exata pode mudar para resolver limitações de TypeScript.

---

## Regras

`can()` deve retornar `false` para:

```text
user null
user undefined
role null
role undefined
role inválida
permission não atribuída
```

---

# Fase 5 — Criar Policies por domínio

Criar:

```text
src/access/policies/
```

Policies devem ser as funções consumidas diretamente pelos schemas do Payload.

---

# Pages

Criar:

```text
src/access/policies/pages.ts
```

Exemplos:

```text
canReadPages
canCreatePage
canUpdatePage
canDeletePage
canPublishPage
canPreviewPage
```

## Observação importante

Leitura pública de Pages publicadas deve continuar funcionando.

Portanto `read` provavelmente não será apenas:

```ts
can(user, 'pages.read')
```

Deve manter a lógica atual de:

```text
visitante
→ apenas conteúdo publicado
```

e:

```text
usuário autorizado
→ regras adequadas para drafts
```

Não remover comportamento existente.

---

# Media

Criar:

```text
src/access/policies/media.ts
```

Exemplos:

```text
canReadMedia
canCreateMedia
canUpdateMedia
canDeleteMedia
```

---

# Users

Criar:

```text
src/access/policies/users.ts
```

Exemplos:

```text
canReadUsers
canCreateUser
canUpdateUser
canDeleteUser
canAssignRole
```

---

## Field Access de role

O campo:

```text
Users.role
```

deve possuir proteção própria.

Atribuição de role deve exigir:

```text
users.assignRole
```

mesmo que atualmente apenas Admin possua essa permission.

Objetivo:

```text
editar User
≠
alterar privilégio
```

---

# Themes

Criar:

```text
src/access/policies/themes.ts
```

Exemplos:

```text
canReadThemes
canCreateTheme
canUpdateTheme
canDeleteTheme
```

---

# Globals

Criar:

```text
src/access/policies/globals.ts
```

Abranger:

```text
Header
Footer
SiteSettings
```

Exemplos:

```text
canReadHeader
canUpdateHeader

canReadFooter
canUpdateFooter

canReadSiteSettings
canUpdateSiteSettings
```

---

# Preview

Criar:

```text
src/access/policies/preview.ts
```

Exemplo:

```ts
export function canPreviewContent(user: User | null | undefined) {
  return can(user, 'pages.preview')
}
```

---

# Fase 6 — Migrar Collections para Policies

Migrar progressivamente:

```text
src/collections/Pages.ts
src/collections/Media.ts
src/collections/Users.ts
src/collections/Themes.ts
src/collections/AuditLogs.ts
```

---

## Exemplo

Antes:

```ts
access: {
  delete: ({ req }) => isAdmin(req.user)
}
```

Depois:

```ts
access: {
  delete: canDeletePage
}
```

ou:

```ts
access: {
  delete: ({ req }) => can(req.user, 'pages.delete')
}
```

Preferência:

```text
Policy
```

para evitar lógica espalhada.

---

# Fase 7 — Migrar Globals

Migrar:

```text
src/globals/Header.ts
src/globals/Footer.ts
src/globals/SiteSettings.ts
```

para as policies correspondentes.

Eliminar checagens diretas de role.

---

# Fase 8 — Proteger Preview e Local API

Revisar:

```text
src/app/(frontend)/api/draft/route.ts
src/app/(frontend)/api/live-preview/route.ts
```

Hoje a autenticação por si só não deve representar permissão para preview.

Aplicar:

```ts
canPreviewContent(auth.user)
```

---

## Local API

Toda operação Local API executada em nome de um usuário deve utilizar:

```ts
user: auth.user,
overrideAccess: false,
```

Exemplo:

```ts
await payload.find({
  collection: 'pages',
  user: auth.user,
  overrideAccess: false,
})
```

---

## Regra do projeto

### Operação originada por usuário

```text
user + overrideAccess: false
```

### Operação interna privilegiada

Pode usar bypass, porém deve ser explícito:

```ts
overrideAccess: true
```

Exemplos legítimos:

```text
seed
migration
job interno
manutenção administrativa
```

---

# Fase 9 — Revisar helpers em `src/lib/payload`

Revisar:

```text
src/lib/payload/get-page.ts
src/lib/payload/get-site-shell.ts
src/lib/payload/search-pages.ts
src/lib/payload/revalidate-page.ts
src/lib/payload/revalidate-site-shell.ts
```

e outros helpers que utilizem Local API.

Para cada chamada identificar:

```text
é operação pública?
é operação de usuário autenticado?
é operação interna privilegiada?
```

Não alterar comportamento sem necessidade.

---

# Fase 10 — Testes unitários

Criar testes para `normalizeRole()`.

Casos obrigatórios:

```text
admin        → admin
editor       → editor
null         → null
undefined    → null
viewer       → null
string vazia → null
```

---

## Testes da matriz

Validar explicitamente Admin e Editor.

### Admin

Deve possuir permissions administrativas.

### Editor

Deve possuir apenas permissions editoriais.

---

## Testes de `can()`

Exemplos:

```text
Admin + pages.delete → true
Editor + pages.delete → false

Editor + pages.update → true
Editor + pages.publish → true

Editor + users.update → false

Admin + users.assignRole → true
Editor + users.assignRole → false

null user → false
invalid role → false
```

---

# Fase 11 — Testes de Policies

Testar:

```text
Pages
Media
Users
Themes
Globals
Preview
```

Especial atenção para policies que retornam `Where`.

---

# Fase 12 — Testes de integração

Os testes atuais não devem se limitar à validação estrutural dos schemas.

Adicionar testes que exercitem comportamento real.

Cobertura mínima:

| Cenário | Resultado |
|---|---|
| Anonymous cria Page | deny |
| Editor cria Page | allow |
| Editor atualiza Page | allow |
| Editor publica Page | allow |
| Editor exclui Page | deny |
| Admin exclui Page | allow |
| Editor cria Media | allow |
| Editor exclui Media | deny |
| Admin exclui Media | allow |
| Editor acessa Users | deny |
| Admin acessa Users | allow |
| Editor altera role de User | deny |
| Admin altera role de User | allow |
| Editor acessa Themes | deny |
| Admin acessa Themes | allow |
| Editor acessa AuditLogs | deny |
| Admin acessa AuditLogs | allow |
| role null | deny |
| role inválida | deny |
| usuário autenticado sem `pages.preview` | deny preview |

Se possível, cobrir:

```text
REST
Local API
```

GraphQL pode ser coberto de forma amostral se o enforcement for compartilhado pelo mesmo Access Control.

---

# Fase 13 — Remover arquitetura legada

Somente após os testes passarem:

remover comparações diretas de role espalhadas pelo projeto.

Procurar novamente por:

```text
isAdmin
isEditor
role ===
role !==
user.role
req.user.role
auth.user.role
```

A ocorrência restante deve estar restrita ao núcleo de autorização ou possuir justificativa clara.

---

# Fase 14 — Atualizar documentação

Atualizar:

```text
docs/cms/permissions.md
```

Documentar:

1. roles existentes;
2. permissions existentes;
3. matriz Role × Permission;
4. política fail-closed;
5. funcionamento das policies;
6. regras de Local API;
7. bootstrap do primeiro Admin;
8. LDAP não atribui Admin implicitamente.

---

## Atualizar SPECs

Corrigir status inconsistentes nas specs relacionadas à arquitetura de roles.

Especialmente:

```text
SPEC-037
SPEC-027
```

O status deve representar o estado real após a implementação.

---

# Ordem recomendada de commits

Executar preferencialmente na seguinte sequência:

```text
1. security: audit role usages
2. security: backfill roles and fail closed
3. security: remove LDAP admin bootstrap
4. access: introduce permission catalog
5. access: introduce role-permission matrix
6. access: introduce can helper
7. access: introduce domain policies
8. access: migrate Pages and Media
9. access: migrate Users and role field access
10. access: migrate Themes and AuditLogs
11. access: migrate Globals
12. access: secure preview routes
13. access: review Local API usage
14. test: add authorization unit coverage
15. test: add authorization integration coverage
16. docs: update permission architecture
17. refactor: remove legacy role checks
```

Não é obrigatório criar commits durante a execução automatizada, mas essa sequência deve orientar a ordem das mudanças.

---

# Critérios de aceite

A implementação só deve ser considerada concluída quando todos os itens abaixo forem verdadeiros.

## Segurança

- [ ] `null` nunca é Admin.
- [ ] `undefined` nunca é Admin.
- [ ] role desconhecida nunca é Admin.
- [ ] `Users.role` é obrigatória.
- [ ] `Users.role` não possui `defaultValue: 'admin'`.
- [ ] LDAP não cria automaticamente Admin.
- [ ] bootstrap do primeiro Admin acontece somente por seed ou fluxo explícito.
- [ ] Editor não consegue promover a si próprio.
- [ ] Editor não consegue alterar role de outro usuário.
- [ ] Preview verifica permission.
- [ ] Local API em contexto de usuário usa `overrideAccess: false`.

---

## Arquitetura

- [ ] roles estão centralizadas.
- [ ] permissions estão centralizadas.
- [ ] existe matriz Role → Permission.
- [ ] existe helper `can()`.
- [ ] Collections usam policies ou permissions.
- [ ] Globals usam policies ou permissions.
- [ ] regras de domínio complexas ficam em policies.
- [ ] não existem comparações de role espalhadas pela aplicação.

---

## Compatibilidade

- [ ] Admin mantém comportamento atual.
- [ ] Editor mantém comportamento atual.
- [ ] leitura pública de Pages publicadas continua funcionando.
- [ ] publicação/despublicação continua funcionando.
- [ ] Media continua funcionando.
- [ ] Header/Footer continuam editáveis por Editor.
- [ ] Themes continuam restritos ao Admin.
- [ ] SiteSettings continua restrito ao Admin.
- [ ] AuditLogs continuam restritos ao Admin.

---

## Testes

- [ ] testes unitários de roles passam.
- [ ] testes de permissions passam.
- [ ] testes da matriz passam.
- [ ] testes de `can()` passam.
- [ ] testes das policies passam.
- [ ] testes REST relevantes passam.
- [ ] testes Local API relevantes passam.
- [ ] typecheck passa.
- [ ] lint passa sem novos erros.

---

# Fora de escopo

Não implementar agora:

```text
roles configuráveis pelo Admin Panel
permissions configuráveis pelo banco
Collection de Roles
Collection de Permissions
permissions por usuário
role inheritance
ABAC completo
departments
ownership scopes
tenant/site scope
dynamic roles
```

Também não implementar ainda permissions como:

```text
pages.update:own
pages.update:department
pages.update:any
```

A arquitetura deve permitir esse tipo de evolução futuramente, mas não deve introduzir essa complexidade nesta alteração.

---

# Restrição arquitetural importante

Após a implementação, adicionar uma nova role deve exigir prioritariamente:

```text
1. registrar a role;
2. definir suas permissions.
```

Exemplo futuro:

```ts
reviewer: [
  'admin.access',
  'pages.read',
  'pages.preview',
  'pages.update',
]
```

Não deve ser necessário modificar:

```text
Pages.ts
Media.ts
Users.ts
Header.ts
Footer.ts
rotas de preview
```

apenas porque surgiu uma nova role.

Se a inclusão de uma nova role exigir condicionais específicas espalhadas nesses arquivos, considerar a arquitetura incompleta.

---

# Validação final

Ao terminar:

1. executar testes de roles;
2. executar testes de permissions;
3. executar testes de integração;
4. executar:

```bash
npm run typecheck
npm run lint
```

5. procurar por checagens de role antigas;
6. revisar todas as chamadas Local API relacionadas a ações de usuários;
7. comparar a implementação final com `docs/cms/permissions.md`;
8. atualizar documentação e specs;
9. fornecer resumo das alterações;
10. listar riscos ou pontos não cobertos.

---

# Entrega esperada do Codex

Ao finalizar a implementação, retornar:

## Alterações realizadas

Lista objetiva dos arquivos alterados e responsabilidades.

## Migration

Explicar como usuários existentes foram tratados.

## Matriz final

Mostrar:

```text
Role × Permission
```

resultante.

## Segurança

Confirmar especificamente:

```text
fail-closed
LDAP bootstrap removido
role field protegido
preview protegido
Local API revisada
```

## Testes

Informar:

```text
unit
integration
typecheck
lint
```

e seus resultados.

## Pendências

Listar explicitamente qualquer ponto que não pôde ser implementado ou validado.

---

# Regra final

Não expandir o escopo funcional do CMS.

A implementação deve ser uma **refatoração de arquitetura e segurança**, preservando o comportamento atual de Admin e Editor, exceto pelos comportamentos inseguros identificados:

```text
role ausente/inválida sendo tratada como Admin
primeiro login LDAP se tornando Admin
preview autorizado apenas por autenticação
Local API de usuário ignorando Access Control
```

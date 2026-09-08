# Autenticacao LDAP em desenvolvimento

O modo `mock` substitui autenticacao e consulta de perfil no client LDAP. Nenhuma das duas operacoes chama a API, incluindo a consulta feita pelo hook de Users. Somente um login/senha configurado e aceito. O cookie JWT e as permissoes do Payload continuam no fluxo existente.

## Configuracao local

Use os exemplos da raiz, com valores ficticios:

- [`.env.example`](../../.env.example): copie para `.env` e configure banco, segredo do Payload, URL do portal e API externa.
- [`.env.development.local.example`](../../.env.development.local.example): copie para `.env.development.local` para ativar o usuario local sem API.

Se os arquivos de destino ja existirem, edite somente as variaveis necessarias. Os exemplos podem ser versionados; os arquivos reais continuam ignorados pelo Git. No desenvolvimento, `.env.development.local` tem precedencia sobre `.env`.

Configuracao de `.env.development.local`:

```dotenv
LDAP_AUTH_MODE=mock
LDAP_DEV_LOGIN=dev.admin
LDAP_DEV_PASSWORD=dev-admin-local-only
```

Essa senha e apenas um exemplo para uso local. Nao ha senha padrao no codigo. O perfil ficticio possui email `dev.admin@example.test` e nome `Administrador local de desenvolvimento`; a senha nunca e gravada em Users.

No PowerShell, execute:

```powershell
$env:NODE_ENV = 'development'
npm.cmd run seed:dev-admin
npm.cmd run dev
```

Abra `/admin` e use o login e a senha configurados. Reinicie o servidor se ele ja estava aberto ao mudar as variaveis.

O seed usa o `DATABASE_URI` configurado (por padrao, o SQLite local), cria a conta com role `admin` mesmo quando outras contas existem e nao modifica as demais. Reexecutar para a mesma conta Admin nao altera nem duplica dados. Colisao de login/email ou role diferente causa erro em vez de sobrescrever/promover uma conta existente. Use um banco de desenvolvimento.

## Retorno ao servico externo

Defina `LDAP_AUTH_MODE=external` ou remova a configuracao de mock e reinicie. A conta local permanece no banco, mas novas autenticacoes voltam a exigir validacao externa. Encerre a sessao de teste antes da troca: cookies ja emitidos seguem a validade do fluxo JWT existente.

O modo mock exige `NODE_ENV=development`; em production, test ou ambiente indefinido a configuracao e rejeitada, inclusive no carregamento do Payload. Nao defina NODE_ENV como development para executar build/producao. `.env.development.local` nao e carregado pelo build normal do Next.js.

## Decisoes e validacao

- Mudanca limitada ao client, validacao de configuracao e seed dedicado. Sem schema novo, migration, dependencia adicional ou alteracao das regras de provisionamento do endpoint externo.
- A senha fica apenas no ambiente local e na comparacao de credenciais; o perfil retornado nao a inclui.
- Testes do client cobrem ausencia de rede, credenciais incorretas, ambiente proibido, configuracao incompleta e preservacao do caminho externo.
- Sem desvios de escopo. Alteracoes preexistentes em `src/payload-types.ts` e no import map foram preservadas.

### Validacao executada em 2026-09-08

- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou apos adequar a manipulacao de NODE_ENV nos testes aos tipos readonly do Next.js.
- `node --import tsx --test src/lib/ldap/client.test.ts`: 5 testes passaram.
- `npm.cmd test`: 87 de 88 passaram. Falha fora deste escopo em `src/cms-editing-ux.test.ts:75`: o teste espera a palavra `Editor` no conteudo de ajuda existente.
- `npm.cmd run build`: passou; carregou `.env`, sem ativar `.env.development.local`.
- `npm.cmd run seed:dev-admin` com NODE_ENV development: criou a conta no SQLite local; segunda execucao confirmou que nao duplica nem altera a conta.
- Verificacao HTTP via Python/urllib em localhost: login local respondeu 200, cookie HttpOnly foi emitido, `/api/users/me` reconheceu Admin com header Origin do mesmo site e senha incorreta retornou 401. Requisicao de cookie sem Origin/Sec-Fetch-Site foi recusada pelo controle CSRF existente do Payload.
- `git diff --check`: passou. `git check-ignore .env.development.local`: confirmou arquivo local ignorado.

Nao foram alterados o schema, o login externo, a politica de validade de sessoes JWT nem a documentacao de ajuda do Admin que causa a falha preexistente.

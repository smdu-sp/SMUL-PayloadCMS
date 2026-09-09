# Base CMS Editorial

Base em Next.js e Payload CMS para criar portais editoriais administraveis, com Pages, Blocks, Media, navegacao, preview, publicacao, permissoes, auditoria e documentacao de uso no Admin.

Este repositorio deve servir como fundacao reutilizavel de CMS. Regras, textos, links oficiais, identidade visual e conteudos especificos de um projeto devem ser tratados como configuracao, seed, spec de dominio ou extensao propria, nao como premissa fixa da base.

A fonte canonica das specs esta em [docs/specs/README.md](./docs/specs/README.md).

## Objetivo Da Base

A base fornece:

- estrutura editorial com Payload CMS;
- composicao de paginas por Blocks controlados;
- rotas publicas geradas a partir de slugs do CMS;
- drafts, preview, live preview, publish e unpublish;
- biblioteca de midia com metadados editoriais;
- SEO editorial;
- navegacao configuravel;
- roles, permissoes e logs de auditoria;
- padrao de evolucao por specs.

A base nao deve:

- codificar conteudo institucional definitivo;
- acoplar regras de negocio de um dominio especifico aos componentes React;
- transformar o CMS em page builder irrestrito;
- armazenar CSS, SVG ou valores arbitrarios quando presets controlados resolvem;
- antecipar collections, blocks ou integracoes que nao tenham spec aprovada.

## Stack

- Next.js com App Router em `src/app`;
- Payload CMS integrado na mesma aplicacao;
- TypeScript;
- SQLite para bootstrap local do Payload;
- Tailwind CSS com tokens centralizados;
- testes com `node --test` e `tsx`.

## Arquitetura

```text
CMS
-> conteudo configuravel

src/domain/
-> regras puras de negocio

src/lib/
-> integracoes e infraestrutura

src/components/
-> apresentacao

src/app/
-> composicao e rotas
```

Componentes React nao devem conter regras centrais de negocio ou elegibilidade. Sistemas externos devem possuir adapters ou clients proprios em `src/lib/`.

## Organizacao Das Specs

As specs ficam separadas por dominio funcional:

```text
docs/specs/
  00-project/
  01-cms-core/
  02-domain/
  03-design-system/
  04-cms-foundation-ii/
  05-cms-maturity-governance/
```

Use [docs/specs/README.md](./docs/specs/README.md) para navegar pela lista completa e [docs/specs/modelo-de-spec.md](./docs/specs/modelo-de-spec.md) como modelo para novas specs.

## Ordem De Trabalho

Cada spec e uma unidade de trabalho independente. Antes de implementar uma spec:

1. Leia o indice em [docs/specs/README.md](./docs/specs/README.md).
2. Leia a spec autorizada inteira.
3. Inspecione o estado atual do projeto.
4. Liste os arquivos que pretende alterar.
5. Implemente somente o escopo da spec.
6. Execute as validacoes aplicaveis.
7. Registre decisoes, desvios e o que nao foi implementado.

Nao antecipe funcionalidades de specs posteriores.

## Configuracao Do Ambiente

Os comandos abaixo usam PowerShell e devem ser executados na raiz do projeto. Copie os exemplos apenas se os arquivos de destino ainda nao existirem; caso contrario, ajuste as variaveis nos arquivos existentes.

### Configuracao base e API externa

Copie [`.env.example`](./.env.example) para `.env`:

```powershell
Copy-Item -LiteralPath .env.example -Destination .env
```

Preencha as variaveis:

| Variavel | Configuracao |
|---|---|
| `DATABASE_URI` | Banco usado pelo Payload. Para SQLite local: `file:./payload.db`. |
| `PAYLOAD_SECRET` | Segredo aleatorio forte e exclusivo do ambiente; substitua o placeholder do exemplo. |
| `NEXT_PUBLIC_SERVER_URL` | URL do portal. Localmente: `http://localhost:3000`. |
| `LDAP_AUTH_MODE` | `external` para validar credenciais na API externa. |
| `LDAP_API_URL` | URL base real do servico LDAP, sem os caminhos dos endpoints. |

O dominio `ldap.example.test` e ficticio e precisa ser substituido para usar a API externa. No modo local descrito abaixo, essa API nao e consultada.

### Desenvolvimento sem API externa

Mantenha a configuracao base em `.env` e copie [`.env.development.local.example`](./.env.development.local.example) para `.env.development.local`:

```powershell
Copy-Item -LiteralPath .env.development.local.example -Destination .env.development.local
```

O exemplo configura uma unica credencial local:

```dotenv
LDAP_AUTH_MODE=mock
LDAP_DEV_LOGIN=dev.admin
LDAP_DEV_PASSWORD=dev-admin-local-only
```

Crie o administrador no banco de desenvolvimento e inicie o projeto:

```powershell
$env:NODE_ENV = 'development'
npm.cmd run seed:dev-admin
Remove-Item Env:NODE_ENV
npm.cmd run dev
```

O seed cadastra o login configurado com email `dev.admin@example.test`, nome `Administrador local de desenvolvimento` e role `admin`. Ele funciona mesmo quando outras contas ja existem. Reexecutar para a mesma conta Admin nao duplica dados; conflitos de login, email ou perfil interrompem o seed sem sobrescrever contas.

Acesse `http://localhost:3000/admin` com o **login** `dev.admin` e a senha definida em `LDAP_DEV_PASSWORD`. O email e um dado do cadastro; o formulario usa o login. Autenticacao e consulta de perfil funcionam sem chamadas a API externa.

### Alterar a senha local

Edite `LDAP_DEV_PASSWORD` em `.env.development.local` e reinicie o servidor. Nao e necessario executar o seed novamente: a senha local nao e armazenada no banco. Alterar a senha nao encerra sessoes JWT ja abertas; saia da conta para testar um novo login.

### Voltar a autenticacao externa

Encerre a sessao local, defina `LDAP_AUTH_MODE=external` em `.env.development.local` (ou remova esse arquivo), configure `LDAP_API_URL` em `.env` e reinicie o servidor. A conta criada pelo seed permanece no banco; novos logins passam a exigir validacao externa.

No desenvolvimento, `.env.development.local` tem precedencia sobre `.env`. O modo `mock` exige `NODE_ENV=development` e e rejeitado fora desse ambiente. Nao fixe NODE_ENV nos arquivos de exemplo; o Next.js seleciona development em `next dev` e production em build/start quando a variavel nao esta definida no terminal. O build normal nao carrega `.env.development.local`.

Os dois arquivos `.example` podem ser versionados. `.env` e `.env.development.local` continuam ignorados pelo Git. Consulte [Autenticacao LDAP em desenvolvimento](./docs/cms/ldap-development.md) para detalhes do fluxo e das validacoes.

## Comandos

```bash
npm.cmd run dev
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run seed:editorial
```

No ambiente Windows, `npm` via PowerShell pode ser bloqueado por Execution Policy. Use `npm.cmd`.

Tambem ha uma falha ambiental conhecida do `tsx`/Node em `os.userInfo()` neste ambiente. Quando o script normal de testes falhar antes das assertions, a suite pode ser validada com:

```bash
node --import "data:text/javascript,import os from 'node:os'; os.userInfo = () => ({ username: 'x572704' });" --import tsx --test src/**/*.test.ts
```

## Rotas Locais

Para testar o Admin sem consultar a API LDAP, use o [modo local e o seed de administrador](docs/cms/ldap-development.md).

- Frontend: `http://localhost:3000`
- Payload Admin: `http://localhost:3000/admin`

## Definition Of Done

Uma spec so deve ser considerada concluida quando:

- o codigo corresponde ao escopo;
- nenhuma funcionalidade da proxima spec foi introduzida;
- lint passa;
- typecheck passa;
- testes aplicaveis passam;
- build passa quando aplicavel;
- fluxo relevante foi validado localmente ou a pendencia foi registrada;
- decisoes nao previstas foram documentadas;
- o que nao foi implementado foi declarado.

## Principio De Evolucao

Ao surgir uma necessidade nova, classifique nesta ordem:

| Pergunta | Implementacao preferencial |
|---|---|
| E conteudo? | Campo no CMS. |
| E uma variacao visual conhecida? | Variante de Block. |
| E um novo padrao visual? | Novo Block. |
| E regra de negocio? | `src/domain/`. |
| E integracao? | `src/lib/`. |
| E apenas composicao? | `src/app/` ou componente. |

Essa regra preserva a base como CMS editorial controlado e impede que o frontend acumule regra de negocio.

## Conteudo E Configuracao

Nao codifique diretamente em componentes valores sujeitos a alteracao, incluindo:

- datas;
- taxas;
- valores;
- links oficiais;
- contatos;
- parametros legais;
- documentos oficiais;
- identidade visual especifica de um cliente ou programa.

Esses valores devem entrar por CMS, globals, seed revisavel, variaveis de ambiente ou spec de dominio.

## Reuso Em Novos Projetos

Para adaptar esta base:

1. Defina o dominio do novo portal em specs proprias.
2. Revise seeds, globals, textos editoriais e identidade visual.
3. Mantenha regras de negocio fora de React.
4. Use adapters em `src/lib/` para sistemas externos.
5. Atualize este README apenas com informacoes da base; documentacao especifica do projeto deve ficar em `docs/` ou nas specs correspondentes.

# Temas alternativos

Esta nota registra a primeira etapa dos temas nomeados administraveis. O escopo
desta entrega e o tema global ativo; a selecao de tema por Block permanece para
a etapa seguinte.

## Modelo

`themes` e uma Collection administrada somente por Admin. Cada documento possui:

- nome obrigatorio e unico;
- os cinco papeis de cor `background`, `foreground`, `brand`, `action` e `accent`;
- links opcionais de tipografia para texto e titulos;
- o mesmo reset de cores usado pelo tema base.

Os fields sao definidos por `src/fields/theme.ts` e compartilhados com
`SiteSettings.theme`. Assim, temas nomeados e o fallback legado usam os mesmos
validadores HEX, contraste e Google Fonts. Estados de sistema, CSS livre e cores
por elemento interno continuam fora do CMS.

## Ativacao e precedencia

`SiteSettings.activeTheme` e um relacionamento opcional com `themes`. Um unico
relacionamento global evita estados concorrentes de multiplos documentos marcados
como ativos.

```text
tema alternativo ativo e populado
-> SiteSettings.theme preservado
-> defaults institucionais de codigo
```

`src/lib/theme/resolve-active-theme.ts` centraliza essa decisao. O layout, o
helper server-side de tema, a validacao de cores customizadas dos Blocks e o
painel de contraste do Admin usam a mesma precedencia.

Os modos pessoais de acessibilidade continuam separados do tema editorial e
podem sobrescrever seus tokens no navegador.

## Permissoes e ciclo de vida

- leitura de temas e publica para permitir a resolucao no frontend;
- criar, editar e excluir temas exige Admin;
- Editor continua sem administrar Theme ou SiteSettings;
- um tema ativo nao pode ser excluido; primeiro deve ser substituido ou a
  selecao deve ser limpa em Configuracoes do site;
- alteracoes em temas e em SiteSettings revalidam o layout raiz.

## Compatibilidade de dados

`SiteSettings.theme` nao foi renomeado nem removido. Valores ja persistidos
continuam sendo o tema base quando `activeTheme` esta vazio ou ainda nao foi
populado. Nao existe backfill automatico e nenhum valor editorial e inferido.

Mudancas de schema:

- nova Collection `themes`;
- novo relacionamento opcional `SiteSettings.activeTheme`.

## Plano de migration para bancos compartilhados

O repositorio ainda nao possui uma baseline de migrations Payload. Por isso,
`payload migrate:create` gera atualmente uma migration inicial de todo o banco,
nao apenas deste recurso. Essa migration integral nao deve ser aplicada sobre
uma base existente.

Antes da implantacao em ambiente compartilhado:

1. realizar backup e validar a restauracao do banco;
2. estabelecer e revisar uma baseline do schema que ja existe no ambiente;
3. gerar, a partir dessa baseline, uma migration incremental;
4. confirmar que o `up` cria `themes`, seu indice unico e a referencia opcional
   `site_settings.active_theme_id` com indice e `ON DELETE SET NULL`;
5. confirmar que o `down` remove somente essas estruturas e nao apaga tabelas
   ou conteudo preexistente;
6. aplicar primeiro em copia da base e validar o fallback legado antes da
   revisao humana final.

Em desenvolvimento, o adapter SQLite continua usando seu schema push normal.

## Validacao esperada

- schema e permissoes da Collection;
- resolucao `active -> legacy -> default`;
- bloqueio de exclusao do tema ativo;
- validacao dos cinco papeis e das URLs de tipografia;
- typecheck, lint, testes e build;
- verificacao manual no Admin e no frontend apos criar e ativar um tema.

## Validacao executada em 2026-09-30

- `npm.cmd run typecheck`: passou.
- `npm.cmd run lint`: passou sem erros; manteve dois warnings preexistentes de
  `<img>` em `src/components/admin/Logo.tsx`.
- testes focados de temas, permissoes, resolvedor e navegacao: 15 passaram.
- suite completa com o patch Windows de `os.userInfo`: 213 de 214 passaram. A
  unica falha e preexistente e fora deste escopo: `src/cms-editing-ux.test.ts`
  ainda espera que `Pages.admin.defaultColumns` nao contenha `viewPage`, mas o
  schema atual ja contem essa coluna.
- `npm.cmd run build`: passou com acesso de rede ao Google Fonts. A primeira
  tentativa no sandbox falhou apenas por indisponibilidade de rede ao baixar
  Lato.
- `git diff --check`: passou.
- `payload generate:types`: passou usando o patch Windows ja mantido no projeto.
- `payload migrate:create --name alternative-themes`: executado apenas para
  inspecao e descartado, pois gerou uma baseline integral destrutiva em vez de
  uma migration incremental. Nenhuma migration foi aplicada e o banco local nao
  foi alterado por este comando.

Verificacao visual e criacao manual de um tema no Admin permanecem pendentes.

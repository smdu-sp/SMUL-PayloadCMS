# SPEC-046 — Reset de cores do Theme

## Decisões e compatibilidade

- `DEFAULT_THEME` mantém os defaults SMUL em código. O fallback CSS permanece para uso independente dos tokens; um teste verifica sua correspondência.
- `SiteSettings.branding` mantém os três campos opcionais de texto HEX, sem `defaultValue`. Ausência, vazio ou `null` significam ausência de override.
- O botão Reset limpa somente as três cores do formulário. É necessário salvar para persistir; a autorização continua sendo `adminOnly` no Global.
- Valores já persistidos continuam sendo overrides, inclusive quando coincidem com defaults antigos. Não é seguro inferir se foram uma escolha editorial. O reset explícito limpa esses valores.
- A mudança não altera colunas, nomes, tipos ou relationships. O campo `ui` não é persistido; nenhuma migration de dados é necessária. Não houve limpeza automática do banco.

## ADR — Governança de cores customizadas

Decisão deste ciclo: manter a personalização global restrita aos três tokens existentes. Presets continuam sendo o mecanismo principal de aparência dos Blocks. Cores são armazenadas como HEX curto ou longo; CSS livre e valores que não sejam HEX não são aceitos.

Para a futura SPEC-047, a direção arquitetural é permitir customização somente na aparência semântica do Block (fundo, primeiro plano e destaque), com herança pelos componentes internos, sem controles individuais de títulos, bordas, ícones ou botões. A aprovação de pares de contraste e o bloqueio de combinações devem ser definidos antes de habilitar o Color Picker, usando critérios WCAG para texto e controles. Esta decisão não adiciona campos, picker ou validação de contraste neste ciclo.

## Fora do escopo

Não foram implementadas as SPECS 047–050, Color Picker, novas aparências de Blocks, reset de outros dados do site ou migração automática de overrides legados.

## Validação

- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `node --import tsx --test src/lib/theme/map-theme-to-css-variables.test.ts`: 5/5 passaram.
- `npm run test`: 119/121 passaram. Falhas fora da SPEC-046: `video-embed.test.ts` usa Vitest sob o runner Node; a lista esperada em `cms-foundation-validation.test.ts` não inclui o `videoBlock` já registrado. Esses arquivos não foram alterados.
- `npm run payload -- generate:importmap` e `generate:types`: recusados pela proteção existente de LDAP mock fora de desenvolvimento. Reexecutados com sucesso pelo executor de desenvolvimento do projeto: `node --import ./src/seeds/patch-os-userinfo.mjs --import tsx ./src/seeds/run-payload-development.mjs generate:importmap` e o mesmo comando com `generate:types`. Os tipos gerados não tiveram mudança semântica.
- `npm run build`: passou; repetido após a geração do import map para validar o registro final.
- `git diff --check`: passou.

Não foi feita validação visual em uma sessão autenticada do Admin.

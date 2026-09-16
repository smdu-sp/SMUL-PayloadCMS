# SPEC-046 - Reset de cores do Theme

## Decisoes e compatibilidade

- `DEFAULT_THEME` mantem os defaults SMUL em codigo. O fallback CSS permanece para uso independente dos tokens; um teste verifica sua correspondencia.
- `SiteSettings.branding` mantem campos opcionais de texto HEX, sem `defaultValue`. Ausencia, vazio ou `null` significam ausencia de override.
- O botao Reset limpa todos os overrides de cor do formulario. E necessario salvar para persistir; a autorizacao continua sendo `adminOnly` no Global.
- Valores ja persistidos continuam sendo overrides, inclusive quando coincidem com defaults antigos. Nao e seguro inferir se foram uma escolha editorial. O reset explicito limpa esses valores.
- A mudanca adiciona campos opcionais em `SiteSettings.branding`, sem renomear ou remover campos existentes. Nenhuma migration destrutiva e necessaria para documentos ja persistidos.

## ADR - Governanca de cores customizadas

Decisao atual: manter a personalizacao global restrita a campos semanticos controlados. Presets continuam sendo o mecanismo principal de aparencia dos Blocks. Cores sao armazenadas como HEX curto ou longo; CSS livre e valores que nao sejam HEX nao sao aceitos.

A direcao arquitetural e permitir customizacao somente por papeis visuais, como fundo, titulo, texto, acao, link e destaque. A UI futura de color picker deve escrever nesses campos semanticos, sem criar controles individuais de titulo, borda, icone ou botao.

## Fora do escopo

Nao foram implementados componente visual de color picker, novas aparencias de Blocks, reset de outros dados do site ou migracao automatica de overrides legados.

## Validacao

A validacao desta etapa deve incluir:

- `npm run lint`
- `npm run typecheck`
- testes de mapeamento de tema e UX editorial do CMS
- `npm run build`

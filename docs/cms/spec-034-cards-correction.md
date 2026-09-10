# SPEC-034 — Correção da apresentação de imagens nos Cards

## Decisões

- Os Cards usam somente `imagePresentation`. Por orientação do responsável pelo projeto, os documentos atuais são testes de um template para sites futuros; não haverá migração nem compatibilidade com `imageSize`, `imageAspect` ou `fit` antigos.
- Nenhum schema, relacionamento ou arquivo de mídia foi alterado nesta correção.
- A renderização completa campos ausentes com os defaults do schema dos Cards: `medium`, `original`, `cover`. A mesma configuração efetiva determina as classes e o ponto focal.
- O ponto focal da mídia é aplicado somente com `cover` e proporção diferente de `original`, usando o helper compartilhado com Hero e ImageText.
- Seeds e fixtures foram inspecionados; não contêm campos antigos de apresentação de Cards que precisem de conversão.

## Validação

- Testes percorrem os componentes até `MediaImage` e conferem as classes e os estilos destinados à imagem: defaults, posições acima/esquerda/direita, recortes com ponto focal, `contain`, `original`, ausência de ponto focal e preservação de ícones. A renderização direta de `next/image` pelo Node/tsx não é compatível com o default export dessa dependência; a integração com o Next é verificada pelo build.
- `node --import tsx --test src/blocks/Cards/image-presentation.test.ts`: 5 testes aprovados.
- `npm run build`: aprovado.
- `npm run lint`: aprovado.
- `npm run typecheck`: aprovado.
- `npm test`: 102 testes aprovados, sem falhas.
- `git diff --check`: aprovado.
- Verificação visual desktop/mobile pendente: o runtime do navegador informou `No browser is available` e a descoberta retornou lista vazia. Os testes de propriedades não substituem essa conferência visual.

## Fora de escopo

- Migração, suporte a campos antigos, novos controles editoriais e edição do arquivo original.

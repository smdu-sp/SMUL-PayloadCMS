# Canvas de edicao de imagens

## Decisoes da SPEC-041

- O Canvas edita a **apresentacao de uma ocorrencia** da imagem em um Block. Ele nao altera, substitui ou duplica o arquivo armazenado em `Media`.
- A mesma imagem pode ser usada em varios Blocks com cortes, pontos focais, proporcoes e rotacoes diferentes.
- O valor persistido pertence ao documento `Page`, ao lado do relacionamento de imagem, em `imagePresentation.canvas` ou em um campo Canvas equivalente para desktop/mobile.
- O contrato do Canvas usa apenas percentuais e rotacoes fechadas (`0`, `90`, `180` e `270`). A regra de normalizacao e validacao fica em `src/domain/image-presentation.ts`.
- O preview do Admin e processado no navegador. Nao existe upload, endpoint de transformacao, processamento com `sharp` nem criacao de asset derivado.
- A renderizacao publica interpreta os metadados por ocorrencia e aplica enquadramento, foco e rotacao sobre a imagem original.

## Blocks atendidos

- Imagem;
- Imagem e texto;
- Hero, tanto na imagem dividida quanto no background desktop/mobile;
- Cards;
- Galeria;
- Carrossel;
- Banner de imagem em largura total, com configuracoes independentes para desktop/mobile.

Galeria e Carrossel possuem configuracao por item. Os demais Blocks persistem a configuracao ao lado do respectivo campo de midia.

## Compatibilidade e migration

Os campos legados `Media.parentMedia`, `Media.isDerived`, `Media.focalPoint` e `Media.editingMetadata` foram mantidos neste ciclo para nao remover dados persistidos de outra branch. O endpoint de geracao de derivados e a permissao exclusiva associada a ele foram desativados.

Os campos Canvas sao aditivos e opcionais. Os novos grupos de apresentacao de Galeria e Carrossel possuem defaults seguros. Documentos antigos continuam usando os defaults de apresentacao e o ponto focal de `Media`, portanto nao exigem backfill de conteudo; o deploy ainda deve aplicar a atualizacao incremental do schema do banco. Uma futura remocao dos campos legados de `Media` exige migration propria, inventario dos assets derivados existentes e validacao humana antes da aplicacao.

## Fora desta implementacao

- alteracao dos bytes ou overwrite do arquivo original;
- criacao, historico, exclusao ou restauracao de assets derivados;
- filtros, brilho, contraste, desenho e sobreposicao de texto;
- crop ou rotacao livres fora do contrato validado;
- edicao em lote;
- migracao destrutiva dos campos legados de `Media`.

## Validacao

Executar:

```powershell
npm run typecheck
npm run lint
npm test
npm run build
git diff --check
```

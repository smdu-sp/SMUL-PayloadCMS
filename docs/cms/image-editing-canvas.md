# Canvas de edição de imagens

## Decisões da SPEC-041

- A SPEC-034 foi considerada insuficiente para o caso de uso de gerar uma imagem editada: seus controles alteram somente a apresentação dentro do bloco e não criam um novo asset.
- Nenhum feedback editorial foi anexado ao pedido. A justificativa foi registrada a partir do gap observável entre apresentação e geração de derivados; a validação com usuários continua sendo uma decisão operacional pendente.
- O processamento usa `sharp`, no servidor, e aceita somente operações validadas: rotação em ângulos fixos, redimensionamento em presets de largura, proporção e ponto focal.
- Cada execução lê o arquivo indicado por `filename`, aplica a transformação no servidor e cria um novo asset derivado na collection `Media`, preservando o original.
- O Canvas é restrito ao perfil administrador, e a edição gera um registro em `AuditLogs` para a mídia derivada com referência ao asset original.

## Fora desta implementação

- filtros, brilho, contraste, desenho e sobreposição de texto;
- escrita sobre o arquivo original;
- controle numérico livre de crop ou resize;
- edição em lote;
- histórico, exclusão ou restauração de derivados;
- validação editorial automatizada com usuários reais.

## Validação executada

- `npm run typecheck`
- `npm run lint -- --quiet`
- `node --import tsx --test src/access/permissions.test.ts src/access/role-permissions.test.ts src/access/policies.test.ts src/lib/media/image-editing-canvas.test.ts`
- `npm test` (`254` testes aprovados)
- `npm run build`

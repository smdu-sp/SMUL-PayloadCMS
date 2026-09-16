# Canvas de edição de imagens

## Decisões da SPEC-041

- A SPEC-034 foi considerada insuficiente para o caso de uso de gerar uma imagem editada: seus controles alteram somente a apresentação dentro do bloco e não criam um novo asset.
- Nenhum feedback editorial foi anexado ao pedido. A justificativa foi registrada a partir do gap observável entre apresentação e geração de derivados; a validação com usuários continua sendo uma decisão operacional pendente.
- O processamento usa `sharp`, no servidor, e aceita somente operações validadas: rotação em ângulos fixos, redimensionamento em presets de largura, proporção e ponto focal.
- Cada execução lê o arquivo indicado por `filename` e cria um novo documento na collection `Media`, relacionado pelo campo `sourceMedia`. O documento original não é atualizado nem sobrescrito.
- O Canvas é restrito ao perfil administrador. Cada derivada gera um registro em `AuditLogs` com o asset de origem.

## Fora desta implementação

- filtros, brilho, contraste, desenho e sobreposição de texto;
- escrita sobre o arquivo original;
- controle numérico livre de crop ou resize;
- edição em lote;
- histórico, exclusão ou restauração de derivados;
- validação editorial automatizada com usuários reais.

## Validação executada

- `node --import tsx --test src/lib/media/image-editing-canvas.test.ts`
- `get_errors` nos arquivos alterados: sem erros reportados.
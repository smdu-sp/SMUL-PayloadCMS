# SPEC-025 — Live Preview

O Payload Admin oferece Live Preview para documentos existentes da coleção Pages. O iframe abre uma rota autenticada, exige a permission `pages.preview`, habilita Draft Mode e recebe as alterações ainda não salvas pelo protocolo oficial do Payload.

Autenticação isolada não autoriza preview. As rotas de draft e live preview validam
a policy `canPreviewContent` e consultam Pages pela Local API com o usuário autenticado
e `overrideAccess: false`.

## Uso editorial

1. Abra uma Page existente no Admin.
2. Ative **Live Preview** nos controles do documento.
3. Edite os campos e confira a composição no iframe.
4. Alterne entre Celular, Tablet, Desktop e Responsive para visualizar as variants em larguras diferentes.
5. Use o botão de Preview tradicional quando precisar abrir o rascunho em uma aba separada.

## Matriz validada

| Block aprovado | Alterações refletidas |
|---|---|
| Destaque principal | título, texto, imagem, ação e modelo de apresentação |
| Texto editorial | conteúdo e largura de leitura |
| Cards e grades de benefícios | título, itens, links, ícones e modelo Modalidades |
| Faixas de ação | título, links, itens, tom visual e organização |
| Perguntas frequentes | título, perguntas, respostas e modelo |
| Caixa de aviso | conteúdo, link e tipo |
| Grade de ícones e informações | título, ícones, descrições, links e modelo |
| Mídia e texto / imagem de destaque | alinhamento, texto, mídia e ação |
| Chamada de ação | conteúdo, ação e modelo |

Uploads e relacionamentos são populados pela API do Payload com a sessão autenticada. A página pública continua consultando apenas conteúdo publicado; dados de rascunho são obtidos somente quando o cookie de Draft Mode está ativo.

## Limites

Hero Countdown, Benefits Grid dedicado, Media Highlight dedicado e Info Cards/Steps não fazem parte do catálogo aprovado implementado e, portanto, não foram adicionados. O Destaque principal não recebeu `counterNumbers` nem contagem regressiva real.

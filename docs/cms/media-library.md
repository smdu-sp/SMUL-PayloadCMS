# SPEC-022 - Media Library

Esta nota registra a politica unica de midia do CMS.

## Papeis suportados

| Papel | Uso previsto | Estrategia |
|---|---|---|
| `background` | Imagens amplas para aberturas e futuros backgrounds editoriais. | Upload em Media com ponto focal habilitado. |
| `logo` | Logo institucional no Header e futuras aberturas especificas. | Upload em Media; SVG nao e aceito nesta fase. |
| `icon` | Icones usados em Cards e Icon Grid. | Upload controlado em Media; preferir PNG/WebP simples com alt objetivo. |
| `content` | Imagens editoriais gerais. | Upload em Media com legenda opcional. |
| `infographic` | Infograficos usados em Media & Text/ImageText. | Renderizacao responsiva via `MediaImage` com `sizes` definido pelo componente consumidor. |
| `document` | Documentos de apoio quando necessarios. | PDF permitido no Media; Blocks visuais continuam usando imagens quando renderizam com `MediaImage`. |

## Formatos permitidos

Permitidos em `src/collections/Media.ts`:

- `image/jpeg`
- `image/png`
- `image/webp`
- `image/gif`
- `application/pdf`

SVG nao foi liberado nesta fase. A decisao reduz risco de scripts/markup ativo em uploads e evita tratamento especial no `next/image`. Para logos e icones, usar PNG ou WebP aprovados.

## Politica de alt

- `alt` e obrigatorio para todo item da biblioteca.
- O texto deve descrever objetivamente a midia para leitores de tela.
- Imagens decorativas devem ser evitadas no CMS; quando uma imagem for editorialmente irrelevante, preferir nao cadastra-la.
- Legenda e opcional e deve ser usada para credito, contexto ou complemento editorial.

## Sizes e responsividade

O Payload nao gera derivados de imagem nesta fase. Isso evita adicionar processamento com `sharp` antes de haver consumo real no frontend. O frontend usa `next/image` por meio de `MediaImage` e declara `sizes` nos componentes:

- Hero e ImageText: largura responsiva com 50vw em desktop e 100vw em telas menores.
- Cards e IconGrid: tamanhos fixos pequenos para icones.
- Futuros backgrounds devem usar ponto focal e fallback editorial quando a imagem nao estiver configurada.

## Estrategias por Block

| Area | Decisao |
|---|---|
| Hero | Imagem continua opcional; se nao houver midia, o bloco renderiza conteudo sem imagem. |
| Icon Grid | Continua usando uploads de Media, sem catalogo fixo de icones nesta fase. |
| Media & Text / ImageText | Usa `MediaImage` responsivo; infograficos devem ser cadastrados como `infographic`. |
| Header | Logo institucional usa Media e deve ter alt descritivo. |
| SEO | Social image continua usando Media. |

## Limites da SPEC-022

- Nenhum storage externo foi configurado.
- Nenhum `imageSizes` do Payload foi gerado.
- Nenhum catalogo fechado de icones foi criado.
- Nenhum tratamento especial para SVG foi implementado porque SVG nao esta permitido.
- Nenhum novo Block de Media Highlight ou Hero Countdown foi criado.

## Atualizacao dos testes manuais — fase 5

SVG (`image/svg+xml`) e AVIF (`image/avif`) foram incluidos nos formatos de imagem. O Payload valida o conteudo de SVG antes de aceita-lo; a rota de entrega aplica CSP que bloqueia recursos externos e scripts, e o frontend exibe SVG sem passar pelo otimizador de imagem. JPEG, PNG, WebP, GIF e PDF permanecem permitidos. Essa mudanca de politica nao altera o schema nem arquivos ja salvos.

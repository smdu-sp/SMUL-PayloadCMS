# Catalogo atual de Blocks e Globals

Este catalogo registra a base real encontrada no projeto durante a SPEC-018. Ele deve ser usado antes de propor novos Blocks, variants ou primitives.

## Blocks registrados em Pages

`src/collections/Pages.ts` registra quatorze Blocks no campo `layout`: `hero`, `richText`, `imageBlock`, `gallery`, `carousel`, `videoBlock`, `imageText`, `cards`, `cta`, `iconGrid`, `faqAccordion`, `alertBox`, `actionBanners` e `fullWidthImageBanner`. A renderizacao publica passa por `src/components/RenderBlocks/index.tsx`.

| Block atual | Schema | Component | Variants | Uso |
|---|---|---|---|---|
| Hero | `src/blocks/Hero/config.ts` | `src/blocks/Hero/Component.tsx` | `default`, `centered`, `split`; fallback legado `image` para `split` | Abertura editorial de pagina com chamada superior, titulo, resumo, imagem opcional e acao principal. |
| RichText | `src/blocks/RichText/config.ts` | `src/blocks/RichText/Component.tsx` | `default`, `narrow`; fallbacks legados `content` e `wide` | Conteudo editorial livre com Lexical, adequado para introducoes, explicacoes e textos institucionais. |
| Image Block | `src/blocks/ImageBlock/config.ts` | `src/blocks/ImageBlock/Component.tsx` | Presets de tamanho, proporcao e ajuste; temas preset ou `custom` com `background` e `foreground` | Imagem editorial unica, responsiva, com legenda opcional e sem dimensoes numericas livres. |
| Gallery | `src/blocks/Gallery/config.ts` | `src/blocks/Gallery/Component.tsx` e `src/blocks/Gallery/GalleryLightbox.tsx` | Colunas `2`, `3`, `4`; preset `grid`; efeito `none` ou `grow` | Galeria de imagens com miniaturas responsivas e lightbox/dialog acessivel com teclado. |
| Carousel | `src/blocks/Carousel/config.ts` | `src/blocks/Carousel/Component.tsx` e `src/blocks/Carousel/CarouselClient.tsx` | Slides por visualizacao `1`, `2`, `3`; navegacao `arrows` ou `arrows-dots`; autoplay `off` ou `on` | Conteudo sequencial com navegacao manual acessivel e autoplay opcional pausavel. |
| Video Block | `src/blocks/VideoBlock/config.ts` | `src/blocks/VideoBlock/Component.tsx` | Proporcoes `16:9`, `4:3`, `1:1`; temas preset ou `custom` com `background` e `foreground` | Video incorporado de YouTube ou Vimeo com titulo acessivel e legenda opcional. |
| ImageText | `src/blocks/ImageText/config.ts` | `src/blocks/ImageText/Component.tsx` | `image-left`, `image-right`; fallbacks legados `left` e `right` | Secoes de duas colunas com midia, titulo, rich text e acao complementar opcional. |
| Cards | `src/blocks/Cards/config.ts` | `src/blocks/Cards/Component.tsx` | `default`, `modalities` | Listas editoriais em grade com titulo, resumo, itens, icone, descricao e link opcional; a variant `modalities` cobre modalidades sem duplicar Block. |
| CTA | `src/blocks/CTA/config.ts` | `src/blocks/CTA/Component.tsx` | Variants `default`, `brand`, `compact`; temas preset ou `custom`; paleta local com `background`, `foreground`, `brand`, `action` e `accent` | Chamadas de acao pontuais ou finais com titulo, descricao e link obrigatorio. Cores sem contraste recebem fallback seguro no renderer. |
| Icon Grid | `src/blocks/IconGrid/config.ts` | `src/blocks/IconGrid/Component.tsx` | `default`, `compact` | Grade compacta de itens com icone, texto curto e link opcional, priorizada para paginas de modalidades. |
| FAQ / Accordion | `src/blocks/FAQ/config.ts` | `src/blocks/FAQ/Component.tsx` | `default`, `compact` | Lista acessivel de perguntas e respostas com rich text, renderizada com `details` e `summary`. |
| Alert Box | `src/blocks/AlertBox/config.ts` | `src/blocks/AlertBox/Component.tsx` | `info`, `warning` | Aviso editorial com tom controlado pelo Design System, rich text e link opcional. |
| Action Banners | `src/blocks/ActionBanners/config.ts` | `src/blocks/ActionBanners/Component.tsx` | `grid`, `stacked`; aparencias `primary`, `brand`, `accent` | Conjunto reordenavel de faixas de acao, sem cores livres no CMS. |

## Globals e estruturas globais

| Estrutura | Schema | Responsabilidade atual | Observacao |
|---|---|---|---|
| Header | `src/globals/Header.ts` | Logo opcional e navegacao principal para paginas internas. | Deve permanecer fora de `Pages.layout`; e componente estrutural do layout. |
| Footer | `src/globals/Footer.ts` | Telefone, e-mail, endereco fisico, atendimento presencial, redes sociais e links institucionais. | Deve permanecer fora de `Pages.layout`; conteudo sujeito a alteracao fica no CMS. |
| SiteSettings | `src/globals/SiteSettings.ts` | Nome do site, prazo institucional, links oficiais, branding controlado e SEO padrao. | Fonte configuravel para valores institucionais e tokens autorizados. |

## Primitives e helpers relevantes

| Item | Caminho | Papel |
|---|---|---|
| `Section` | `src/components/ui/Section.tsx` | Espacamento vertical e tons de fundo aprovados pelo Design System. |
| `Container` | `src/components/ui/Container.tsx` | Larguras maximas consistentes por contexto editorial. |
| `Card` | `src/components/ui/Card.tsx` | Superficie reutilizavel para itens repetidos e CTAs enquadrados. |
| `Heading` e `Text` | `src/components/ui/Heading.tsx`, `src/components/ui/Text.tsx` | Tipografia padronizada. |
| `Button` | `src/components/ui/Button.tsx` | Aparencias e tamanhos de acao. |
| `BlockLink` | `src/blocks/shared/BlockLink.tsx` | Renderizacao unica de links internos e externos dos Blocks. |
| `createLinkFields` | `src/fields/link.ts` | Contrato unico para links internos/externos em Blocks com CTA. |
| `MediaImage` | `src/blocks/shared/MediaImage.tsx` | Renderizacao de uploads de midia do Payload. |
| `createSocialLinkFields` | `src/globals/shared/social-link.ts` | Campos reutilizaveis para redes sociais oficiais em Globals. |
| `createSeoFields` | `src/fields/seo.ts` | Campos reutilizaveis para Page SEO e SEO padrao. |
| Semantic color tokens | `docs/cms/semantic-color-tokens.md` | Matriz de papeis visuais usada por primitives e futuros color pickers. |

## Regras de uso

- Avaliar `RichText`, `ImageText`, `CTA` e `Cards` antes de criar qualquer novo Block editorial.
- Criar `variant` quando a intencao editorial for a mesma e a diferenca for principalmente apresentacao.
- Criar novo Block quando o schema precisar expressar uma semantica propria, como pergunta/resposta, aviso, prazo ou grade compacta de icones.
- Manter Header, Footer e SiteSettings como Globals ou composicao de layout, nao como Blocks de pagina.
- Nao introduzir CSS livre no CMS; variantes devem continuar restritas ao Design System.

## Decisoes da SPEC-019

- Implementados: `iconGrid`, `faqAccordion`, `alertBox`, `actionBanners`.
- Evoluido: `cards` recebeu a variant `modalities` para evitar um `ModalitiesCards` duplicado.
- Mantidos para specs futuras: `heroCountdown`, `mediaHighlight`, `steps` e a evolucao eventual de Benefits Grid.
- Nao foram implementados relogio, prazo, timezone, regras juridicas ou novos fluxos editoriais fora do lote priorizado.

## Decisoes da SPEC-021

- Centralizado: `createLinkFields` agora vive em `src/fields/link.ts`.
- Centralizado: resolucao de href, target e rel vive em `src/lib/navigation/resolve-link.ts`.
- Atualizados: Blocks com CTA usam o mesmo contrato de link; Header, Footer e SiteSettings mantem formatos compativeis com o banco atual e sao resolvidos pelo helper central.
- Mantido: `src/blocks/shared/link.ts` reexporta o helper para compatibilidade interna.

## Decisoes da SPEC-022

- Media suporta papeis editoriais por `usage`: `content`, `background`, `logo`, `icon`, `infographic` e `document`.
- MIME types permitidos: JPEG, PNG, WebP, GIF e PDF.
- SVG permanece fora da lista permitida nesta fase.
- Payload nao gera `imageSizes` nesta fase; `next/image` e `MediaImage` cuidam da responsividade no frontend.

## Decisoes da SPEC-023

- SEO editorial foi centralizado em `src/fields/seo.ts` e `src/lib/seo/metadata.ts`.
- Pages usam `metaTitle`, `metaDescription`, `socialImage`, `canonical`, `noIndex` e `noFollow`.
- `SiteSettings.defaultSEO` usa o mesmo field group sem canonical/robots.
- Campos legados `title`, `description` e `image` seguem escondidos para compatibilidade.
- Sitemap publico usa apenas Pages publicadas e ignora `seo.noIndex`.
- `MediaImage` aceita `sizes`; Hero/ImageText usam regra responsiva e Cards/IconGrid usam tamanhos pequenos para icones.

## Decisoes da SPEC-028

- Processo de evolucao de schema documentado em `docs/cms/schema-evolution-migrations.md`.
- Fixtures antiga e nova de `Pages.layout` foram fixadas em teste para validar renderizacao de dados persistidos.
- Variants legadas e desconhecidas continuam dependendo dos normalizadores dos componentes, sem migration destrutiva neste ciclo.
- Renames, remocoes, mudancas de tipo e mudancas de relationship passam a exigir plano de migration antes do patch.

## Decisoes da SPEC-029

- A validacao final da fundacao CMS foi registrada em `docs/cms/foundation-validation.md`.
- Os quatro cenarios mapeados foram cobertos por fixtures de composicao em `src/cms-foundation-validation.test.ts`.
- `docs/cms/known-issues.md` separa dividas em CMS foundation, visual fidelity e domain features deferred.
- A fundacao foi validada sem implementar regras das Specs 007 a 010.

## Decisoes da SPEC-042

- Implementado: `imageBlock`, dedicado a uma unica imagem da Media Library.
- Reutilizado: `createImagePresentationFields`, `getImagePresentationClassName`, `getImagePresentationFitClassName`, `getFocalPointStyle` e `MediaImage`.
- Controlado: tamanho, proporcao, `cover`/`contain` e alinhamento usam presets fechados; nao ha dimensoes numericas livres.
- Mantido fora do escopo: galeria, lightbox, carousel, edicao/crop persistente da imagem e novas collections.

## Decisoes da SPEC-043

- Implementado: `gallery`, com titulo opcional, lista de imagens, importacao auxiliar em lote, legenda por imagem exibida apenas no lightbox, colunas fechadas, preset `grid` e efeito de miniatura controlado.
- Implementado: lightbox como Dialog acessivel com `Esc`, foco inicial, trap de foco, retorno ao acionador e navegacao anterior/proxima por teclado.
- Mantido fora do escopo: masonry, carousel automatico, metadados editoriais adicionais e edicao/crop persistente das imagens.

## Decisoes da SPEC-044

- Implementado: `carousel`, separado de `gallery`, para conteudo sequencial com imagem, textos e link opcional por slide.
- Controlado: slides por visualizacao, navegacao e autoplay usam presets fechados.
- Acessibilidade: regiao com `aria-roledescription`, slides identificados, foco visivel e controles anterior/proximo por botao.
- Autoplay: desligado por padrao; quando ligado, respeita `prefers-reduced-motion`, possui botao de pausa e para apos interacao do usuario.
- Mantido fora do escopo: swipe gestual customizado, loop infinito visual complexo, temporizador configuravel e efeitos livres.

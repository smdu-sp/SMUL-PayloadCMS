import type { Page } from "../payload-types.ts";

export type PageBlock = NonNullable<Page["layout"]>[number];
type LexicalContent = Extract<PageBlock, { blockType: "richText" }>["content"];

const paragraph = (text: string) => ({
  type: "paragraph",
  children: [
    {
      type: "text",
      detail: 0,
      format: 0,
      mode: "normal",
      style: "",
      text,
      version: 1,
    },
  ],
  direction: null,
  format: "",
  indent: 0,
  version: 1,
});

const richText = (...paragraphs: string[]): LexicalContent => ({
  root: {
    type: "root",
    children: paragraphs.map(paragraph),
    direction: null,
    format: "",
    indent: 0,
    version: 1,
  },
});

const internalLink = (label: string, page: number) => ({
  label,
  type: "internal" as const,
  page,
  newTab: false,
});

export const seedShowcaseLayout = (
  mediaId: number,
  seedPageId: number,
  bannerMediaId = mediaId,
): PageBlock[] => [
  {
    blockType: "hero",
    blockName: "Demonstração — Destaque principal",
    eyebrow: "Catálogo editorial",
    title: "Conheça os blocos disponíveis para montar uma página",
    description:
      "O Destaque principal abre a página com título, resumo e uma ação opcional. Este exemplo usa o modelo centralizado.",
    cta: internalLink("Explorar o catálogo", seedPageId),
    variant: "centered",
    appearance: {
      tone: "brand",
      alignment: "center",
    },
  },
  {
    blockType: "richText",
    blockName: "Demonstração — Texto editorial",
    content: richText(
      "O bloco Texto editorial é indicado para introduções, explicações, listas e conteúdo institucional que precisa de formatação livre.",
      "Neste exemplo, a largura de leitura estreita reduz o comprimento das linhas e favorece textos corridos mais longos.",
    ),
    variant: "narrow",
    appearance: {
      width: "narrow",
      spacing: "default",
    },
  },
  {
    blockType: "imageText",
    blockName: "Demonstração — Mídia e texto",
    title: "Combine uma imagem com conteúdo explicativo",
    content: richText(
      "Mídia e texto organiza uma imagem, um título, conteúdo formatado e uma ação opcional. A variante escolhida posiciona a imagem à esquerda em telas maiores.",
    ),
    image: mediaId,
    imagePresentation: {
      size: "medium",
      aspectRatio: "original",
      fit: "cover",
    },
    variant: "image-left",
    cta: internalLink("Voltar ao início do catálogo", seedPageId),
    appearance: {
      tone: "default",
      spacing: "default",
    },
  },
  {
    blockType: "cards",
    blockName: "Demonstração — Cards",
    title: "Apresente opções relacionadas em cards",
    description:
      "O modelo Modalidades destaca caminhos editoriais sem criar um tipo de bloco separado.",
    variant: "modalities",
    appearance: {
      tone: "surface",
      spacing: "default",
    },
    items: [
      {
        title: "Card com ação",
        description:
          "Pode incluir ícone, descrição e um link para outra página do portal.",
        icon: mediaId,
        link: internalLink("Ver demonstração", seedPageId),
      },
      {
        title: "Card informativo",
        description:
          "Também pode apresentar somente uma informação, sem navegação adicional.",
        icon: mediaId,
      },
      {
        title: "Quantidade flexível",
        description:
          "A grade ajusta suas colunas conforme o espaço e a quantidade de itens.",
        icon: mediaId,
      },
    ],
  },
  {
    blockType: "actionBanners",
    blockName: "Demonstração — Faixas de ação",
    title: "Destaque diferentes chamadas para ação",
    variant: "grid",
    banners: [
      {
        title: "Ação principal",
        description: "Usa o tom verde para a chamada de maior prioridade.",
        appearance: "primary",
        button: internalLink("Abrir ação principal", seedPageId),
      },
      {
        title: "Ação institucional",
        description: "Usa o tom azul para conteúdos de caráter institucional.",
        appearance: "brand",
        button: internalLink("Abrir ação institucional", seedPageId),
      },
      {
        title: "Ação de apoio",
        description: "Usa o tom amarelo para uma chamada complementar.",
        appearance: "accent",
        button: internalLink("Abrir ação de apoio", seedPageId),
      },
    ],
  },
  {
    blockType: "fullWidthImageBanner",
    blockName: "Demonstracao - Banner de imagem full-width",
    desktopImage: bannerMediaId,
    content: {
      eyebrow: "Imagem responsiva",
      title: "Use uma imagem em largura total preservando sua proporcao",
      description:
        "O banner full-width apresenta uma midia entre secoes e se adapta as dimensoes do arquivo selecionado.",
      actions: [
        internalLink("Voltar ao inicio do catalogo", seedPageId),
      ],
    },
    contentPosition: "left",
    overlay: "none",
    imageHeight: "auto",
    imageFit: "contain",
    focalPoint: "center",
  },
  {
    blockType: "faqAccordion",
    blockName: "Demonstração — Perguntas frequentes",
    title: "Organize dúvidas em uma lista expansível",
    description:
      "Cada pergunta possui uma resposta em Rich Text e pode ser aberta individualmente.",
    variant: "default",
    items: [
      {
        question: "Quando devo usar Perguntas frequentes?",
        answer: richText(
          "Use este bloco quando o conteúdo puder ser organizado em perguntas objetivas e respostas independentes.",
        ),
      },
      {
        question: "O acordeão funciona com teclado?",
        answer: richText(
          "Sim. A apresentação usa elementos expansíveis acessíveis por teclado e tecnologias assistivas.",
        ),
      },
    ],
  },
  {
    blockType: "alertBox",
    blockName: "Demonstração — Caixa de aviso",
    title: "Use avisos para informações que exigem atenção",
    content: richText(
      "A Caixa de aviso separa uma orientação importante do restante do conteúdo. O tipo Atenção altera apenas o tom visual aprovado pelo Design System.",
    ),
    type: "warning",
    link: internalLink("Voltar para o início", seedPageId),
  },
  {
    blockType: "iconGrid",
    blockName: "Demonstração — Grade de ícones",
    title: "Resuma informações em uma grade visual",
    description:
      "A variante compacta é adequada para listas curtas que precisam ser percorridas rapidamente.",
    variant: "compact",
    appearance: {
      tone: "default",
      spacing: "compact",
    },
    items: [
      {
        icon: mediaId,
        description: "Cada item exige uma descrição curta e objetiva.",
      },
      {
        icon: mediaId,
        description: "Os ícones são opcionais e vêm da Biblioteca de Mídia.",
      },
      {
        icon: mediaId,
        description: "Links opcionais podem encaminhar para informações relacionadas.",
      },
    ],
  },
  {
    blockType: "cta",
    blockName: "Demonstração — Chamada de ação",
    title: "Encerre a página indicando o próximo passo",
    description:
      "A Chamada de ação combina uma mensagem final com um destino obrigatório. Este exemplo usa o destaque institucional.",
    action: internalLink("Voltar ao início do catálogo", seedPageId),
    variant: "brand",
    appearance: {
      tone: "brand",
      spacing: "default",
    },
  },
];

export type AdminHelpBlockGuide = {
  fields: string[];
  name: string;
  purpose: string;
  useWhen: string;
  avoidWhen: string;
};

export type AdminHelpSection = {
  id: string;
  title: string;
  body: string[];
};

export const adminHelpSections: AdminHelpSection[] = [
  {
    id: "primeiros-passos",
    title: "Primeiros passos",
    body: [
      "O Admin serve para manter paginas, imagens, navegacao e configuracoes editoriais do portal para perfis como Editor e Admin.",
      "Antes de publicar, revise se o conteudo informa, orienta e encaminha para servicos oficiais sem prometer deferimento ou regularidade definitiva.",
      "Use rascunhos e preview para revisar a pagina antes de deixa-la publica.",
    ],
  },
  {
    id: "criando-pagina",
    title: "Criando uma pagina",
    body: [
      "Crie uma Page, preencha titulo e endereco da pagina, escolha os Blocks e salve como rascunho.",
      "Use home para a pagina inicial. Para paginas internas, prefira enderecos curtos com letras minusculas, numeros e hifens.",
      "Depois de montar a pagina, revise no Preview e publique somente quando o conteudo estiver validado.",
    ],
  },
  {
    id: "entendendo-blocks",
    title: "Entendendo Blocks",
    body: [
      "Blocks sao pecas prontas para compor paginas. Escolha o Block pela finalidade do conteudo, nao apenas pela aparencia.",
      "Uma pagina longa deve continuar compreensivel quando os Blocks estiverem recolhidos no editor.",
      "Se um conteudo nao encaixar em nenhum Block aprovado, registre a necessidade antes de improvisar.",
    ],
  },
  {
    id: "imagens",
    title: "Adicionando imagens",
    body: [
      "Cadastre imagens e documentos na area de Midias antes de usa-los em paginas.",
      "Preencha texto alternativo objetivo para imagens informativas.",
      "Use o campo de uso principal para indicar se a midia e conteudo, fundo, logo, icone, infografico ou documento.",
    ],
  },
  {
    id: "links",
    title: "Links internos e externos",
    body: [
      "Use links internos para outras paginas do portal quando o destino ja existir no CMS.",
      "Use links externos somente para servicos e canais oficiais confirmados.",
      "Revise o texto do link para que ele explique a acao ou o destino sem depender do contexto ao redor.",
    ],
  },
  {
    id: "estilos",
    title: "Estilos disponiveis",
    body: [
      "As opcoes visuais sao controladas pelo Design System. Escolha o modelo ou tom oferecido pelo Block no grupo Aparencia e estilo.",
      "Use Tom (tone) para definir enfase visual, Espacamento (spacing) para controlar o respiro vertical e Largura (width) para o conforto de leitura.",
      "Nao tente simular estilos com textos, imagens ou variacoes improvisadas.",
      "Se a identidade visual precisar mudar, a alteracao deve acontecer nos tokens e configuracoes aprovadas, nao em cada pagina.",
    ],
  },
  {
    id: "publicacao",
    title: "Draft, Preview, Publish e Unpublish",
    body: [
      "Draft e o rascunho salvo no Admin. Ele nao aparece para visitantes.",
      "Preview permite conferir a pagina antes da publicacao.",
      "Publish torna uma Page ativa e publicada visivel ao publico. Unpublish remove a publicacao e preserva o rascunho.",
    ],
  },
  {
    id: "desativacao",
    title: "Desativacao",
    body: [
      "Desativar remove uma Page do acesso publico sem apagar seu historico.",
      "Use Inativo quando a pagina nao deve ser encontrada por visitantes, mesmo que esteja publicada.",
      "Editor e Admin podem gerenciar conteudo, mas somente Admin altera o status de conteudo entre Ativo e Inativo.",
    ],
  },
  {
    id: "seo",
    title: "SEO",
    body: [
      "Preencha titulo e descricao de SEO quando eles precisarem ser diferentes do conteudo principal da pagina.",
      "Use imagem social quando houver uma imagem institucional adequada para compartilhamento.",
      "Use nao indexar apenas quando a pagina nao deve aparecer em buscadores.",
    ],
  },
  {
    id: "boas-praticas",
    title: "Boas praticas",
    body: [
      "Prefira textos curtos, objetivos e revisados por area responsavel.",
      "Nao publique datas, contatos, taxas, documentos ou links sem fonte oficial vigente.",
      "Evite duplicar paginas com o mesmo objetivo. Atualize conteudo existente quando fizer sentido.",
    ],
  },
];

export const adminHelpBlockGuides: AdminHelpBlockGuide[] = [
  {
    name: "Destaque principal",
    purpose: "Abrir uma pagina com titulo, resumo, imagem opcional e chamada principal.",
    fields: ["titulo", "descricao", "imagem", "acao", "modelo"],
    useWhen: "Use no inicio de paginas importantes.",
    avoidWhen: "Evite para avisos curtos ou listas de itens.",
  },
  {
    name: "Texto editorial",
    purpose: "Publicar texto corrido com headings, listas e links.",
    fields: ["conteudo", "largura de leitura"],
    useWhen: "Use para explicacoes, orientacoes e contexto institucional.",
    avoidWhen: "Evite para perguntas frequentes, chamadas finais ou cards repetidos.",
  },
  {
    name: "Midia e texto / imagem de destaque",
    purpose: "Combinar imagem e conteudo complementar em uma secao.",
    fields: ["titulo", "conteudo", "imagem", "posicao", "acao opcional"],
    useWhen: "Use quando imagem e texto precisam ser lidos juntos.",
    avoidWhen: "Evite para galerias ou imagens puramente decorativas.",
  },
  {
    name: "Cards e grades de beneficios",
    purpose: "Organizar itens repetidos com titulo, descricao, icone e link opcional.",
    fields: ["titulo", "itens", "modelo"],
    useWhen: "Use para beneficios, modalidades ou listas curtas equivalentes.",
    avoidWhen: "Evite quando a ordem dos passos for essencial.",
  },
  {
    name: "Chamada para acao",
    purpose: "Encerrar ou destacar uma acao principal.",
    fields: ["titulo", "descricao", "link", "modelo"],
    useWhen: "Use para orientar o proximo passo do usuario.",
    avoidWhen: "Evite para listas de muitas acoes.",
  },
  {
    name: "Grade de icones e informacoes",
    purpose: "Mostrar itens curtos com icones em formato compacto.",
    fields: ["titulo", "descricao", "itens", "icone", "link opcional"],
    useWhen: "Use para resumos e informacoes escaneaveis.",
    avoidWhen: "Evite para textos longos ou conteudo juridico complexo.",
  },
  {
    name: "Perguntas frequentes",
    purpose: "Organizar perguntas e respostas em lista expansivel.",
    fields: ["titulo", "perguntas", "respostas", "modelo"],
    useWhen: "Use quando o usuario chega com duvidas especificas.",
    avoidWhen: "Evite para conteudo que precisa ser lido em sequencia.",
  },
  {
    name: "Caixa de aviso",
    purpose: "Destacar alerta ou informacao importante.",
    fields: ["tipo", "titulo", "conteudo", "link opcional"],
    useWhen: "Use para atencao, aviso operacional ou informacao sensivel.",
    avoidWhen: "Evite para chamadas promocionais ou conteudo comum.",
  },
  {
    name: "Faixas de acao",
    purpose: "Exibir um conjunto de chamadas acionaveis.",
    fields: ["chamadas", "titulo", "descricao", "link", "tom visual"],
    useWhen: "Use quando houver mais de uma acao relacionada.",
    avoidWhen: "Evite quando houver apenas uma acao final simples.",
  },
];


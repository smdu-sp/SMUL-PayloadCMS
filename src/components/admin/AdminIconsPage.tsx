import Link from "next/link";
import { Icon } from "../ui/Icon";
import { STANDARD_ICONS, STANDARD_ICON_LABELS, type StandardIconName } from "../../domain/icons";
import { AdminHelpBackButton } from "./AdminHelpBackButton";

const ICON_GUIDES: Record<
  StandardIconName,
  {
    useWhen: string;
    examples: string;
  }
> = {
  info: {
    useWhen: "Notas explicativas, orientações ao munícipe e observações de etapas.",
    examples: "Informações sobre prazos de análise, documentação complementar necessária.",
  },
  warning: {
    useWhen: "Alertas de prazos legais, notificações de pendência ou advertências.",
    examples: "Aviso de encerramento de prazo para emenda de projeto, notificação de fiscalização.",
  },
  document: {
    useWhen: "Certidões, plantas aprovadas, alvarás, leis e termos de quitação.",
    examples: "Certidão de Regularidade, Auto de Conclusão, Alvará de Regularização.",
  },
  building: {
    useWhen: "Identificação de imóveis, obras, parâmetros construtivos e a SMUL.",
    examples: "Regularização de edificação residencial, parâmetros de recuo e taxa de ocupação.",
  },
  location: {
    useWhen: "Endereços de postos de atendimento, subprefeituras e Descomplica SP.",
    examples: "Posto de atendimento da SMUL no Edifício Martinelli, Praça de Atendimento.",
  },
  phone: {
    useWhen: "Canais telefônicos de atendimento ao cidadão e suporte técnico.",
    examples: "Central 156 da Prefeitura de São Paulo, agendamento de plantão técnico.",
  },
  email: {
    useWhen: "Endereços eletrônicos oficiais de secretarias e ouvidoria.",
    examples: "Fale com a SMUL, suporte ao licenciamento eletrônico.",
  },
  check: {
    useWhen: "Etapas cumpridas com sucesso, requisitos atendidos e deferimentos.",
    examples: "Documentação deferida, checklist de habite-se aprovado.",
  },
  arrow: {
    useWhen: "Indicação de fluxo sequencial, avançar etapas ou chamadas de ação.",
    examples: "Próxima etapa do passo a passo, seguir para o questionário.",
  },
  "external-link": {
    useWhen: "Links para portais externos oficiais da Prefeitura e governos.",
    examples: "Portal de Licenciamento (SLC), GeoSampa, Diário Oficial da Cidade.",
  },
};

const SIZES: { label: string; size: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"; px: string }[] = [
  { label: "Pequeno (sm)", size: "sm", px: "16px" },
  { label: "Médio (md)", size: "md", px: "20px" },
  { label: "Padrão (lg)", size: "lg", px: "24px" },
  { label: "Grande (xl)", size: "xl", px: "32px" },
  { label: "Extra Grande (2xl)", size: "2xl", px: "40px" },
  { label: "Destaque (3xl)", size: "3xl", px: "48px" },
];

const TONES: { label: string; tone: "primary" | "secondary" | "warning" | "success" | "muted" | "accent" | "danger"; token: string }[] = [
  { label: "Principal (primary)", tone: "primary", token: "#007a73 — Verde SMUL" },
  { label: "Institucional (secondary)", tone: "secondary", token: "#103b3f — Petróleo Escuro" },
  { label: "Atenção (warning)", tone: "warning", token: "#b86e00 — Âmbar Alerta" },
  { label: "Sucesso (success)", tone: "success", token: "#167c4a — Verde Deferimento" },
  { label: "Neutro / Suave (muted)", tone: "muted", token: "#5e7069 — Cinza Médio" },
  { label: "Destaque (accent)", tone: "accent", token: "#fff4cc — Dourado Suave" },
  { label: "Perigo (danger)", tone: "danger", token: "#b42318 — Vermelho Irregularidade" },
];

export function AdminIconsPage() {
  return (
    <main className="admin-help admin-icons-page">
      <div className="admin-help__topbar">
        <AdminHelpBackButton />
      </div>

      <header className="admin-help__header">
        <div className="admin-icons__header-row">
          <div>
            <p className="admin-help__eyebrow">Design System & Governança — SPEC-035</p>
            <h1>Catálogo de Ícones Padrão</h1>
            <p>
              Biblioteca visual consistente e segura para o portal <strong>Meu Imóvel Regular</strong>. Substitui uploads arbitrários de SVG por glifos padronizados com controle de tamanho, cor
              institucional e acessibilidade.
            </p>
          </div>
          <div className="admin-icons__header-actions">
            <Link className="admin-icons__btn-secondary" href="/icones" rel="noopener noreferrer" target="_blank">
              Ver vitrine pública (/icones) ↗
            </Link>
          </div>
        </div>
      </header>

      <nav aria-label="Navegação da biblioteca" className="admin-help__nav">
        <a href="#catalogo">Catálogo ({STANDARD_ICONS.length} ícones)</a>
        <a href="#tamanhos">Escalas de Tamanho</a>
        <a href="#tons">Tons Institucionais</a>
        <a href="#diretrizes">Diretrizes Editoriais</a>
      </nav>

      {/* Grid of Icons */}
      <section className="admin-help__section" id="catalogo">
        <h2>Catálogo de Ícones Oficiais</h2>
        <p className="admin-icons__section-intro">
          Selecione o identificador desejado nos blocos <code>Grade de Ícones (IconGrid)</code> ou <code>Cards</code>.
        </p>

        <div className="admin-icons__grid">
          {STANDARD_ICONS.map((name) => {
            const guide = ICON_GUIDES[name];
            return (
              <article className="admin-icons__card" key={name}>
                <div className="admin-icons__icon-wrapper">
                  <Icon name={name} size="2xl" tone="primary" />
                </div>
                <div className="admin-icons__content">
                  <div className="admin-icons__card-header">
                    <h3 className="admin-icons__name">{STANDARD_ICON_LABELS[name]}</h3>
                    <code className="admin-icons__code">{name}</code>
                  </div>
                  <p className="admin-icons__purpose">{guide.useWhen}</p>
                  <div className="admin-icons__example">
                    <span className="admin-icons__example-label">Exemplo:</span> {guide.examples}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Sizes Section */}
      <section className="admin-help__section" id="tamanhos">
        <h2>Escalas de Tamanho (Design Tokens)</h2>
        <p className="admin-icons__section-intro">Tamanhos predefinidos para manter proporção visual harmônica com a tipografia institucional.</p>
        <div className="admin-icons__tokens-grid">
          {SIZES.map(({ label, size, px }) => (
            <div className="admin-icons__token-card" key={size}>
              <div className="admin-icons__token-icon">
                <Icon name="building" size={size} tone="primary" />
              </div>
              <div className="admin-icons__token-info">
                <strong>{label}</strong>
                <span>{px}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tones Section */}
      <section className="admin-help__section" id="tons">
        <h2>Tons e Cores Institucionais</h2>
        <p className="admin-icons__section-intro">Cores controladas que herdam os valores de tokens da SMUL e Prefeitura de São Paulo.</p>
        <div className="admin-icons__tokens-grid">
          {TONES.map(({ label, tone, token }) => (
            <div className="admin-icons__token-card" key={tone}>
              <div className="admin-icons__token-icon">
                <Icon name="check" size="xl" tone={tone} />
              </div>
              <div className="admin-icons__token-info">
                <strong>{label}</strong>
                <span>{token}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="admin-help__section" id="diretrizes">
        <h2>Diretrizes de Uso para Editores (SPEC-035)</h2>
        <div className="admin-help__blocks">
          <article className="admin-help__block">
            <h3>Quando usar Ícone Padrão</h3>
            <p>Sempre que o objetivo for sinalizar visualmente um tipo de conteúdo, canal, etapa ou serviço. O catálogo cobre todas as necessidades de navegação e escaneabilidade do portal.</p>
          </article>
          <article className="admin-help__block">
            <h3>Quando usar Mídia Personalizada</h3>
            <p>Exclusivamente quando for necessário exibir um brasão oficial específico, selo comemorativo, logotipo de programa governamental ou marca registrada da Prefeitura de São Paulo.</p>
          </article>
          <article className="admin-help__block">
            <h3>Proibição de Código SVG Arbitrário</h3>
            <p>
              O sistema não permite colar código <code>&lt;svg&gt;</code> arbitrário no CMS. Isso protege o portal contra falhas de segurança (XSS), quebras de layout responsivo e inconsistência
              estilística.
            </p>
          </article>
          <article className="admin-help__block">
            <h3>Acessibilidade Automática</h3>
            <p>
              Ícones recebem <code>aria-hidden=&quot;true&quot;</code> automaticamente quando acompanhados de texto explicativo, evitando leitura redundante por leitores de tela.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import {
  Button,
  Card,
  Container,
  Heading,
  Icon,
  Section,
  Text,
  type IconSize,
  type IconTone,
} from "../../../components/ui";
import {
  STANDARD_ICONS,
  STANDARD_ICON_LABELS,
} from "../../../domain/icons";
import { IconGridBlock } from "../../../blocks/IconGrid/Component";
import { CardsBlock } from "../../../blocks/Cards/Component";

export const metadata = {
  title: "Catálogo de Ícones Padrão — SPEC-035",
  description:
    "Catálogo visual de ícones padronizados do portal Meu Imóvel Regular, em conformidade com o Design System e acessibilidade.",
};

const sizes: { label: string; size: IconSize }[] = [
  { label: "Pequeno (sm - 16px)", size: "sm" },
  { label: "Médio (md - 20px)", size: "md" },
  { label: "Padrão (lg - 24px)", size: "lg" },
  { label: "Grande (xl - 32px)", size: "xl" },
  { label: "Extra Grande (2xl - 40px)", size: "2xl" },
  { label: "Destaque (3xl - 48px)", size: "3xl" },
];

const tones: { label: string; tone: IconTone }[] = [
  { label: "Principal (primary)", tone: "primary" },
  { label: "Institucional (secondary)", tone: "secondary" },
  { label: "Atenção (warning)", tone: "warning" },
  { label: "Sucesso (success)", tone: "success" },
  { label: "Neutro / Suave (muted)", tone: "muted" },
  { label: "Destaque (accent)", tone: "accent" },
  { label: "Perigo (danger)", tone: "danger" },
];

export default function IconesPage() {
  return (
    <main className="min-h-screen">
      {/* Institutional Top Bar */}
      <div className="border-b border-border bg-surface-muted px-4 py-2 text-xs text-muted-foreground">
        <Container size="lg">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>Prefeitura da Cidade de São Paulo • SMUL • Meu Imóvel Regular</span>
            <Link
              className="font-medium text-primary hover:underline"
              href="/admin/icones"
            >
              Abrir no Painel do Editor (/admin/icones) →
            </Link>
          </div>
        </Container>
      </div>

      {/* Header Section */}
      <Section spacing="md" tone="brand">
        <Container size="lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                SPEC-035 — Design System & Maturidade Editorial
              </p>
              <div className="mt-2">
                <Heading level={1} size="display">
                  Catálogo de Ícones Padrão
                </Heading>
              </div>
              <div className="mt-4 max-w-container-sm">
                <Text tone="inverse" variant="lead">
                  Biblioteca visual controlada para garantir consistência, segurança,
                  acessibilidade e alinhamento aos tokens de design em todos os blocos do portal.
                </Text>
              </div>
            </div>
            <div>
              <Button href="/admin/icones" variant="secondary">
                Gerenciar no Admin
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Grid of Standard Icons */}
      <Section spacing="lg" tone="default">
        <Container size="lg">
          <Heading level={2} size="lg">
            Ícones Oficiais do Catálogo ({STANDARD_ICONS.length})
          </Heading>
          <Text variant="muted">
            Identificadores salvos no CMS e resolvidos no frontend via registro SVG.
          </Text>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {STANDARD_ICONS.map((name) => (
              <Card key={name} padding="md" tone="surface">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-surface-muted p-3">
                    <Icon name={name} size="2xl" tone="primary" />
                  </div>
                  <span className="mt-3 font-semibold text-foreground">
                    {STANDARD_ICON_LABELS[name]}
                  </span>
                  <code className="mt-1 rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    {name}
                  </code>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Demonstration of Sizes and Tones */}
      <Section spacing="md" tone="muted">
        <Container size="lg">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Sizes */}
            <div>
              <Heading level={2} size="md">
                Escalas de Tamanho (Design Tokens)
              </Heading>
              <div className="mt-4 space-y-3">
                {sizes.map(({ label, size }) => (
                  <div
                    className="flex items-center gap-4 rounded-md border border-border bg-surface p-3"
                    key={size}
                  >
                    <div className="flex w-14 items-center justify-center">
                      <Icon name="building" size={size} tone="primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tones */}
            <div>
              <Heading level={2} size="md">
                Tons e Cores do Sistema
              </Heading>
              <div className="mt-4 space-y-3">
                {tones.map(({ label, tone }) => (
                  <div
                    className="flex items-center gap-4 rounded-md border border-border bg-surface p-3"
                    key={tone}
                  >
                    <div className="flex w-14 items-center justify-center">
                      <Icon name="check" size="xl" tone={tone} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Real Block Demonstrations */}
      <Section spacing="lg" tone="default">
        <Container size="lg">
          <Heading level={2} size="lg">
            Demonstração em Blocos Reais
          </Heading>
          <Text variant="muted">
            Exemplos renderizados diretamente através dos componentes oficiais de blocos.
          </Text>
        </Container>
      </Section>

      {/* IconGridBlock Example */}
      <IconGridBlock
        blockType="iconGrid"
        description="A grade de ícones organiza informações curtas e escaneáveis com ícones padronizados."
        items={[
          {
            id: "demo-item-1",
            description: "Atendimento presencial com agendamento prévio.",
            iconSource: "standard",
            standardIcon: "location",
          },
          {
            id: "demo-item-2",
            description: "Certidões e documentação oficial para regularização.",
            iconSource: "standard",
            standardIcon: "document",
          },
          {
            id: "demo-item-3",
            description: "Informações sobre prazos legais e etapas do processo.",
            iconSource: "standard",
            standardIcon: "info",
          },
        ]}
        title="Grade de Ícones (IconGridBlock)"
        variant="default"
      />

      {/* CardsBlock Example */}
      <CardsBlock
        blockType="cards"
        description="Cards institucionais utilizando ícones padrão do catálogo visual."
        items={[
          {
            id: "demo-card-1",
            description:
              "Consulte a situação do imóvel e os parâmetros da legislação vigente.",
            mediaSource: "icon",
            standardIcon: "building",
            title: "Regularização de Imóveis",
          },
          {
            id: "demo-card-2",
            description:
              "Verifique pendências e notificações antes de submeter o pedido.",
            mediaSource: "icon",
            standardIcon: "warning",
            title: "Orientações e Alertas",
          },
          {
            id: "demo-card-3",
            description:
              "Entre em contato pelos canais oficiais da Prefeitura de São Paulo.",
            mediaSource: "icon",
            standardIcon: "phone",
            title: "Canais de Dúvidas",
          },
        ]}
        title="Cards com Ícones Padrão (CardsBlock)"
        variant="default"
      />
    </main>
  );
}

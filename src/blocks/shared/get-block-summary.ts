export type BlockSummaryData = {
  banners?: unknown[];
  blockType?: string;
  items?: unknown[];
  title?: string;
};

const blockLabels: Record<string, string> = {
  actionBanners: "Faixas de ação",
  alertBox: "Caixa de aviso",
  cards: "Cards e grades de benefícios",
  cta: "Chamada para ação",
  faqAccordion: "Perguntas frequentes",
  fullWidthImageBanner: "Banner de imagem full-width",
  hero: "Destaque principal",
  iconGrid: "Grade de ícones e informações",
  imageText: "Mídia e texto / imagem de destaque",
  richText: "Texto editorial",
};

const countLabels: Record<string, [string, string, keyof BlockSummaryData]> = {
  actionBanners: ["chamada", "chamadas", "banners"],
  cards: ["item", "itens", "items"],
  faqAccordion: ["pergunta", "perguntas", "items"],
  iconGrid: ["item", "itens", "items"],
};

export function getBlockSummary(data: BlockSummaryData, rowNumber = 0): string {
  const blockType = data.blockType ?? "";
  const label = blockLabels[blockType] ?? `Bloco ${rowNumber + 1}`;
  const parts = [label];

  if (typeof data.title === "string" && data.title.trim()) {
    parts.push(data.title.trim());
  }

  const countConfig = countLabels[blockType];
  if (countConfig) {
    const [singular, plural, field] = countConfig;
    const count = Array.isArray(data[field]) ? data[field].length : 0;
    if (count > 0) {
      parts.push(`${count} ${count === 1 ? singular : plural}`);
    }
  }

  return parts.join(" — ");
}

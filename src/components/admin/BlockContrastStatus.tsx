"use client";

import { useField, usePayloadAPI } from "@payloadcms/ui";
import type { UIFieldClientProps } from "payload";

import {
  analyzeCustomBlockPalette,
  type BlockContrastCheck,
  type EditorialColorOverrides,
} from "../../lib/theme/block-color-theme";
import { normalizeHexColor } from "../../lib/theme/colors";
import { resolveSemanticTheme, type PaletteInput } from "../../lib/theme/semantic-theme";

const tokenCopy = {
  foreground: {
    label: "Texto principal",
    pass: "Boa leitura sobre o fundo.",
    fail: "Será ajustado para melhorar a leitura.",
  },
  action: {
    label: "Ação e interatividade",
    pass: "Boa diferenciação do fundo.",
    fail: "Será ajustada para se destacar do fundo.",
  },
  accent: {
    label: "Detalhes de apoio",
    pass: "Boa identificação visual.",
    fail: "Serão ajustados para melhorar a identificação.",
  },
} as const;

const fieldLabels = {
  background: "Fundo principal",
  foreground: "Texto principal",
  brand: "Identidade institucional",
  action: "Ação e interatividade",
  accent: "Detalhes de apoio",
} as const;

type EditableColorToken = keyof EditorialColorOverrides;

const allEditableColorTokens = Object.keys(fieldLabels) as EditableColorToken[];

function asColor(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function ContrastRow({ check, rawValue }: { check: BlockContrastCheck; rawValue: string | null }) {
  const invalid = rawValue !== null && !normalizeHexColor(rawValue);
  const inherited = rawValue === null;
  const copy = tokenCopy[check.token];

  if (invalid) {
    return <li><strong>⚠ {copy.label}:</strong> cor inválida.</li>;
  }

  if (check.passes) {
    return (
      <li>
        <strong>✓ {copy.label}:</strong> {copy.pass}{inherited ? " Cor global." : ""}
      </li>
    );
  }

  return (
    <li>
      <strong>⚠ {copy.label}:</strong> {copy.fail}
    </li>
  );
}

type BlockContrastStatusProps = UIFieldClientProps & {
  visibleTokens?: EditableColorToken[];
};

export function BlockContrastStatus({
  path,
  visibleTokens = allEditableColorTokens,
}: BlockContrastStatusProps) {
  const appearancePath = path.replace(/\.contrastStatus$/, "");
  const background = useField<string | null>({ path: `${appearancePath}.colors.background` }).value;
  const foreground = useField<string | null>({ path: `${appearancePath}.colors.foreground` }).value;
  const brand = useField<string | null>({ path: `${appearancePath}.colors.brand` }).value;
  const action = useField<string | null>({ path: `${appearancePath}.colors.action` }).value;
  const accent = useField<string | null>({ path: `${appearancePath}.colors.accent` }).value;
  const [{ data, isError, isLoading }] = usePayloadAPI("/api/globals/site-settings", {
    initialParams: { depth: 0 },
  });

  const rawColors = { background, foreground, brand, action, accent };
  const overrides = Object.fromEntries(
    Object.entries(rawColors).map(([key, value]) => [key, asColor(value)]),
  ) as EditorialColorOverrides;
  const globalColors = (data as { theme?: { colors?: PaletteInput } } | null)?.theme?.colors;
  const analysis = analyzeCustomBlockPalette(resolveSemanticTheme(globalColors), overrides);
  const rawByToken = { foreground: asColor(foreground), action: asColor(action), accent: asColor(accent) };
  const visibleTokenSet = new Set(visibleTokens);
  // Keep feedback aligned with the controls that the current Block exposes.
  const visibleChecks = analysis.checks.filter((check) => visibleTokenSet.has(check.token));
  const invalidFields = Object.entries(rawColors)
    .filter((entry): entry is [keyof typeof fieldLabels, string] => asColor(entry[1]) !== null)
    .filter(([key]) => visibleTokenSet.has(key))
    .filter(([, value]) => !normalizeHexColor(value))
    .map(([key]) => fieldLabels[key]);
  const hasAutomaticReplacement = visibleChecks.some((check) => !check.passes);

  return (
    <section
      role="status"
      aria-live="polite"
      aria-label="Verificação de contraste do bloco"
      style={{
        background: "var(--theme-elevation-50)",
        border: "1px solid var(--theme-elevation-200)",
        borderRadius: "var(--style-radius-m)",
        marginTop: "calc(var(--base) * .5)",
        padding: "var(--base)",
      }}
    >
      <strong>Acessibilidade das cores</strong>
      {isLoading ? <p>Carregando a paleta global…</p> : null}
      {isError ? <p>⚠ Não foi possível carregar a paleta global. A análise usa os padrões institucionais.</p> : null}
      {!isLoading ? (
        <>
          {invalidFields.length ? (
            <p>
              <strong>Revise:</strong> {invalidFields.join(", ")}.
            </p>
          ) : hasAutomaticReplacement ? (
            <p>
              <strong>Ajuste automático:</strong> algumas cores serão corrigidas para manter a acessibilidade.
            </p>
          ) : (
            <p><strong>Tudo certo.</strong> Nenhum ajuste automático será necessário.</p>
          )}
          <ul style={{ marginBottom: 0, paddingLeft: "calc(var(--base) * 1.25)" }}>
            {visibleChecks.map((check) => (
              <ContrastRow key={check.token} check={check} rawValue={rawByToken[check.token]} />
            ))}
          </ul>
          {visibleTokenSet.has("brand") ? (
            <p style={{ marginBottom: 0 }}>
              ℹ O uso da Identidade institucional depende do conteúdo do bloco.
            </p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

export type GoogleFontInput = {
  bodyUrl?: unknown;
  headingUrl?: unknown;
};

export type ResolvedGoogleFont = {
  family: string;
  href: string;
};

export type ResolvedTypography = {
  body: ResolvedGoogleFont | null;
  heading: ResolvedGoogleFont | null;
};

const GOOGLE_FONTS_HOST = "fonts.googleapis.com";
const GOOGLE_FONTS_PATH = "/css2";
const FAMILY_NAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} .-]{0,79}$/u;

export function resolveGoogleFont(value: unknown): ResolvedGoogleFont | null {
  if (typeof value !== "string" || value.trim() === "") return null;

  try {
    const url = new URL(value.trim());
    const families = url.searchParams.getAll("family");

    if (
      url.protocol !== "https:" ||
      url.hostname !== GOOGLE_FONTS_HOST ||
      url.port !== "" ||
      url.username !== "" ||
      url.password !== "" ||
      url.pathname !== GOOGLE_FONTS_PATH ||
      url.hash !== "" ||
      families.length !== 1 ||
      url.searchParams.has("text")
    ) {
      return null;
    }

    const family = families[0]?.split(":", 1)[0]?.replaceAll("+", " ").trim();
    if (!family || !FAMILY_NAME_PATTERN.test(family)) return null;

    for (const key of url.searchParams.keys()) {
      if (key !== "family" && key !== "display") return null;
    }

    url.searchParams.set("display", "swap");

    return { family, href: url.toString() };
  } catch {
    return null;
  }
}

export function validateGoogleFontUrl(value: unknown): true | string {
  if (value == null || value === "") return true;

  return resolveGoogleFont(value)
    ? true
    : "Cole um link CSS v2 de uma unica familia do Google Fonts (https://fonts.googleapis.com/css2?family=...).";
}

export function resolveTypography(input?: GoogleFontInput | null): ResolvedTypography {
  return {
    body: resolveGoogleFont(input?.bodyUrl),
    heading: resolveGoogleFont(input?.headingUrl),
  };
}

export function getTypographyStylesheets(typography: ResolvedTypography): string[] {
  return [...new Set(
    [typography.body?.href, typography.heading?.href].filter(
      (href): href is string => typeof href === "string",
    ),
  )];
}

export function mapTypographyToCssVariables(
  typography: ResolvedTypography,
): Record<`--font-family-${string}`, string> {
  const variables: Record<`--font-family-${string}`, string> = {};
  const defaultSans = 'var(--font-lato), "Lato", Arial, sans-serif';

  if (typography.body) {
    const bodyStack = `"${typography.body.family}", ${defaultSans}`;
    variables["--font-family-sans"] = bodyStack;

    if (!typography.heading) {
      variables["--font-family-heading"] = bodyStack;
    }
  }

  if (typography.heading) {
    const headingFallback = typography.body
      ? `"${typography.body.family}", ${defaultSans}`
      : defaultSans;
    variables["--font-family-heading"] =
      `"${typography.heading.family}", ${headingFallback}`;
  }

  return variables;
}

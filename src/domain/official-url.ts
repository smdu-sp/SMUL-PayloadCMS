export function resolveOfficialHttpsUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function validateOfficialHttpsUrl(value: unknown): true | string {
  if (!value) return "Informe a URL oficial.";
  return resolveOfficialHttpsUrl(value)
    ? true
    : "Use uma URL oficial iniciada por https://.";
}

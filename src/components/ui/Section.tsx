import type { ReactNode } from "react";
import type { ColorScheme } from "../../lib/theme/block-color-theme";
import { ColorScope } from "./ColorScope";

const sectionSpacings = {
  compact: "py-10 sm:py-12", default: "py-14 sm:py-16", spacious: "py-20 sm:py-24",
  sm: "py-12", md: "py-14", lg: "py-16", xl: "py-24",
} as const;
export type SectionSpacing = keyof typeof sectionSpacings;
type SectionProps = { children: ReactNode; spacing?: SectionSpacing; scheme?: ColorScheme | "inherit" };

export function Section({ children, spacing = "md", scheme = "inherit" }: SectionProps) {
  return <ColorScope as="section" scheme={scheme} className={sectionSpacings[spacing]}>{children}</ColorScope>;
}

"use client";

import { createContext, useContext, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import {
  mapBlockColorThemeToCssVariables, resolveBlockColorTheme,
  type ColorScheme, type EditorialColorOverrides,
} from "../../lib/theme/block-color-theme";
import { resolveMediaTheme, resolveSemanticTheme, type GlobalSemanticTheme } from "../../lib/theme/semantic-theme";
import { classNames } from "./classNames";

const ThemeContext = createContext<GlobalSemanticTheme>(resolveSemanticTheme());

/** Receives only resolved, serializable colors; never imports Payload into the client. */
export function ThemeProvider({ theme, children }: { theme: GlobalSemanticTheme; children?: ReactNode }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

type ColorScopeProps = Omit<HTMLAttributes<HTMLElement>, "color" | "style"> & {
  as?: "div" | "section";
  scheme?: ColorScheme | "inherit";
  overrides?: EditorialColorOverrides | null;
  /** Media overlays publish roles without painting an opaque surface. */
  paint?: boolean;
};

export function ColorScope({
  as: Component = "div", scheme = "inherit", overrides, paint = true, className, children, ...props
}: ColorScopeProps) {
  const theme = useContext(ThemeContext);
  const style = scheme === "inherit" ? undefined : mapBlockColorThemeToCssVariables(
    resolveBlockColorTheme(theme, scheme, overrides),
  ) as CSSProperties;
  return (
    <Component
      {...props}
      data-color-scheme={scheme}
      className={classNames(
        "text-[var(--block-foreground)]",
        paint && scheme !== "inherit" && "bg-[var(--block-background)]",
        className,
      )}
      style={style}
    >
      {children}
    </Component>
  );
}

/** A media surface, not a new editorial scheme. Scrim opacity stays in presentation. */
export function MediaColorScope({ mode, ...props }: Omit<ColorScopeProps, "scheme" | "overrides"> & { mode: "dark" | "light" }) {
  return (
    <ThemeProvider theme={resolveMediaTheme(mode)}>
      <ColorScope {...props} scheme="default" />
    </ThemeProvider>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  ACCESSIBLE_PALETTES,
  ACCESSIBILITY_THEME_CSS,
  ACCESSIBILITY_THEME_STORAGE_KEY,
  accessibilityThemeOptions,
  normalizeAccessibilityThemeMode,
  type AccessibilityThemeMode,
} from "../../lib/theme/accessible-palettes";
import styles from "./AccessibilityThemeProvider.module.css";

type AccessibilityThemeContextValue = {
  mode: AccessibilityThemeMode;
  setMode: (mode: AccessibilityThemeMode) => void;
};

const AccessibilityThemeContext = createContext<AccessibilityThemeContextValue>({
  mode: "default",
  setMode: () => undefined,
});

const preferenceListeners = new Set<() => void>();
let sessionMode: AccessibilityThemeMode = "default";

function getStoredMode(): AccessibilityThemeMode {
  try {
    sessionMode = normalizeAccessibilityThemeMode(
      window.localStorage.getItem(ACCESSIBILITY_THEME_STORAGE_KEY),
    );
    return sessionMode;
  } catch {
    return sessionMode;
  }
}

function subscribeToPreference(listener: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === ACCESSIBILITY_THEME_STORAGE_KEY) listener();
  };

  preferenceListeners.add(listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    preferenceListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getDefaultMode(): AccessibilityThemeMode {
  return "default";
}

function applyMode(mode: AccessibilityThemeMode) {
  if (mode === "default") {
    document.documentElement.removeAttribute("data-accessibility-theme");
    return;
  }

  document.documentElement.dataset.accessibilityTheme = mode;
}

const optionDescriptions: Record<AccessibilityThemeMode, string> = {
  default: "Cores definidas pelo site",
  highContrast: "Máxima separação visual",
  colorBlind: "Cores distintas e seguras",
};

function AccessibilityIcon() {
  return (
    <svg aria-hidden="true" className={styles.icon} viewBox="0 0 24 24">
      <circle cx="12" cy="4" r="2.25" />
      <path d="M5 8.25c4.5 1.25 9.5 1.25 14 0M12 10v10M8.5 21l3.5-6 3.5 6" />
    </svg>
  );
}

export function AccessibilityThemeProvider({ children }: { children: ReactNode }) {
  const controlRef = useRef<HTMLDetailsElement>(null);
  const mode = useSyncExternalStore(
    subscribeToPreference,
    getStoredMode,
    getDefaultMode,
  );

  useLayoutEffect(() => {
    applyMode(mode);
  }, [mode]);

  const setMode = useCallback((nextMode: AccessibilityThemeMode) => {
    const safeMode = normalizeAccessibilityThemeMode(nextMode);
    sessionMode = safeMode;
    applyMode(safeMode);

    try {
      if (safeMode === "default") {
        window.localStorage.removeItem(ACCESSIBILITY_THEME_STORAGE_KEY);
      } else {
        window.localStorage.setItem(ACCESSIBILITY_THEME_STORAGE_KEY, safeMode);
      }
    } catch {
      // A preferência ainda vale para a sessão atual mesmo sem persistência.
    }

    preferenceListeners.forEach((listener) => listener());
  }, []);

  const handleSelect = (nextMode: AccessibilityThemeMode) => {
    setMode(nextMode);
    controlRef.current?.removeAttribute("open");
    controlRef.current?.querySelector("summary")?.focus();
  };

  const currentLabel =
    accessibilityThemeOptions.find((option) => option.value === mode)?.label ??
    "Padrão";

  return (
    <AccessibilityThemeContext.Provider value={{ mode, setMode }}>
      <style dangerouslySetInnerHTML={{ __html: ACCESSIBILITY_THEME_CSS }} />
      {children}
      <details className={styles.control} ref={controlRef}>
        <summary className={styles.trigger}>
          <span className={styles.iconFrame}>
            <AccessibilityIcon />
          </span>
          <span className={styles.triggerText}>
            <strong>Acessibilidade visual</strong>
            <small>{currentLabel}</small>
          </span>
          <svg aria-hidden="true" className={styles.chevron} viewBox="0 0 16 16">
            <path d="m4 6 4 4 4-4" />
          </svg>
        </summary>

        <div aria-label="Escolha uma paleta de cores" className={styles.panel} role="group">
          <header className={styles.panelHeader}>
            <strong>Paleta de cores</strong>
            <span>Escolha a melhor visualização para você.</span>
          </header>

          <div className={styles.options}>
            {accessibilityThemeOptions.map((option) => {
              const palette =
                option.value === "default"
                  ? ACCESSIBLE_PALETTES.light
                  : ACCESSIBLE_PALETTES[option.value];
              const active = option.value === mode;

              return (
                <button
                  aria-pressed={active}
                  className={`${styles.option} ${active ? styles.optionActive : ""}`}
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  type="button"
                >
                  <span aria-hidden="true" className={styles.swatches}>
                    <span style={{ backgroundColor: palette.background }} />
                    <span style={{ backgroundColor: palette.brand }} />
                    <span style={{ backgroundColor: palette.action }} />
                    <span style={{ backgroundColor: palette.accent }} />
                  </span>
                  <span className={styles.optionText}>
                    <strong>{option.label}</strong>
                    <small>{optionDescriptions[option.value]}</small>
                  </span>
                  <span aria-hidden="true" className={styles.check}>
                    ✓
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </details>
    </AccessibilityThemeContext.Provider>
  );
}

export function useAccessibilityTheme() {
  return useContext(AccessibilityThemeContext);
}

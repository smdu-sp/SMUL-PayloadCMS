"use client";

import { Button, useField, useForm } from "@payloadcms/ui";
import type { UIFieldClientProps } from "payload";
import { useState } from "react";

export function ThemeColorReset({ path, readOnly }: UIFieldClientProps) {
  const themePath = path.replace(/\.?resetThemeColors$/, "");
  const colorsPath = themePath ? `${themePath}.colors` : "colors";
  const background = useField<string | null>({ path: `${colorsPath}.background` });
  const foreground = useField<string | null>({ path: `${colorsPath}.foreground` });
  const brand = useField<string | null>({ path: `${colorsPath}.brand` });
  const action = useField<string | null>({ path: `${colorsPath}.action` });
  const accent = useField<string | null>({ path: `${colorsPath}.accent` });
  const { disabled } = useForm();
  const [reset, setReset] = useState(false);

  return (
    <div>
      <Button
        type="button"
        buttonStyle="secondary"
        disabled={readOnly || disabled}
        onClick={() => {
          background.setValue(null);
          foreground.setValue(null);
          brand.setValue(null);
          action.setValue(null);
          accent.setValue(null);
          setReset(true);
        }}
      >
        Reset - restaurar cores padrao SMUL
      </Button>
      <p role="status">
        {reset
          ? "Cores customizadas removidas do formulario. Salve as configuracoes para aplicar."
          : "Remove as cores customizadas e restaura os tokens padrao SMUL ao salvar."}
      </p>
    </div>
  );
}

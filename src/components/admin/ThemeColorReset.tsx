"use client";

import { Button, useField, useForm } from "@payloadcms/ui";
import type { UIFieldClientProps } from "payload";
import { useState } from "react";

export function ThemeColorReset({ readOnly }: UIFieldClientProps) {
  const background = useField<string | null>({ path: "theme.colors.background" });
  const foreground = useField<string | null>({ path: "theme.colors.foreground" });
  const brand = useField<string | null>({ path: "theme.colors.brand" });
  const action = useField<string | null>({ path: "theme.colors.action" });
  const accent = useField<string | null>({ path: "theme.colors.accent" });
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

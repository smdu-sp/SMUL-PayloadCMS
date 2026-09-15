"use client";

import { Button, useField, useForm } from "@payloadcms/ui";
import type { UIFieldClientProps } from "payload";
import { useState } from "react";

export function ThemeColorReset({ readOnly }: UIFieldClientProps) {
  const primary = useField<string | null>({ path: "branding.primaryColor" });
  const secondary = useField<string | null>({ path: "branding.secondaryColor" });
  const accent = useField<string | null>({ path: "branding.accentColor" });
  const { disabled } = useForm();
  const [reset, setReset] = useState(false);

  return (
    <div>
      <Button
        type="button"
        buttonStyle="secondary"
        disabled={readOnly || disabled}
        onClick={() => {
          primary.setValue(null);
          secondary.setValue(null);
          accent.setValue(null);
          setReset(true);
        }}
      >
        Reset — restaurar cores padrão SMUL
      </Button>
      <p role="status">
        {reset
          ? "Cores customizadas removidas do formulário. Salve as configurações para aplicar."
          : "Remove as três cores customizadas e restaura os tokens padrão SMUL ao salvar."}
      </p>
    </div>
  );
}

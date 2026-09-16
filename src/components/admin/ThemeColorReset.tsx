"use client";

import { Button, useField, useForm } from "@payloadcms/ui";
import type { UIFieldClientProps } from "payload";
import { useState } from "react";

export function ThemeColorReset({ readOnly }: UIFieldClientProps) {
  const primary = useField<string | null>({ path: "branding.primaryColor" });
  const secondary = useField<string | null>({ path: "branding.secondaryColor" });
  const accent = useField<string | null>({ path: "branding.accentColor" });
  const background = useField<string | null>({ path: "branding.backgroundColor" });
  const headline = useField<string | null>({ path: "branding.headlineColor" });
  const paragraph = useField<string | null>({ path: "branding.paragraphColor" });
  const button = useField<string | null>({ path: "branding.buttonColor" });
  const buttonText = useField<string | null>({ path: "branding.buttonTextColor" });
  const stroke = useField<string | null>({ path: "branding.strokeColor" });
  const main = useField<string | null>({ path: "branding.mainColor" });
  const secondaryIllustration = useField<string | null>({
    path: "branding.secondaryIllustrationColor",
  });
  const tertiary = useField<string | null>({ path: "branding.tertiaryColor" });
  const action = useField<string | null>({ path: "branding.actionColor" });
  const highlight = useField<string | null>({ path: "branding.highlightColor" });
  const actionForeground = useField<string | null>({
    path: "branding.actionForegroundColor",
  });
  const link = useField<string | null>({ path: "branding.linkColor" });
  const secondaryAccent = useField<string | null>({
    path: "branding.secondaryAccentColor",
  });
  const tertiaryAccent = useField<string | null>({
    path: "branding.tertiaryAccentColor",
  });
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
          background.setValue(null);
          headline.setValue(null);
          paragraph.setValue(null);
          button.setValue(null);
          buttonText.setValue(null);
          stroke.setValue(null);
          main.setValue(null);
          secondaryIllustration.setValue(null);
          tertiary.setValue(null);
          action.setValue(null);
          highlight.setValue(null);
          actionForeground.setValue(null);
          link.setValue(null);
          secondaryAccent.setValue(null);
          tertiaryAccent.setValue(null);
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

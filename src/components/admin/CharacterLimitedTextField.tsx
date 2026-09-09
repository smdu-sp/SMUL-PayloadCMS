"use client";

import { TextareaField, TextField, useField } from "@payloadcms/ui";
import { useEffect } from "react";
import type { TextareaFieldClientProps, TextFieldClientProps } from "payload";

type CharacterLimitedTextFieldProps = (TextareaFieldClientProps | TextFieldClientProps) & {
  inputType?: "text" | "textarea";
  maxLength: number;
};

export function CharacterLimitedTextField({
  field,
  inputType = "text",
  maxLength,
  path,
  ...props
}: CharacterLimitedTextFieldProps) {
  const { setValue, value } = useField<string>({ path });
  const text = typeof value === "string" ? value : "";
  const count = text.length;

  useEffect(() => {
    if (text.length > maxLength) {
      setValue(text.slice(0, maxLength));
    }
  }, [maxLength, setValue, text]);

  const fieldWithLimit = {
    ...field,
    maxLength,
  };

  return (
    <div>
      {inputType === "textarea" ? (
        <TextareaField
          {...(props as Omit<TextareaFieldClientProps, "field" | "path">)}
          field={fieldWithLimit as TextareaFieldClientProps["field"]}
          path={path}
        />
      ) : (
        <TextField
          {...(props as Omit<TextFieldClientProps, "field" | "path">)}
          field={fieldWithLimit as TextFieldClientProps["field"]}
          path={path}
        />
      )}
      <p
        aria-live="polite"
        style={{
          color: count >= maxLength ? "var(--theme-error-500)" : "var(--theme-elevation-500)",
          fontSize: "0.8125rem",
          margin: "0.25rem 0 0",
        }}
      >
        {count}/{maxLength} caracteres
      </p>
    </div>
  );
}

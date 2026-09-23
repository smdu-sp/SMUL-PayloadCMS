"use client";

import { useField } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import { useRef } from "react";

import { normalizeHexColor } from "../../lib/theme/colors";
import styles from "./HexColorPicker.module.css";

function toPickerColor(value: string | null): string {
  if (!value) return "#000000";
  if (value.length === 4) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  return value;
}

export function HexColorPicker({ path, readOnly }: TextFieldClientProps) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const { disabled, setValue, value } = useField<string | null>({ path });
  const color = normalizeHexColor(value);
  const isDisabled = readOnly || disabled;

  return (
    <>
      <button
        aria-label={color ? "Alterar cor" : "Escolher cor"}
        className={`${styles.swatch} ${color ? "" : styles.empty}`}
        disabled={isDisabled}
        onClick={() => pickerRef.current?.click()}
        style={color ? { backgroundColor: color } : undefined}
        title={color ? "Alterar cor" : "Escolher cor"}
        type="button"
      />
      <input
        aria-hidden="true"
        className={styles.picker}
        disabled={isDisabled}
        onChange={(event) => setValue(event.target.value)}
        ref={pickerRef}
        tabIndex={-1}
        type="color"
        value={toPickerColor(color)}
      />
    </>
  );
}

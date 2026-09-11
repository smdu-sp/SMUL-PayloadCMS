import type {
  Field,
  SelectFieldSingleValidation,
  UploadFieldSingleValidation,
} from "payload";
import {
  STANDARD_ICON_OPTIONS,
  isStandardIcon,
} from "../domain/icons.ts";
import { closedSelect } from "./editorial-validation.ts";

export type IconFieldsOptions = {
  allowNone?: boolean;
  defaultSource?: "custom" | "none" | "standard";
  required?: boolean;
};

export type IconSiblingData = {
  icon?: unknown;
  iconSource?: "custom" | "none" | "standard" | null;
  standardIcon?: string | null;
};

export const createIconFields = (options: IconFieldsOptions = {}): Field[] => {
  const { allowNone = false, defaultSource = "standard", required = false } = options;

  const sourceOptions = [
    ...(allowNone ? [{ label: "Sem ícone", value: "none" }] : []),
    { label: "Ícone padrão do catálogo", value: "standard" },
    { label: "Mídia personalizada", value: "custom" },
  ];

  const allowedSources = sourceOptions.map((opt) => opt.value);

  return [
    {
      name: "iconSource",
      type: "select",
      label: "Origem do ícone",
      defaultValue: defaultSource,
      required,
      validate: closedSelect(
        allowedSources,
        "Escolha uma origem de ícone aprovada.",
      ),
      admin: {
        description:
          "Escolha ícone padrão do catálogo visual ou mídia personalizada da biblioteca.",
      },
      options: sourceOptions,
    },
    {
      name: "standardIcon",
      type: "select",
      label: "Ícone padrão",
      defaultValue: "info",
      options: STANDARD_ICON_OPTIONS,
      admin: {
        condition: (_, siblingData) =>
          !siblingData?.iconSource || siblingData?.iconSource === "standard",
        description:
          "Selecione um ícone do catálogo central aprovado pelo Design System.",
      },
      validate: ((value, { siblingData }) => {
        const data = siblingData as IconSiblingData;
        const source = data?.iconSource ?? defaultSource;

        if (source === "standard") {
          if (required && !value) {
            return "Selecione um ícone padrão do catálogo.";
          }
          if (value && !isStandardIcon(value)) {
            return "Escolha um ícone padrão aprovado.";
          }
        }
        return true;
      }) satisfies SelectFieldSingleValidation,
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "media",
      label: "Mídia personalizada",
      admin: {
        condition: (_, siblingData) => siblingData?.iconSource === "custom",
        description:
          "Use apenas quando o catálogo padrão não atender à necessidade editorial.",
      },
      validate: ((value, { siblingData }) => {
        const data = siblingData as IconSiblingData;
        if (data?.iconSource === "custom" && required && !value) {
          return "Selecione uma mídia para o ícone personalizado.";
        }
        return true;
      }) satisfies UploadFieldSingleValidation,
    },
  ];
};

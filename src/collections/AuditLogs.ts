import type { CollectionConfig } from "payload";
import { auditLogsAdminOnly, denyAll } from "../access/roles.ts";

export const auditLogActionOptions = [
  { label: "Criacao", value: "create" },
  { label: "Atualizacao", value: "update" },
  { label: "Publicacao", value: "publish" },
  { label: "Despublicacao", value: "unpublish" },
  { label: "Desativacao", value: "deactivate" },
  { label: "Reativacao", value: "reactivate" },
  { label: "Edicao de imagem", value: "image-edit" },
] as const;

export const AuditLogs: CollectionConfig = {
  slug: "audit-logs",
  defaultSort: "-timestamp",
  disableBulkDelete: true,
  disableBulkEdit: true,
  disableDuplicate: true,
  access: {
    create: denyAll,
    read: auditLogsAdminOnly,
    update: denyAll,
    delete: denyAll,
  },
  labels: {
    singular: "Log de auditoria",
    plural: "Logs de auditoria",
  },
  admin: {
    defaultColumns: ["timestamp", "actorEmail", "action", "documentTitle"],
    description:
      "Consulte eventos editoriais registrados automaticamente. Logs nao devem ser editados ou criados manualmente.",
    group: "Governanca",
    listSearchableFields: ["actorEmail", "action", "collection", "documentTitle"],
    useAsTitle: "documentTitle",
  },
  fields: [
    {
      name: "timestamp",
      type: "date",
      label: "Data",
      index: true,
      required: true,
      admin: {
        date: {
          displayFormat: "dd/MM/yyyy HH:mm",
          pickerAppearance: "dayAndTime",
        },
        readOnly: true,
      },
    },
    {
      name: "actor",
      type: "relationship",
      relationTo: "users",
      label: "Usuario",
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "actorEmail",
      type: "email",
      label: "E-mail do usuario",
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "action",
      type: "select",
      label: "Acao",
      index: true,
      required: true,
      options: [...auditLogActionOptions],
      admin: {
        readOnly: true,
      },
    },
    {
      name: "collection",
      type: "text",
      label: "Collection",
      index: true,
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "documentId",
      type: "text",
      label: "ID do conteudo",
      index: true,
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "documentTitle",
      type: "text",
      label: "Pagina",
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "version",
      type: "text",
      label: "Versao",
      admin: {
        readOnly: true,
      },
    },
    {
      name: "changedFields",
      type: "array",
      label: "Campos alterados",
      admin: {
        initCollapsed: true,
        readOnly: true,
      },
      fields: [
        {
          name: "field",
          type: "text",
          label: "Campo",
          required: true,
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
};

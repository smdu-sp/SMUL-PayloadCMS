import { APIError, type CollectionBeforeDeleteHook, type CollectionConfig } from "payload";

import { adminOnly } from "../access/roles.ts";
import { createThemeFields } from "../fields/theme.ts";
import {
  revalidateSiteShellCollection,
} from "../lib/payload/revalidate-site-shell.ts";
import { getRelationshipId } from "../lib/theme/resolve-active-theme.ts";

export const preventDeletingActiveTheme: CollectionBeforeDeleteHook = async ({
  id,
  req,
}) => {
  const settings = await req.payload.findGlobal({
    slug: "site-settings",
    depth: 0,
    req,
  });

  if (String(getRelationshipId(settings.activeTheme)) === String(id)) {
    throw new APIError(
      "Este tema esta ativo. Selecione outro tema nas Configuracoes do site antes de exclui-lo.",
      409,
      null,
      true,
    );
  }
};

export const Themes: CollectionConfig = {
  slug: "themes",
  access: {
    create: adminOnly,
    read: () => true,
    update: adminOnly,
    delete: adminOnly,
  },
  labels: {
    singular: "Tema alternativo",
    plural: "Temas alternativos",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "updatedAt"],
    description:
      "Crie paletas e tipografias controladas pelo Design System. O tema aplicado ao portal e escolhido nas Configuracoes do site.",
  },
  hooks: {
    beforeDelete: [preventDeletingActiveTheme],
    afterChange: [revalidateSiteShellCollection],
    afterDelete: [revalidateSiteShellCollection],
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nome do tema",
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          "Nome editorial usado para identificar o tema nas configuracoes e, futuramente, nos Blocks.",
      },
    },
    ...createThemeFields(),
  ],
};

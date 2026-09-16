import fs from "node:fs/promises";
import type { Endpoint } from "payload";
import { canUseImageEditingCanvas } from "../../access/roles.ts";
import { applyImageCanvasOperations, resolveMediaPath, validateImageCanvasOperations } from "./image-editing-canvas.ts";

export const imageEditingCanvasEndpoint: Endpoint = {
  path: "/:id/image-canvas",
  method: "post",
  handler: async (req) => {
    if (!canUseImageEditingCanvas(req.user as { role?: "admin" | "editor" } | null)) {
      return Response.json({ message: "Sem permissao para usar o Canvas." }, { status: 403 });
    }
    const mediaId = req.routeParams?.id;
    const media = await req.payload.findByID({ collection: "media", id: String(mediaId), depth: 0 });
    if (!media.filename || media.mimeType?.startsWith("image/") !== true) {
      return Response.json({ message: "Apenas imagens podem ser editadas." }, { status: 400 });
    }
    try {
      const operations = validateImageCanvasOperations(req.data?.operations);
      const sourcePath = resolveMediaPath(media.filename);
      await fs.access(sourcePath);
      const { data, info } = await applyImageCanvasOperations(sourcePath, operations);
      const filename = `${media.filename.replace(/\.[^.]+$/, "")}-canvas-${Date.now()}.webp`;
      const derived = await req.payload.create({
        collection: "media",
        data: {
          alt: `${media.alt || "Imagem"} (derivada)`,
          caption: media.caption,
          sourceMedia: media.id,
          usage: media.usage,
          canvasOperations: operations,
        },
        file: { data, mimetype: info.format === "webp" ? "image/webp" : media.mimeType, name: filename, size: data.length },
        req,
      });
      await req.payload.create({
        collection: "audit-logs",
        data: {
          action: "image-edit",
          actor: req.user?.id,
          actorEmail: req.user?.email,
          changedFields: [{ field: "canvasOperations" }],
          collection: "media",
          documentId: String(derived.id),
          documentTitle: String(derived.alt || filename),
          timestamp: new Date().toISOString(),
          version: `source:${String(media.id)}`,
        },
        overrideAccess: true,
        req,
      });
      return Response.json({ doc: derived }, { status: 201 });
    } catch (error) {
      return Response.json({ message: error instanceof Error ? error.message : "Nao foi possivel gerar a derivada." }, { status: 400 });
    }
  },
};
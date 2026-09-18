import fs from "node:fs/promises";
import { addDataAndFileToRequest, type Endpoint } from "payload";
import { imageEditingCanvasAdminOnly } from "../../access/roles.ts";
import {
  processImageTransform,
  resolveMediaPath,
  validateCanvasTransformPayload,
} from "./image-editing-canvas.ts";

export const imageEditingCanvasEndpoint: Endpoint = {
  path: "/edit-canvas",
  method: "post",
  handler: async (req) => {
    if (!(await imageEditingCanvasAdminOnly({ req }))) {
      return Response.json({ message: "Sem permissao para usar o Canvas." }, { status: 403 });
    }
    try {
      await addDataAndFileToRequest(req);
      const transform = validateCanvasTransformPayload(req.data);
      const original = await req.payload.findByID({
        collection: "media",
        id: transform.originalMediaId,
        depth: 0,
      });
      if (!original.filename || original.mimeType?.startsWith("image/") !== true) {
        return Response.json({ message: "Apenas imagens podem ser editadas." }, { status: 400 });
      }

      const altText = transform.altText?.trim();
      const normalizedAltText = altText ? altText : original.alt?.trim() || "";

      const sourcePath = resolveMediaPath(original.filename);
      await fs.access(sourcePath);
      const inputBuffer = await fs.readFile(sourcePath);
      const { buffer, metrics } = await processImageTransform(inputBuffer, transform);
      const fileName = original.filename;
      const updated = await req.payload.update({
        collection: "media",
        id: original.id,
        data: {
          alt: normalizedAltText || original.alt || "",
          caption: original.caption,
          usage: original.usage,
          focalPoint: transform.focalPoint,
          editingMetadata: {
            crop: transform.crop,
            resize: transform.resize,
            rotate: transform.rotate,
            aspectRatio: transform.aspectRatio,
            metrics,
          },
        },
        file: { data: buffer, mimetype: "image/webp", name: fileName, size: buffer.length },
        req,
      });
      await req.payload.create({
        collection: "audit-logs",
        data: {
          action: "image-edit",
          actor: req.user?.id,
          actorEmail: req.user?.email,
          changedFields: [{ field: "editingMetadata" }, { field: "alt" }],
          collection: "media",
          documentId: String(updated.id),
          documentTitle: String(updated.alt || fileName),
          timestamp: new Date().toISOString(),
          version: `source:${String(original.id)}`,
        },
        overrideAccess: true,
        req,
      });
      return Response.json({ doc: updated }, { status: 200 });
    } catch (error) {
      return Response.json({ message: error instanceof Error ? error.message : "Nao foi possivel gerar a derivada." }, { status: 400 });
    }
  },
};
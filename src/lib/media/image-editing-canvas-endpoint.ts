import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
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
      const { buffer, metrics, focalPoint } = await processImageTransform(inputBuffer, transform);
      const originalName = path.parse(path.basename(original.filename)).name;
      const fileName = `${originalName}_crop_${Date.now()}_${randomUUID().slice(0, 8)}.webp`;
      const derived = await req.payload.create({
        collection: "media",
        data: {
          alt: normalizedAltText || original.alt || "",
          caption: original.caption,
          usage: original.usage,
          isDerived: true,
          parentMedia: original.id,
          focalPoint,
          focalX: focalPoint.x,
          focalY: focalPoint.y,
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
          documentId: String(derived.id),
          documentTitle: String(derived.alt || fileName),
          timestamp: new Date().toISOString(),
          version: `source:${String(original.id)}`,
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
import fs from "node:fs/promises";
import { addDataAndFileToRequest, type Endpoint } from "payload";
import { imageEditingCanvasAdminOnly } from "../../access/roles.ts";
import {
  processImageTransform,
  normalizeAltText,
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
      if (!altText) {
        return Response.json(
          { message: "Informe o texto alternativo da imagem derivada." },
          { status: 400 },
        );
      }
      const normalizedAltText = normalizeAltText(altText);
      let page = 1;
      let duplicatedAltText = false;
      let totalPages = 1;
      while (page <= totalPages && !duplicatedAltText) {
        const mediaWithAltText = await req.payload.find({
          collection: "media",
          depth: 0,
          limit: 100,
          page,
          where: { alt: { exists: true } },
        });
        duplicatedAltText = mediaWithAltText.docs.some(
          (media) => typeof media.alt === "string" && normalizeAltText(media.alt) === normalizedAltText,
        );
        totalPages = mediaWithAltText.totalPages;
        page += 1;
      }
      if (duplicatedAltText) {
        return Response.json(
          { message: "Já existe uma mídia com esse texto alternativo. Informe uma descrição diferente." },
          { status: 409 },
        );
      }

      const sourcePath = resolveMediaPath(original.filename);
      await fs.access(sourcePath);
      const inputBuffer = await fs.readFile(sourcePath);
      const { buffer, metrics } = await processImageTransform(inputBuffer, transform);
      const fileName = `${original.filename.replace(/\.[^.]+$/, "")}-canvas-${Date.now()}.webp`;
      const derived = await req.payload.create({
        collection: "media",
        data: {
          alt: altText,
          caption: original.caption,
          usage: original.usage,
          parentMedia: original.id,
          isDerived: true,
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
          changedFields: [{ field: "editingMetadata" }],
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
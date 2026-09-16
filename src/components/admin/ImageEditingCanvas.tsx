"use client";

import { useState } from "react";
import { useDocumentInfo } from "@payloadcms/ui";

type Props = { data?: { filename?: string; url?: string; mimeType?: string } };

export function ImageEditingCanvas({ data }: Props) {
  const { id, data: documentData } = useDocumentInfo();
  const media = data ?? (documentData as Props["data"] | undefined);
  const [rotate, setRotate] = useState<0 | 90 | 180 | 270>(0);
  const [width, setWidth] = useState(1200);
  const [aspectRatio, setAspectRatio] = useState<"original" | "1:1" | "4:3" | "16:9" | "portrait" | "free">("original");
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 1000, height: 1000 });
  const [focalPoint, setFocalPoint] = useState({ x: 50, y: 50 });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  if (media?.mimeType && !media.mimeType.startsWith("image/")) return null;

  async function createDerived() {
    setBusy(true);
    setMessage("");
    const response = await fetch(`/api/media/${String(id)}/image-canvas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operations: { rotate, resize: { width }, aspectRatio, crop, focalPoint } }),
    });
    const result = (await response.json()) as { message?: string; doc?: { id?: string | number } };
    setMessage(response.ok ? `Derivada criada: ${String(result.doc?.id ?? "")}` : result.message ?? "Falha ao criar derivada.");
    setBusy(false);
  }

  return <section style={{ borderTop: "1px solid var(--theme-elevation-150)", marginTop: "2rem", paddingTop: "1rem" }}>
    <h2>Canvas de imagem</h2>
    {media?.url ? <img alt="Preview da imagem original" src={media.url} style={{ maxWidth: "100%", maxHeight: 360, objectFit: "contain", objectPosition: `${focalPoint.x}% ${focalPoint.y}%`, aspectRatio: aspectRatio === "1:1" ? "1" : aspectRatio === "4:3" ? "4 / 3" : aspectRatio === "16:9" ? "16 / 9" : aspectRatio === "portrait" ? "3 / 4" : undefined, transform: `rotate(${rotate}deg)` }} /> : null}
    <div style={{ display: "flex", gap: "1rem", alignItems: "end", flexWrap: "wrap", marginTop: "1rem" }}>
      <label>Rotacao<select value={rotate} onChange={(event) => setRotate(Number(event.target.value) as 0 | 90 | 180 | 270)}><option value={0}>0 graus</option><option value={90}>90 graus</option><option value={180}>180 graus</option><option value={270}>270 graus</option></select></label>
      <label>Largura<select value={width} onChange={(event) => setWidth(Number(event.target.value))}><option value={640}>640 px</option><option value={1200}>1200 px</option><option value={1920}>1920 px</option></select></label>
      <label>Proporcao<select value={aspectRatio} onChange={(event) => setAspectRatio(event.target.value as typeof aspectRatio)}><option value="original">Original</option><option value="1:1">1:1</option><option value="4:3">4:3</option><option value="16:9">16:9</option><option value="portrait">Retrato</option><option value="free">Livre</option></select></label>
      <label>Corte X<input type="number" min={0} value={crop.x} onChange={(event) => setCrop({ ...crop, x: Number(event.target.value) })} /></label>
      <label>Corte Y<input type="number" min={0} value={crop.y} onChange={(event) => setCrop({ ...crop, y: Number(event.target.value) })} /></label>
      <label>Largura do corte<input type="number" min={1} value={crop.width} onChange={(event) => setCrop({ ...crop, width: Number(event.target.value) })} /></label>
      <label>Altura do corte<input type="number" min={1} value={crop.height} onChange={(event) => setCrop({ ...crop, height: Number(event.target.value) })} /></label>
      <label>Foco X (%)<input type="number" min={0} max={100} value={focalPoint.x} onChange={(event) => setFocalPoint({ ...focalPoint, x: Number(event.target.value) })} /></label>
      <label>Foco Y (%)<input type="number" min={0} max={100} value={focalPoint.y} onChange={(event) => setFocalPoint({ ...focalPoint, y: Number(event.target.value) })} /></label>
      <button type="button" onClick={createDerived} disabled={busy}>{busy ? "Gerando..." : "Criar derivada"}</button>
    </div>
    {message ? <p role="status">{message}</p> : null}
    <p>O arquivo original permanece preservado. Cada operacao cria uma nova midia.</p>
  </section>;
}
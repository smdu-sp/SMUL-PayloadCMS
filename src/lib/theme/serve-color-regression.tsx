import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import { renderToStaticMarkup } from "react-dom/server";
import { ColorRegressionFixture } from "./color-regression.fixture";

const stylesheet = new URL("../../app/(frontend)/globals.css", import.meta.url);
const css = await postcss([tailwindcss()]).process(await readFile(stylesheet, "utf8"), {
  from: fileURLToPath(stylesheet),
});
const server = createServer((req, res) => {
  const palette = req.url?.includes("institutional") ? "institutional" : "alternative";
  const markup = renderToStaticMarkup(<ColorRegressionFixture palette={palette} />);
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`<!doctype html><html lang="pt-BR"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Regressao de scopes</title><style>${css.css}</style></head><body>${markup}</body></html>`);
});
server.listen(4318, "127.0.0.1", () => {
  console.log("Color regression: http://127.0.0.1:4318/ (alternative), /?institutional (SMUL). No CMS/database access.");
});

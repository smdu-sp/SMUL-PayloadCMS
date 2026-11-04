import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { translateTableMenuItem } from "./table-menu-pt";
import { RichTextBlock } from "./config";

describe("Portuguese table action menu", () => {
  it("translates static editing actions and leaves unknown controls untouched", () => {
    assert.equal(translateTableMenuItem("table-merge-cells", "Merge cells"), "Mesclar células");
    assert.equal(translateTableMenuItem("table-delete", "Delete table"), "Excluir tabela");
    assert.equal(translateTableMenuItem("unknown", "Other"), null);
  });

  it("translates row and column counts and header toggles", () => {
    assert.equal(translateTableMenuItem("table-insert-row-above", "Insert row above"), "Inserir linha acima");
    assert.equal(translateTableMenuItem("table-insert-row-below", "Insert 3 rows below"), "Inserir 3 linhas abaixo");
    assert.equal(translateTableMenuItem("table-insert-column-before", "Insert 2 columns left"), "Inserir 2 colunas à esquerda");
    assert.equal(translateTableMenuItem("table-row-header", "Add row header"), "Adicionar cabeçalho da linha");
    assert.equal(translateTableMenuItem("table-column-header", "Remove column header"), "Remover cabeçalho da coluna");
  });

  it("registers the isolated translator on the editorial field", () => {
    const content = RichTextBlock.fields.find((field) => "name" in field && field.name === "content");
    assert.ok(content && content.type === "richText");
    assert.ok(content.admin?.components?.beforeInput?.includes(
      "/components/admin/RichTextTableMenuPortuguese#RichTextTableMenuPortuguese",
    ));
  });
});

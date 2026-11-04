const staticLabels: Record<string, string> = {
  "table-merge-cells": "Mesclar células",
  "table-unmerge-cells": "Separar células",
  "table-row-striping": "Alternar listras nas linhas",
  "table-freeze-first-column": "Fixar ou soltar a primeira coluna",
  "table-delete-columns": "Excluir coluna",
  "table-delete-rows": "Excluir linha",
  "table-delete": "Excluir tabela",
};

export function translateTableMenuItem(id: string, label: string): string | null {
  if (staticLabels[id]) return staticLabels[id];

  const insert = label.match(/^Insert (\d+ rows?|rows?|\d+ columns?|columns?) (above|below|left|right)$/);
  if (insert && id.startsWith("table-insert-")) {
    const count = insert[1].match(/^\d+/)?.[0];
    const isRow = insert[1].includes("row");
    const noun = isRow ? (count && count !== "1" ? "linhas" : "linha")
      : (count && count !== "1" ? "colunas" : "coluna");
    const direction = { above: "acima", below: "abaixo", left: "à esquerda", right: "à direita" }[insert[2]];
    return `Inserir ${count ? `${count} ` : ""}${noun} ${direction}`;
  }

  const header = label.match(/^(Add|Remove) (row|column) header$/);
  if (header && (id === "table-row-header" || id === "table-column-header")) {
    const action = header[1] === "Add" ? "Adicionar" : "Remover";
    return `${action} cabeçalho ${header[2] === "row" ? "da linha" : "da coluna"}`;
  }

  return null;
}

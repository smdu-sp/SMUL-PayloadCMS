"use client";

import { useEffect } from "react";
import { translateTableMenuItem } from "../../blocks/RichText/table-menu-pt";

/** The experimental Payload table menu currently ships English strings in its client bundle. */
export function RichTextTableMenuPortuguese() {
  useEffect(() => {
    const replaceText = (element: Element, translated: string) => {
      if (element.textContent === translated) return;
      // Keep React-owned nodes in place so experimental controls can rerender.
      const textNodes = Array.from(element.childNodes).filter(
        (node) => node.nodeType === Node.TEXT_NODE,
      );
      if (!textNodes.length) return;
      textNodes[0].textContent = translated;
      textNodes.slice(1).forEach((node) => { node.textContent = ""; });
    };

    const translate = () => {
      document.querySelectorAll<HTMLButtonElement>(
        ".table-action-menu-dropdown button[data-test-id]",
      ).forEach((button) => {
        const label = button.querySelector(".text");
        if (!label) return;
        const translated = translateTableMenuItem(button.dataset.testId ?? "", label.textContent ?? "");
        if (translated) replaceText(label, translated);
      });

      document.querySelectorAll<HTMLElement>(".drawer__header__title").forEach((title) => {
        if (title.textContent !== "Create Table" && title.textContent !== "Criar tabela") return;
        const drawer = title.closest(".drawer");
        if (!drawer) return;
        drawer.querySelectorAll("label").forEach((label) => {
          const current = label.textContent?.trim().toLowerCase();
          if (current && /^rows\s*\*?$/.test(current)) replaceText(label, "Linhas");
          if (current && /^columns\s*\*?$/.test(current)) replaceText(label, "Colunas");
        });
        replaceText(title, "Criar tabela");
      });
    };

    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      queueMicrotask(() => {
        queued = false;
        translate();
      });
    });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    translate();
    return () => observer.disconnect();
  }, []);

  return null;
}

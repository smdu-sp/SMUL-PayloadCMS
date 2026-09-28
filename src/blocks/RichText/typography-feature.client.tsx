"use client";

import { createClientFeature } from "@payloadcms/richtext-lexical/client";
import {
  $getNodeByKey,
  $getState,
  $setState,
  createState,
  TextNode,
  type LexicalEditor,
  type StateConfig,
} from "@payloadcms/richtext-lexical/lexical";
import { useLexicalComposerContext } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext";
import { $forEachSelectedTextNode } from "@payloadcms/richtext-lexical/lexical/selection";
import { useEffect } from "react";
import { richTextFontFamilies } from "./font-family";
import { richTextFontSizes } from "./font-size";

type StateValues = Record<
  string,
  {
    css: Record<string, string>;
    label: string;
  }
>;

type StateMap = Map<
  string,
  {
    stateConfig: StateConfig<string, string | undefined>;
    stateValues: StateValues;
  }
>;

const typographyStates = {
  fontFamily: richTextFontFamilies,
  fontSize: richTextFontSizes,
} satisfies Record<string, StateValues>;

function registerTypographyStates(): StateMap {
  const stateMap: StateMap = new Map();

  for (const [stateKey, stateValues] of Object.entries(typographyStates)) {
    const stateConfig = createState(stateKey, {
      parse: (value) =>
        typeof value === "string" && value in stateValues ? value : undefined,
    });

    stateMap.set(stateKey, { stateConfig, stateValues });
  }

  return stateMap;
}

function setTypographyState(
  editor: LexicalEditor,
  stateMap: StateMap,
  stateKey: keyof typeof typographyStates,
  value: string | undefined,
) {
  editor.update(() => {
    const state = stateMap.get(stateKey);
    if (!state) return;

    $forEachSelectedTextNode((textNode) => {
      $setState(textNode, state.stateConfig, value);
    });
  });
}

function TypographyStatePlugin({ stateMap }: { stateMap: StateMap }) {
  const [editor] = useLexicalComposerContext();

  useEffect(
    () =>
      editor.registerMutationListener(TextNode, (mutatedNodes) => {
        editor.getEditorState().read(() => {
          for (const [nodeKey, mutation] of mutatedNodes) {
            if (mutation === "destroyed") continue;

            const node = $getNodeByKey(nodeKey);
            const element = editor.getElementByKey(nodeKey);
            if (!node || !element) continue;

            const styles: Record<string, string> = {};

            stateMap.forEach(({ stateConfig, stateValues }, stateKey) => {
              const stateValue = $getState(node, stateConfig);

              if (!stateValue) {
                delete element.dataset[stateKey];
                return;
              }

              element.dataset[stateKey] = stateValue;
              Object.assign(styles, stateValues[stateValue]?.css);
            });

            element.style.cssText = "";
            Object.assign(element.style, styles);
          }
        });
      }),
    [editor, stateMap],
  );

  return null;
}

function FontFamilyIcon() {
  return (
    <span aria-hidden="true" style={{ fontFamily: "Georgia, serif", fontSize: 13 }}>
      Aa
    </span>
  );
}

function FontSizeIcon() {
  return (
    <span aria-hidden="true" style={{ fontSize: 12, fontWeight: 700 }}>
      A↕
    </span>
  );
}

const createFontFamilyItems = (stateMap: StateMap) => [
  {
    ChildComponent: FontFamilyIcon,
    key: "font-family-default",
    label: "Fonte padrão",
    onSelect: ({ editor }: { editor: LexicalEditor }) =>
      setTypographyState(editor, stateMap, "fontFamily", undefined),
    order: 1,
  },
  ...Object.entries(richTextFontFamilies).map(([value, meta], index) => ({
    ChildComponent: () => (
      <span aria-hidden="true" style={{ fontFamily: meta.css["font-family"] }}>
        Aa
      </span>
    ),
    key: `font-family-${value}`,
    label: meta.label,
    onSelect: ({ editor }: { editor: LexicalEditor }) =>
      setTypographyState(editor, stateMap, "fontFamily", value),
    order: index + 2,
  })),
];

const createFontSizeItems = (stateMap: StateMap) => [
  {
    ChildComponent: FontSizeIcon,
    key: "font-size-default",
    label: "Tamanho padrão",
    onSelect: ({ editor }: { editor: LexicalEditor }) =>
      setTypographyState(editor, stateMap, "fontSize", undefined),
    order: 1,
  },
  ...Object.entries(richTextFontSizes).map(([value, meta], index) => ({
    ChildComponent: () => (
      <span aria-hidden="true" style={{ fontSize: meta.css["font-size"] }}>
        A
      </span>
    ),
    key: `font-size-${value}`,
    label: meta.label,
    onSelect: ({ editor }: { editor: LexicalEditor }) =>
      setTypographyState(editor, stateMap, "fontSize", value),
    order: index + 2,
  })),
];

export const RichTextTypographyFeatureClient = createClientFeature(() => {
  const stateMap = registerTypographyStates();
  const groups = [
    {
      type: "dropdown" as const,
      ChildComponent: FontFamilyIcon,
      items: createFontFamilyItems(stateMap),
      key: "fontFamily",
      order: 30,
    },
    {
      type: "dropdown" as const,
      ChildComponent: FontSizeIcon,
      items: createFontSizeItems(stateMap),
      key: "fontSize",
      order: 31,
    },
  ];

  return {
    plugins: [
      {
        Component: () => <TypographyStatePlugin stateMap={stateMap} />,
        position: "normal",
      },
    ],
    toolbarFixed: { groups },
    toolbarInline: { groups },
  };
});

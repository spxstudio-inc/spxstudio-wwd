import { useEffect, useRef } from "react";
import { basicSetup } from "codemirror";
import { EditorView, keymap, ViewUpdate } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorState, Compartment } from "@codemirror/state";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  language: "html" | "css" | "javascript";
}

export default function Editor({ value, onChange, language }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const languageCompartment = useRef(new Compartment());

  useEffect(() => {
    if (!editorRef.current) return;

    // Cleanup previous editor if it exists
    if (editorViewRef.current) {
      editorViewRef.current.destroy();
    }

    const languageExtension = (() => {
      switch (language) {
        case "html":
          return html();
        case "css":
          return css();
        case "javascript":
          return javascript();
        default:
          return javascript();
      }
    })();

    const startState = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        oneDark,
        languageCompartment.current.of(languageExtension),
        EditorView.updateListener.of((update: ViewUpdate) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "14px",
          },
          ".cm-scroller": {
            overflow: "auto",
            fontFamily: "JetBrains Mono, monospace",
          },
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    editorViewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [language]);

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorViewRef.current) {
      const currentValue = editorViewRef.current.state.doc.toString();
      if (value !== currentValue) {
        editorViewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value,
          },
        });
      }
    }
  }, [value]);

  return <div ref={editorRef} className="h-full" />;
}

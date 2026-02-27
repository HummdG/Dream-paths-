"use client";

import { useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-python";

interface HighlightedEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  readOnly?: boolean;
  height?: string;
}

export function HighlightedEditor({
  value,
  onValueChange,
  onKeyDown,
  readOnly = false,
  height = "200px",
}: HighlightedEditorProps) {
  // Dynamically import Prism theme to avoid SSR issues
  useEffect(() => {
    // Use a dark theme that works well with slate-900
  }, []);

  return (
    <div
      className="w-full overflow-auto bg-slate-900"
      style={{ height, minHeight: height }}
      onKeyDown={onKeyDown as React.KeyboardEventHandler<HTMLDivElement>}
    >
      <Editor
        value={value}
        onValueChange={readOnly ? () => {} : onValueChange}
        highlight={(code: string) => highlight(code, languages.python, "python")}
        padding={16}
        readOnly={readOnly}
        style={{
          fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace',
          fontSize: 13,
          lineHeight: 1.6,
          minHeight: height,
          outline: "none",
          caretColor: "#fbbf24",
        }}
        className="prism-editor"
        tabSize={4}
        insertSpaces
      />

      <style>{`
        .prism-editor textarea {
          outline: none !important;
          background: transparent !important;
        }
        .prism-editor pre {
          background: transparent !important;
        }
        /* Selection colour — must be visible on the dark slate-900 background */
        .prism-editor textarea::selection {
          background: rgba(139, 92, 246, 0.55) !important;
          color: #ffffff !important;
        }
        .prism-editor textarea::-moz-selection {
          background: rgba(139, 92, 246, 0.55) !important;
          color: #ffffff !important;
        }
        /* Python token colours */
        .token.keyword { color: #c792ea; font-weight: bold; }
        .token.builtin { color: #82aaff; }
        .token.string { color: #c3e88d; }
        .token.comment { color: #546e7a; font-style: italic; }
        .token.number { color: #f78c6c; }
        .token.operator { color: #89ddff; }
        .token.punctuation { color: #89ddff; }
        .token.function { color: #82aaff; }
        .token.boolean { color: #ff5874; }
        /* Default text colour */
        .prism-editor { color: #e0e0e0; }
      `}</style>
    </div>
  );
}

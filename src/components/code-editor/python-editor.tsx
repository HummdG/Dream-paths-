"use client";

import { SimpleEditor } from "./simple-editor";

interface PythonEditorProps {
  initialCode: string;
  expectedOutput?: string;
  hint?: string;
  onCodeChange?: (code: string) => void;
  onSuccess?: () => void;
  readOnly?: boolean;
  height?: string;
}

/**
 * PythonEditor is now a wrapper around SimpleEditor for backward compatibility.
 * The SimpleEditor provides a cleaner, more kid-friendly interface.
 */
export function PythonEditor({
  initialCode,
  expectedOutput,
  hint,
  onCodeChange,
  onSuccess,
  readOnly = false,
  height = "200px",
}: PythonEditorProps) {
  return (
    <SimpleEditor
      initialCode={initialCode}
      expectedOutput={expectedOutput}
      hint={hint}
      onCodeChange={onCodeChange}
      onSuccess={onSuccess}
      readOnly={readOnly}
      height={height}
    />
  );
}

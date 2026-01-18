"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Lightbulb, Check, AlertCircle } from "lucide-react";

interface PythonEditorProps {
  initialCode: string;
  expectedOutput?: string;
  hint?: string;
  onCodeChange?: (code: string) => void;
  onSuccess?: () => void;
  readOnly?: boolean;
  height?: string;
}

// Simple syntax highlighting for Python
function highlightPython(code: string): string {
  const keywords = [
    "def", "class", "if", "else", "elif", "for", "while", "return",
    "import", "from", "as", "try", "except", "finally", "with",
    "True", "False", "None", "and", "or", "not", "in", "is",
    "break", "continue", "pass", "lambda", "global", "nonlocal",
  ];
  
  const builtins = [
    "print", "range", "len", "str", "int", "float", "list", "dict",
    "set", "tuple", "input", "abs", "max", "min", "sum", "round",
  ];

  let result = code
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Highlight strings (both single and double quotes)
  result = result.replace(
    /(["'])((?:\\.|(?!\1)[^\\])*)\1/g,
    '<span class="text-green-600">$&</span>'
  );
  
  // Highlight comments
  result = result.replace(
    /(#.*$)/gm,
    '<span class="text-gray-400 italic">$1</span>'
  );
  
  // Highlight numbers
  result = result.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span class="text-amber-600">$1</span>'
  );
  
  // Highlight keywords
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b(${kw})\\b`, "g");
    result = result.replace(
      regex,
      '<span class="text-violet-600 font-semibold">$1</span>'
    );
  });
  
  // Highlight builtins
  builtins.forEach(fn => {
    const regex = new RegExp(`\\b(${fn})\\b`, "g");
    result = result.replace(
      regex,
      '<span class="text-sky-600">$1</span>'
    );
  });

  return result;
}

export function PythonEditor({
  initialCode,
  expectedOutput,
  hint,
  onCodeChange,
  onSuccess,
  readOnly = false,
  height = "200px",
}: PythonEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setIsCorrect(false);
    onCodeChange?.(newCode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      
      // Move cursor after the tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4;
          textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    setError("");
    setIsCorrect(false);

    try {
      // @ts-expect-error - Pyodide is loaded globally
      if (typeof window.pyodide === "undefined") {
        setError("Python is still loading... Please wait a moment and try again!");
        setIsRunning(false);
        return;
      }

      // @ts-expect-error - Pyodide is loaded globally
      const pyodide = window.pyodide;
      
      // Capture print output
      let printOutput = "";
      pyodide.globals.set("__captured_output__", "");
      
      const wrappedCode = `
import sys
from io import StringIO

__old_stdout__ = sys.stdout
sys.stdout = StringIO()

try:
${code.split("\n").map(line => "    " + line).join("\n")}
except Exception as e:
    print(f"Error: {e}")

__captured_output__ = sys.stdout.getvalue()
sys.stdout = __old_stdout__
__captured_output__
`;
      
      const result = await pyodide.runPythonAsync(wrappedCode);
      printOutput = result || "";
      
      setOutput(printOutput.trim());
      
      // Check if output matches expected
      if (expectedOutput && printOutput.trim() === expectedOutput.trim()) {
        setIsCorrect(true);
        onSuccess?.();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong!";
      // Make error messages kid-friendly
      let friendlyError = errorMessage
        .replace(/SyntaxError:/g, "Oops! There's a typo:")
        .replace(/NameError:/g, "Hmm, I don't recognize:")
        .replace(/TypeError:/g, "Something doesn't match up:")
        .replace(/IndentationError:/g, "Check your spaces:");
      setError(friendlyError);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput("");
    setError("");
    setIsCorrect(false);
    onCodeChange?.(initialCode);
  };

  // Calculate line numbers
  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-gray-200 bg-white shadow-lg">
      {/* Editor Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-white/70 text-sm font-medium ml-2">🐍 Python Code</span>
        </div>
        
        <div className="flex items-center gap-2">
          {hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                showHint 
                  ? "bg-amber-500 text-white" 
                  : "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              Hint
            </button>
          )}
          
          <button
            onClick={resetCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 text-white/70 hover:bg-white/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          
          <button
            onClick={runCode}
            disabled={isRunning || readOnly}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
              isRunning
                ? "bg-gray-500 text-white cursor-wait"
                : "bg-green-500 text-white hover:bg-green-600 hover:scale-105"
            }`}
          >
            <Play className="w-4 h-4" />
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>

      {/* Hint Box */}
      {showHint && hint && (
        <div className="bg-amber-50 border-b-2 border-amber-200 px-4 py-3">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm">{hint}</p>
          </div>
        </div>
      )}

      {/* Code Editor Area */}
      <div className="relative flex bg-slate-50" style={{ height }}>
        {/* Line Numbers */}
        <div className="flex flex-col bg-slate-100 text-slate-400 text-sm font-mono py-3 px-3 select-none border-r border-slate-200">
          {lineNumbers.map(num => (
            <div key={num} className="leading-6 text-right pr-2">
              {num}
            </div>
          ))}
        </div>

        {/* Code Input Area */}
        <div className="relative flex-1 overflow-hidden">
          {/* Syntax highlighted code (background) */}
          <div
            ref={highlightRef}
            className="absolute inset-0 p-3 font-mono text-sm leading-6 whitespace-pre overflow-auto pointer-events-none"
            dangerouslySetInnerHTML={{ __html: highlightPython(code) }}
          />
          
          {/* Actual textarea (transparent, on top) */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={syncScroll}
            readOnly={readOnly}
            className="absolute inset-0 w-full h-full p-3 font-mono text-sm leading-6 bg-transparent text-transparent caret-slate-800 resize-none outline-none"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>
      </div>

      {/* Output Area */}
      <div className="border-t-2 border-gray-200">
        <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
          <span className="text-white/60 text-sm font-medium">📤 Output</span>
          {isCorrect && (
            <span className="flex items-center gap-1 text-green-400 text-sm font-medium">
              <Check className="w-4 h-4" />
              Perfect!
            </span>
          )}
        </div>
        
        <div className="bg-slate-900 p-4 min-h-[60px] font-mono text-sm">
          {error ? (
            <div className="flex items-start gap-2 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <pre className="whitespace-pre-wrap">{error}</pre>
            </div>
          ) : output ? (
            <pre className={`whitespace-pre-wrap ${isCorrect ? "text-green-400" : "text-white"}`}>
              {output}
            </pre>
          ) : (
            <span className="text-slate-500">Click "Run Code" to see what happens! ✨</span>
          )}
        </div>
      </div>
    </div>
  );
}


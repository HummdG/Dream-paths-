"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, HelpCircle, Sparkles, AlertTriangle, Check } from "lucide-react";
import { HighlightedEditor } from "./highlighted-editor";
import type { CheckResult } from "@/lib/validation/validator";

interface SimpleEditorProps {
  initialCode: string;
  starterCode?: string; // The original template — what "Start Over" resets to
  expectedOutput?: string;
  hint?: string;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => Promise<{ output: string; error?: string; success?: boolean }>;
  onSuccess?: () => void;
  readOnly?: boolean;
  height?: string;
  showGameHint?: boolean;
  validationChecks?: CheckResult[];
}

export function SimpleEditor({
  initialCode,
  starterCode = initialCode,
  expectedOutput,
  hint,
  onCodeChange,
  onRun,
  onSuccess,
  readOnly = false,
  height = "200px",
  showGameHint = false,
  validationChecks,
}: SimpleEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  // Reset code when initialCode changes (e.g., step changes)
  useEffect(() => {
    setCode(initialCode);
    setOutput("");
    setError("");
    setIsSuccess(false);
    setHasRun(false);
  }, [initialCode]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setIsSuccess(false);
    onCodeChange?.(newCode);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      // Tab handling is done inside HighlightedEditor via insertSpaces + tabSize
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    setError("");
    setIsSuccess(false);
    setHasRun(true);

    try {
      if (onRun) {
        const result = await onRun(code);
        if (result.error) {
          setError(result.error);
        } else {
          setOutput(result.output);
          if (result.success) {
            setIsSuccess(true);
            onSuccess?.();
          }
        }
      } else {
        const win = window as unknown as { pyodide?: { runPythonAsync: (code: string) => Promise<string> } };
        if (typeof win.pyodide === "undefined") {
          setError("Python is still loading... Please wait a moment and try again!");
          setIsRunning(false);
          return;
        }

        const pyodide = win.pyodide;

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
        const printOutput = result || "";

        setOutput(printOutput.trim());

        if (expectedOutput && printOutput.trim() === expectedOutput.trim()) {
          setIsSuccess(true);
          onSuccess?.();
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong!";
      const friendlyError = errorMessage
        .replace(/SyntaxError:/g, "Oops! Check your code:")
        .replace(/NameError:/g, "Hmm, I don't know:")
        .replace(/TypeError:/g, "Something doesn't match:")
        .replace(/IndentationError:/g, "Check your spacing:");
      setError(friendlyError);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(starterCode);
    setOutput("");
    setError("");
    setIsSuccess(false);
    setHasRun(false);
    onCodeChange?.(starterCode);
  };

  const visibleChecks = validationChecks?.filter(c => c.message !== "") ?? [];

  return (
    <div className="rounded-2xl overflow-hidden border-4 border-amber-300 bg-white shadow-xl flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 to-yellow-400 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐍</span>
          <span className="text-amber-900 font-bold text-lg">Your Code</span>
        </div>

        {hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
              showHint
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white/80 text-amber-800 hover:bg-white"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            {showHint ? "Hide Hint" : "Need Help?"}
          </button>
        )}
      </div>

      {/* Hint Box */}
      <AnimatePresence>
        {showHint && hint && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden shrink-0"
          >
            <div className="bg-blue-50 border-b-2 border-blue-200 px-4 py-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-blue-800 text-sm mb-1">💡 Hint:</p>
                  <p className="text-blue-700">{hint}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Editor Area */}
      <div
        className={`bg-slate-900 flex-1 min-h-0 transition-all ${
          isRunning ? "ring-2 ring-inset ring-amber-400 animate-pulse" : ""
        }`}
        style={{ height }}
      >
        <HighlightedEditor
          value={code}
          onValueChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          height={height}
        />
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-100 px-4 py-3 flex items-center justify-center gap-3 border-t-2 border-gray-200 shrink-0">
        <button
          onClick={resetCode}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white border-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </button>

        <motion.button
          onClick={runCode}
          disabled={isRunning || readOnly}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl text-lg font-bold shadow-lg transition-all ${
            isRunning
              ? "bg-gray-400 text-white cursor-wait"
              : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
          }`}
        >
          <Play className="w-5 h-5" fill="white" />
          {isRunning ? "Running..." : "Run Code!"}
        </motion.button>
      </div>

      {/* Output Area */}
      <div className={`border-t-4 transition-colors shrink-0 max-h-[120px] overflow-y-auto ${
        error ? "border-orange-400 bg-orange-50" :
        isSuccess ? "border-green-400 bg-green-50" :
        "border-violet-300 bg-violet-50"
      }`}>
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-1">
            {error ? (
              <>
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-sm text-orange-700">Oops! Something&apos;s not quite right:</span>
              </>
            ) : isSuccess ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="font-bold text-sm text-green-700">Perfect! 🎉</span>
              </>
            ) : (
              <>
                <span className="text-base">📤</span>
                <span className="font-bold text-sm text-violet-700">Output:</span>
              </>
            )}
          </div>

          <div className={`font-mono text-xs p-2 rounded-lg ${
            error ? "bg-white text-orange-700" :
            isSuccess ? "bg-white text-green-700" :
            "bg-white text-gray-800"
          }`}>
            {error ? (
              <pre className="whitespace-pre-wrap">{error}</pre>
            ) : output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <span className="text-gray-400 italic">
                {hasRun ? "Your code ran but didn't print anything!" : "Click \"Run Code!\" to see what happens ✨"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Per-check validation results */}
      {visibleChecks.length > 0 && (
        <div className="border-t-2 border-gray-200 bg-gray-50 px-3 py-2 shrink-0">
          <p className="text-xs font-bold text-gray-500 mb-1.5">Checklist:</p>
          <div className="flex flex-col gap-1">
            {visibleChecks.map((check, i) => (
              <div key={i} className={`flex items-center gap-2 text-xs font-mono rounded px-2 py-1 ${
                check.passed ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                <span>{check.passed ? "✅" : "❌"}</span>
                <span>{check.message.replace(/^[✅❌]\s*/, "")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game hint */}
      {showGameHint && (
        <div className="bg-slate-800 px-3 py-1.5 border-t border-slate-700 shrink-0">
          <p className="text-slate-400 text-xs">
            <span className="text-cyan-400 font-mono">move(50)</span> = right,{" "}
            <span className="text-cyan-400 font-mono">move(-50)</span> = left,{" "}
            <span className="text-pink-400 font-mono">print()</span> = speech bubble
          </p>
        </div>
      )}
    </div>
  );
}

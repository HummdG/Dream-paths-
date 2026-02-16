"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, HelpCircle, Sparkles, AlertTriangle, Check } from "lucide-react";
import { PYTHON_GAME_API } from "@/lib/game-engine/python-api";

interface SimpleEditorProps {
  initialCode: string;
  expectedOutput?: string;
  hint?: string;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => Promise<{ output: string; error?: string; success?: boolean }>;
  onSuccess?: () => void;
  readOnly?: boolean;
  height?: string;
  showGameHint?: boolean;
}

export function SimpleEditor({
  initialCode,
  expectedOutput,
  hint,
  onCodeChange,
  onRun,
  onSuccess,
  readOnly = false,
  height = "200px",
  showGameHint = false,
}: SimpleEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [gameApiLoaded, setGameApiLoaded] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset code when initialCode changes (e.g., step changes)
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setIsSuccess(false);
    onCodeChange?.(newCode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      onCodeChange?.(newCode);
      
      // Restore cursor position after the tab
      requestAnimationFrame(() => {
        textarea.selectionStart = start + 4;
        textarea.selectionEnd = start + 4;
      });
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
        // Use custom run handler (MissionWorkspace provides this)
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
        // Default Pyodide execution with Game API
        // @ts-expect-error - Pyodide is loaded globally
        if (typeof window.pyodide === "undefined") {
          setError("Python is still loading... Please wait a moment and try again!");
          setIsRunning(false);
          return;
        }

        // @ts-expect-error - Pyodide is loaded globally
        const pyodide = window.pyodide;
        
        // Load the Game API if not already loaded
        if (!gameApiLoaded) {
          try {
            await pyodide.runPythonAsync(PYTHON_GAME_API);
            setGameApiLoaded(true);
          } catch (apiError) {
            console.warn("Could not load game API:", apiError);
            // Continue anyway - basic Python will still work
          }
        }
        
        // Wrap user code to capture output
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
        
        // Check if output matches expected
        if (expectedOutput && printOutput.trim() === expectedOutput.trim()) {
          setIsSuccess(true);
          onSuccess?.();
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong!";
      // Make error messages kid-friendly
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
    setCode(initialCode);
    setOutput("");
    setError("");
    setIsSuccess(false);
    setHasRun(false);
    onCodeChange?.(initialCode);
  };

  return (
    <div className="rounded-2xl overflow-hidden border-4 border-amber-300 bg-white shadow-xl flex flex-col">
      {/* Header - Bright yellow like Scratch */}
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

      {/* Hint Box - Light blue, friendly */}
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

      {/* Code Editor Area - Simple, reliable textarea */}
      <div className="bg-slate-900 flex-1 min-h-0" style={{ height }}>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          className="w-full h-full p-4 font-mono text-sm leading-relaxed bg-slate-900 text-green-400 resize-none outline-none focus:ring-2 focus:ring-amber-400 focus:ring-inset"
          style={{
            caretColor: "#fbbf24", // amber-400 caret
            tabSize: 4,
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          placeholder="# Type your code here!"
        />
      </div>

      {/* Action Buttons - Big, chunky, centered */}
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

      {/* Output Area - Inline, colorful feedback with max height */}
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
                <span className="font-bold text-sm text-orange-700">Oops! Something's not quite right:</span>
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

      {/* Optional game hint - compact */}
      {showGameHint && (
        <div className="bg-slate-800 px-3 py-1.5 border-t border-slate-700 shrink-0">
          <p className="text-slate-400 text-xs">
            <span className="text-cyan-400 font-mono">move(50)</span> = right, 
            <span className="text-cyan-400 font-mono ml-1">move(-50)</span> = left,
            <span className="text-pink-400 font-mono ml-1">print()</span> = speech bubble
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    loadPyodide: () => Promise<unknown>;
    pyodide: unknown;
  }
}

interface PyodideLoaderProps {
  children: React.ReactNode;
}

export function PyodideLoader({ children }: PyodideLoaderProps) {
  const [isLoading, setIsLoading] = useState(false); // Start with false for debugging
  const [loadingMessage, setLoadingMessage] = useState("Getting Python ready...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Pyodide in background - don't block rendering
    const loadPyodide = async () => {
      try {
        // Check if already loaded
        if (window.pyodide) {
          return;
        }

        // Load the Pyodide script
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
        script.async = true;

        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Pyodide"));
          document.head.appendChild(script);
        });

        // Initialize Pyodide
        // @ts-expect-error - loadPyodide comes from the script
        const pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });

        window.pyodide = pyodide;
        console.log("Pyodide loaded successfully!");
      } catch (err) {
        console.error("Pyodide loading error:", err);
        // Don't block on error - user can still read content
      }
    };

    loadPyodide();
  }, []);

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">😢</div>
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)]">
        <div className="flex items-center justify-center py-20">
          <div className="text-center p-8">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-violet-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl">
                🐍
              </div>
            </div>
            <p className="text-gray-600 font-medium text-lg">{loadingMessage}</p>
            <p className="text-gray-400 text-sm mt-2">This only takes a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


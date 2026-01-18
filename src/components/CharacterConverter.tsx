"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Wand2,
  Download,
  Loader2,
  ImageIcon,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Palette,
  Zap,
} from "lucide-react";
import {
  type SpriteStyle,
  convertToSpriteSheet,
  waitForPuter,
  isPuterReady,
  fileToBase64,
} from "@/lib/ai";

interface CharacterConverterProps {
  childId: string;
  onSpriteCreated?: (spriteUrl: string) => void;
}

const styleOptions: { value: SpriteStyle; label: string; emoji: string }[] = [
  { value: "retro", label: "Retro NES", emoji: "🕹️" },
  { value: "snes", label: "SNES 16-bit", emoji: "👾" },
  { value: "gameboy", label: "Gameboy", emoji: "🎮" },
  { value: "modern", label: "Modern Indie", emoji: "✨" },
  { value: "cartoon", label: "Cartoon", emoji: "🎨" },
];

export function CharacterConverter({
  childId,
  onSpriteCreated,
}: CharacterConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [style, setStyle] = useState<SpriteStyle>("retro");
  const [status, setStatus] = useState<
    "idle" | "converting" | "saving" | "complete" | "error"
  >("idle");
  const [result, setResult] = useState<{
    spriteUrl: string;
    previewUrl: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [aiReady, setAiReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for Puter.js on mount
  useEffect(() => {
    const checkPuter = async () => {
      // Initial check
      if (isPuterReady()) {
        setAiReady(true);
        return;
      }

      // Wait for it to load
      const ready = await waitForPuter(15000);
      setAiReady(ready);
    };
    checkPuter();
  }, []);

  const handleFile = useCallback((newFile: File) => {
    if (!newFile.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setError(null);
    setResult(null);
    setFile(newFile);
    setPreviewUrl(URL.createObjectURL(newFile));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleConvert = async () => {
    if (!file) return;

    setError(null);
    setStatus("converting");

    try {
      // Check if Puter is ready
      if (!isPuterReady()) {
        const ready = await waitForPuter(5000);
        if (!ready) {
          throw new Error(
            "AI service is still loading. Please wait a moment and try again."
          );
        }
        setAiReady(true);
      }

      // Convert the image
      const spriteResult = await convertToSpriteSheet(file, style, 32);
      setResult(spriteResult);

      // Save to database
      setStatus("saving");
      const originalBase64 = await fileToBase64(file);

      const response = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          originalImage: originalBase64,
          spriteSheetUrl: spriteResult.spriteUrl,
          previewUrl: spriteResult.previewUrl,
          style,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save character");
      }

      setStatus("complete");
      onSpriteCreated?.(spriteResult.spriteUrl);
    } catch (err) {
      console.error("Conversion error:", err);
      setError(err instanceof Error ? err.message : "Conversion failed");
      setStatus("error");
    }
  };

  const handleDownload = async () => {
    if (!result?.spriteUrl) return;

    try {
      const response = await fetch(result.spriteUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hero-sprite-${style}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download sprite");
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setStatus("idle");
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Style Selector */}
      <div className="flex flex-wrap gap-2">
        {styleOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setStyle(option.value)}
            disabled={status === "converting" || status === "saving"}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              style === option.value
                ? "bg-[var(--color-violet)] text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <span>{option.emoji}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      {/* Upload / Preview Area */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Palette className="w-4 h-4" />
            Your Drawing
          </div>

          {!previewUrl ? (
            <motion.div
              className={`relative h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[var(--color-violet)] bg-violet-50"
                  : "border-gray-300 hover:border-[var(--color-violet)] hover:bg-gray-50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] && handleFile(e.target.files[0])
                }
                className="hidden"
              />
              <Upload
                className={`w-12 h-12 mb-4 ${
                  isDragging ? "text-[var(--color-violet)]" : "text-gray-400"
                }`}
              />
              <p className="text-gray-600 font-medium text-center px-4">
                {isDragging
                  ? "Drop your drawing here!"
                  : "Drag & drop your hero drawing"}
              </p>
              <p className="text-sm text-gray-400 mt-2">or click to browse</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-64 rounded-2xl overflow-hidden bg-gray-100"
            >
              <img
                src={previewUrl}
                alt="Original drawing"
                className="w-full h-full object-contain"
              />
              <button
                onClick={handleReset}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Sprite Result */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Wand2 className="w-4 h-4" />
            Game Sprite
          </div>

          <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {status === "converting" || status === "saving" ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Loader2 className="w-12 h-12 text-[var(--color-violet)] animate-spin" />
                  <p className="text-gray-600 font-medium">
                    {status === "converting"
                      ? "Creating sprite magic..."
                      : "Saving your character..."}
                  </p>
                  <div className="h-2 w-48 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-violet)]"
                      initial={{ width: "0%" }}
                      animate={{ width: status === "saving" ? "90%" : "60%" }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  </div>
                </motion.div>
              ) : result ? (
                <motion.img
                  key="result"
                  src={result.previewUrl}
                  alt="Generated sprite"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-full max-h-full object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-2 text-gray-400"
                >
                  <ImageIcon className="w-12 h-12" />
                  <p className="text-sm">Your sprite will appear here</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* AI Status */}
      {!aiReady && status === "idle" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl text-blue-700"
        >
          <Loader2 className="w-5 h-5 shrink-0 animate-spin" />
          <p>Loading AI service...</p>
        </motion.div>
      )}

      {aiReady && !error && status === "idle" && !result && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl text-emerald-700"
        >
          <Zap className="w-5 h-5 shrink-0" />
          <p>AI ready! Upload a drawing to create your sprite.</p>
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-red-50 rounded-xl text-red-700"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {status === "complete" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-green-50 rounded-xl text-green-700"
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p>
              Your hero sprite has been saved! You can use it in your game
              later.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleConvert}
          disabled={!file || status === "converting" || status === "saving"}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-lg transition-all ${
            file && status !== "converting" && status !== "saving"
              ? "bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-violet)] text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {status === "converting" || status === "saving" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {status === "converting" ? "Converting..." : "Saving..."}
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Convert to Sprite
            </>
          )}
        </button>

        {result && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleDownload}
            className="flex items-center gap-2 py-4 px-6 rounded-2xl font-bold text-lg bg-white border-2 border-[var(--color-violet)] text-[var(--color-violet)] hover:bg-violet-50 transition-all"
          >
            <Download className="w-5 h-5" />
            Download
          </motion.button>
        )}
      </div>
    </div>
  );
}

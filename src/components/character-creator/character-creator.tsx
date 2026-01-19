"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Eraser,
  PaintBucket,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Save,
  Loader2,
} from "lucide-react";
import { PixelCanvas } from "./pixel-canvas";
import { characterTemplates, defaultPalette, CharacterTemplate } from "./templates";

interface CharacterCreatorProps {
  initialPixels?: string[][];
  initialName?: string;
  onSave: (data: { name: string; pixels: string[][] }) => Promise<void>;
  childName: string;
}

type Tool = "draw" | "erase" | "fill";

const GRID_SIZE = 16;
const PIXEL_SIZE = 20;

// Create empty grid
const createEmptyGrid = (): string[][] =>
  Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill("transparent"));

export function CharacterCreator({
  initialPixels,
  initialName = "My Hero",
  onSave,
  childName,
}: CharacterCreatorProps) {
  const [pixels, setPixels] = useState<string[][]>(
    initialPixels || createEmptyGrid()
  );
  const [heroName, setHeroName] = useState(initialName);
  const [currentColor, setCurrentColor] = useState("#EF4444");
  const [tool, setTool] = useState<Tool>("draw");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [templateFilter, setTemplateFilter] = useState<"all" | "boy" | "girl">("all");
  const [templatePage, setTemplatePage] = useState(0);

  const templatesPerPage = 4;

  const filteredTemplates = characterTemplates.filter((t) =>
    templateFilter === "all" ? true : t.category === templateFilter || t.category === "neutral"
  );

  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
  const currentTemplates = filteredTemplates.slice(
    templatePage * templatesPerPage,
    (templatePage + 1) * templatesPerPage
  );

  // Reset page when filter changes
  useEffect(() => {
    setTemplatePage(0);
  }, [templateFilter]);

  const handlePixelChange = useCallback((x: number, y: number, color: string) => {
    setPixels((prev) => {
      const newPixels = prev.map((row) => [...row]);
      newPixels[y][x] = color;
      return newPixels;
    });
  }, []);

  const handleClear = () => {
    setPixels(createEmptyGrid());
  };

  const handleLoadTemplate = (template: CharacterTemplate) => {
    setPixels(template.pixels.map((row) => [...row]));
    if (template.colors.length > 0) {
      setCurrentColor(template.colors[0]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ name: heroName, pixels });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      // Error handling - could add toast notification
    } finally {
      setIsSaving(false);
    }
  };

  // Render mini preview of template
  const renderTemplatePreview = (template: CharacterTemplate) => {
    const previewSize = 3;
    return (
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${previewSize}px)`,
          imageRendering: "pixelated",
        }}
      >
        {template.pixels.map((row, y) =>
          row.map((color, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: previewSize,
                height: previewSize,
                backgroundColor: color === "transparent" ? "transparent" : color,
              }}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] bg-dots">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Design Your Hero!
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-2">
            Create {childName}'s Hero
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Draw your unique pixel art hero! They'll join you on all your coding adventures.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[300px_1fr_300px] gap-6">
          {/* Templates Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h2 className="font-bold text-lg text-[var(--color-navy)] mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Inspiration
            </h2>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { id: "all", label: "All", emoji: "🌟" },
                { id: "boy", label: "Heroes", emoji: "🦸‍♂️" },
                { id: "girl", label: "Heroines", emoji: "🦸‍♀️" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTemplateFilter(filter.id as typeof templateFilter)}
                  className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    templateFilter === filter.id
                      ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.emoji} {filter.label}
                </button>
              ))}
            </div>

            {/* Templates grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <AnimatePresence mode="wait">
                {currentTemplates.map((template, i) => (
                  <motion.button
                    key={template.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleLoadTemplate(template)}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-xl hover:from-violet-50 hover:to-indigo-50 hover:ring-2 hover:ring-violet-300 transition-all group"
                  >
                    <div className="flex justify-center mb-2 p-2 bg-white rounded-lg">
                      {renderTemplatePreview(template)}
                    </div>
                    <p className="text-xs font-medium text-gray-700 group-hover:text-violet-700 truncate">
                      {template.name}
                    </p>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setTemplatePage((p) => Math.max(0, p - 1))}
                  disabled={templatePage === 0}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500">
                  {templatePage + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setTemplatePage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={templatePage === totalPages - 1}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-4 text-center">
              Click a template to start, then customize it!
            </p>
          </motion.div>

          {/* Canvas Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            {/* Tool bar */}
            <div className="flex items-center gap-2 mb-4 bg-white rounded-2xl p-2 shadow-lg">
              {[
                { id: "draw", icon: Pencil, label: "Draw" },
                { id: "erase", icon: Eraser, label: "Erase" },
                { id: "fill", icon: PaintBucket, label: "Fill" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTool(t.id as Tool)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    tool === t.id
                      ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title={t.label}
                >
                  <t.icon className="w-5 h-5" />
                  <span className="hidden md:inline">{t.label}</span>
                </button>
              ))}
              <div className="w-px h-8 bg-gray-200 mx-2" />
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all"
                title="Clear canvas"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="hidden md:inline">Clear</span>
              </button>
            </div>

            {/* Canvas */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 rounded-3xl blur opacity-30 animate-pulse" />
              <div className="relative bg-white p-4 rounded-2xl shadow-xl">
                <PixelCanvas
                  size={GRID_SIZE}
                  pixelSize={PIXEL_SIZE}
                  pixels={pixels}
                  onPixelChange={handlePixelChange}
                  currentColor={currentColor}
                  tool={tool}
                />
              </div>
            </div>

            {/* Current color indicator */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-gray-600">Current color:</span>
              <div
                className="w-10 h-10 rounded-xl border-4 border-white shadow-lg"
                style={{ backgroundColor: currentColor }}
              />
            </div>
          </motion.div>

          {/* Color Palette & Save Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Name Input */}
            <div className="card">
              <h2 className="font-bold text-lg text-[var(--color-navy)] mb-3 flex items-center gap-2">
                <span className="text-2xl">🏷️</span>
                Hero Name
              </h2>
              <input
                type="text"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                placeholder="Name your hero..."
                className="input-field"
                maxLength={20}
              />
            </div>

            {/* Color Palette */}
            <div className="card">
              <h2 className="font-bold text-lg text-[var(--color-navy)] mb-3 flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                Colors
              </h2>
              <div className="grid grid-cols-6 gap-2">
                {defaultPalette.map((color, index) => (
                  <button
                    key={`${color}-${index}`}
                    onClick={() => {
                      setCurrentColor(color);
                      setTool("draw");
                    }}
                    className={`w-full aspect-square rounded-lg transition-all hover:scale-110 ${
                      currentColor === color
                        ? "ring-4 ring-violet-400 ring-offset-2"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="card">
              <h2 className="font-bold text-lg text-[var(--color-navy)] mb-3 flex items-center gap-2">
                <span className="text-2xl">👀</span>
                Preview
              </h2>
              <div className="flex justify-center gap-4">
                {/* Normal size */}
                <div className="text-center">
                  <div className="bg-gradient-to-br from-sky-100 to-violet-100 p-3 rounded-xl inline-block mb-1">
                    <div
                      className="grid"
                      style={{
                        gridTemplateColumns: `repeat(${GRID_SIZE}, 3px)`,
                        imageRendering: "pixelated",
                      }}
                    >
                      {pixels.map((row, y) =>
                        row.map((color, x) => (
                          <div
                            key={`${x}-${y}`}
                            style={{
                              width: 3,
                              height: 3,
                              backgroundColor:
                                color === "transparent" ? "transparent" : color,
                            }}
                          />
                        ))
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">1x</p>
                </div>
                {/* Large size */}
                <div className="text-center">
                  <div className="bg-gradient-to-br from-sky-100 to-violet-100 p-3 rounded-xl inline-block mb-1">
                    <div
                      className="grid"
                      style={{
                        gridTemplateColumns: `repeat(${GRID_SIZE}, 6px)`,
                        imageRendering: "pixelated",
                      }}
                    >
                      {pixels.map((row, y) =>
                        row.map((color, x) => (
                          <div
                            key={`${x}-${y}`}
                            style={{
                              width: 6,
                              height: 6,
                              backgroundColor:
                                color === "transparent" ? "transparent" : color,
                            }}
                          />
                        ))
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">2x</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save My Hero!
                </>
              )}
            </motion.button>

            {/* Success message */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-100 text-emerald-700 p-4 rounded-xl text-center font-medium"
                >
                  🎉 Hero saved successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


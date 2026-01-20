"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Eraser,
  PaintBucket,
  RotateCcw,
  Save,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { PixelCanvas } from "@/components/character-creator/pixel-canvas";
import { SpritePreview, SpriteScalesPreview } from "@/components/design-tools/sprite-preview";
import { ColorPalette, DEFAULT_PALETTE } from "@/components/design-tools/design-palette";
import { EnemyBehaviorPicker, EnemyBehavior } from "./enemy-behavior-picker";
import { SPRITE_TEMPLATES, SpriteTemplate, createEmptyGrid, getTemplatesByCategory } from "./sprite-templates";

type Tool = "draw" | "erase" | "fill";
type SpriteCategory = "enemy" | "obstacle" | "item" | "decoration";

interface SpriteDesignerProps {
  initialPixels?: string[][];
  initialName?: string;
  initialCategory?: SpriteCategory;
  initialBehavior?: EnemyBehavior;
  onSave: (data: {
    name: string;
    category: SpriteCategory;
    pixels: string[][];
    behavior?: EnemyBehavior;
  }) => Promise<void>;
  childName: string;
}

const GRID_SIZE = 16;
const PIXEL_SIZE = 20;

const CATEGORY_OPTIONS = [
  { id: "enemy" as const, name: "Enemy", icon: "👾", description: "Create a bad guy!" },
  { id: "obstacle" as const, name: "Obstacle", icon: "🚧", description: "Make a danger!" },
  { id: "item" as const, name: "Item", icon: "✨", description: "Design a power-up!" },
  { id: "decoration" as const, name: "Decor", icon: "🌿", description: "Add some flair!" },
];

export function SpriteDesigner({
  initialPixels,
  initialName = "My Sprite",
  initialCategory = "enemy",
  initialBehavior = { type: "patrol", speed: 2, range: 4 },
  onSave,
  childName,
}: SpriteDesignerProps) {
  // Sprite state
  const [pixels, setPixels] = useState<string[][]>(initialPixels || createEmptyGrid());
  const [spriteName, setSpriteName] = useState(initialName);
  const [category, setCategory] = useState<SpriteCategory>(initialCategory);
  const [behavior, setBehavior] = useState<EnemyBehavior>(initialBehavior);
  
  // Tool state
  const [currentColor, setCurrentColor] = useState("#EF4444");
  const [tool, setTool] = useState<Tool>("draw");
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [templatePage, setTemplatePage] = useState(0);
  
  const templatesPerPage = 4;
  const filteredTemplates = getTemplatesByCategory(category);
  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
  const currentTemplates = filteredTemplates.slice(
    templatePage * templatesPerPage,
    (templatePage + 1) * templatesPerPage
  );

  // Pixel manipulation
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

  const handleLoadTemplate = (template: SpriteTemplate) => {
    setPixels(template.pixels.map((row) => [...row]));
    setSpriteName(template.name);
    if (template.colors.length > 0) {
      setCurrentColor(template.colors[0]);
    }
    if (template.defaultBehavior) {
      setBehavior(template.defaultBehavior);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        name: spriteName,
        category,
        pixels,
        behavior: category === "enemy" ? behavior : undefined,
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      // Error handling
    } finally {
      setIsSaving(false);
    }
  };

  // Template preview renderer
  const renderTemplatePreview = (template: SpriteTemplate) => {
    const previewSize = 2;
    return (
      <div
        className="grid"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Sprite Designer
          </div>
          
          <div className="text-white font-bold">
            Create {category === "enemy" ? "an Enemy" : category === "obstacle" ? "an Obstacle" : category === "item" ? "an Item" : "a Decoration"}!
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[280px_1fr_280px] gap-6">
          {/* Left Panel - Category & Templates */}
          <div className="space-y-4">
            {/* Category Selector */}
            <div className="bg-slate-800 rounded-2xl p-4">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                What to Create
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.id);
                      setTemplatePage(0);
                    }}
                    className={`p-3 rounded-xl transition-all text-left ${
                      category === cat.id
                        ? "bg-violet-500 ring-2 ring-violet-300"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-sm font-medium text-white">{cat.name}</div>
                    <div className="text-xs text-white/60">{cat.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Templates */}
            <div className="bg-slate-800 rounded-2xl p-4">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Templates
              </h3>

              {filteredTemplates.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <AnimatePresence mode="wait">
                      {currentTemplates.map((template, i) => (
                        <motion.button
                          key={template.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => handleLoadTemplate(template)}
                          className="bg-slate-700/50 p-3 rounded-xl hover:bg-slate-700 transition-all"
                        >
                          <div className="flex justify-center mb-2 p-2 bg-slate-900 rounded-lg">
                            {renderTemplatePreview(template)}
                          </div>
                          <p className="text-xs text-white/70 truncate text-center">
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
                        className="p-1.5 rounded-lg bg-slate-700 text-white/70 hover:bg-slate-600 disabled:opacity-30"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-slate-400">
                        {templatePage + 1} / {totalPages}
                      </span>
                      <button
                        onClick={() => setTemplatePage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={templatePage === totalPages - 1}
                        className="p-1.5 rounded-lg bg-slate-700 text-white/70 hover:bg-slate-600 disabled:opacity-30"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center text-white/50 text-sm py-4">
                  No templates for this category yet. Start from scratch!
                </p>
              )}

              <p className="text-xs text-slate-500 mt-3 text-center">
                Click to start, then customize!
              </p>
            </div>
          </div>

          {/* Center - Canvas */}
          <div className="flex flex-col items-center gap-4">
            {/* Toolbar */}
            <div className="flex items-center gap-2 bg-slate-800 rounded-2xl p-2 shadow-lg">
              {[
                { id: "draw" as const, icon: Pencil, label: "Draw" },
                { id: "erase" as const, icon: Eraser, label: "Erase" },
                { id: "fill" as const, icon: PaintBucket, label: "Fill" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTool(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    tool === t.id
                      ? "bg-violet-500 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  title={t.label}
                >
                  <t.icon className="w-5 h-5" />
                  <span className="hidden md:inline">{t.label}</span>
                </button>
              ))}
              
              <div className="w-px h-8 bg-slate-700 mx-2" />
              
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Clear"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="hidden md:inline">Clear</span>
              </button>
            </div>

            {/* Canvas */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 rounded-3xl blur opacity-20 animate-pulse" />
              <div className="relative bg-slate-900 p-4 rounded-2xl shadow-xl">
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

            {/* Current Color */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/60">Color:</span>
              <div
                className="w-10 h-10 rounded-xl border-4 border-white/20 shadow-lg"
                style={{ backgroundColor: currentColor }}
              />
            </div>

            {/* Preview */}
            <div className="bg-slate-800 rounded-2xl p-4 w-full max-w-md">
              <h3 className="text-white font-bold mb-3 text-center">Preview</h3>
              <div className="flex justify-center">
                <SpriteScalesPreview pixels={pixels} scales={[1, 2, 3]} />
              </div>
            </div>
          </div>

          {/* Right Panel - Colors, Name, Behavior, Save */}
          <div className="space-y-4">
            {/* Name Input */}
            <div className="bg-slate-800 rounded-2xl p-4">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-2xl">🏷️</span>
                Name
              </h3>
              <input
                type="text"
                value={spriteName}
                onChange={(e) => setSpriteName(e.target.value)}
                placeholder="Name your sprite..."
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-violet-500 outline-none"
                maxLength={20}
              />
            </div>

            {/* Color Palette */}
            <ColorPalette
              colors={DEFAULT_PALETTE}
              selectedColor={currentColor}
              onSelectColor={(color) => {
                setCurrentColor(color);
                setTool("draw");
              }}
            />

            {/* Enemy Behavior (only for enemies) */}
            {category === "enemy" && (
              <div className="bg-slate-800 rounded-2xl p-4">
                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎮</span>
                  Behavior
                </h3>
                <EnemyBehaviorPicker
                  behavior={behavior}
                  onChange={setBehavior}
                />
              </div>
            )}

            {/* Save Button */}
            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold px-6 py-4 rounded-2xl flex items-center justify-center gap-2 hover:from-violet-600 hover:to-indigo-600 transition-all disabled:opacity-50"
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
                  Save My {category === "enemy" ? "Enemy" : category === "obstacle" ? "Obstacle" : category === "item" ? "Item" : "Decoration"}!
                </>
              )}
            </motion.button>

            {/* Success Message */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-500/20 text-emerald-300 p-4 rounded-xl text-center font-medium"
                >
                  🎉 Saved successfully!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tips */}
            <div className="bg-slate-800/50 rounded-2xl p-4">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Tips for {childName}
              </h3>
              <ul className="space-y-1 text-sm text-white/60">
                <li>• Start with a template for ideas!</li>
                <li>• Use bold colors that stand out</li>
                <li>• Keep it simple - 16 pixels is small!</li>
                {category === "enemy" && (
                  <li>• Try different behaviors to see which is most fun!</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


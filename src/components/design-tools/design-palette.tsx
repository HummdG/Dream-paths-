"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaletteItem {
  id: string;
  name: string;
  type: string;
  icon?: string;
  color?: string;
  preview?: string[][]; // Pixel data for preview
  category: string;
}

interface DesignPaletteProps {
  items: PaletteItem[];
  categories: { id: string; name: string; icon: string }[];
  selectedItem: string | null;
  onSelectItem: (item: PaletteItem) => void;
  title?: string;
  itemsPerPage?: number;
}

export function DesignPalette({
  items,
  categories,
  selectedItem,
  onSelectItem,
  title = "Objects",
  itemsPerPage = 8,
}: DesignPaletteProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "all");
  const [page, setPage] = useState(0);

  const filteredItems = activeCategory === "all"
    ? items
    : items.filter((item) => item.category === activeCategory);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  // Reset page when category changes
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setPage(0);
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      {/* Title */}
      <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
        <span className="text-2xl">🎨</span>
        {title}
      </h3>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1 mb-4">
        <button
          onClick={() => handleCategoryChange("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            activeCategory === "all"
              ? "bg-violet-500 text-white"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          🌟 All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? "bg-violet-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {currentItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onSelectItem(item)}
            className={`relative p-2 rounded-xl transition-all ${
              selectedItem === item.id
                ? "bg-violet-500 ring-2 ring-violet-300"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Preview */}
            <div className="w-full aspect-square flex items-center justify-center mb-1">
              {item.preview ? (
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${item.preview.length}, 3px)`,
                    imageRendering: "pixelated",
                  }}
                >
                  {item.preview.map((row, y) =>
                    row.map((color, x) => (
                      <div
                        key={`${x}-${y}`}
                        style={{
                          width: 3,
                          height: 3,
                          backgroundColor: color === "transparent" ? "transparent" : color,
                        }}
                      />
                    ))
                  )}
                </div>
              ) : item.icon ? (
                <span className="text-2xl">{item.icon}</span>
              ) : (
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: item.color || "#666" }}
                />
              )}
            </div>
            
            {/* Name */}
            <p className="text-xs text-center text-white/80 truncate">
              {item.name}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-lg bg-slate-700 text-white/70 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-400">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-1.5 rounded-lg bg-slate-700 text-white/70 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// Color palette specifically for pixel art
interface ColorPaletteProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
  showTransparent?: boolean;
}

export function ColorPalette({
  colors,
  selectedColor,
  onSelectColor,
  showTransparent = true,
}: ColorPaletteProps) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
        <span className="text-2xl">🎨</span>
        Colors
      </h3>
      
      <div className="grid grid-cols-6 gap-2">
        {showTransparent && (
          <button
            onClick={() => onSelectColor("transparent")}
            className={`w-full aspect-square rounded-lg transition-all relative overflow-hidden ${
              selectedColor === "transparent"
                ? "ring-4 ring-violet-400 ring-offset-2 ring-offset-slate-800"
                : ""
            }`}
            title="Transparent"
          >
            {/* Checkerboard pattern for transparent */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="bg-white" />
              <div className="bg-gray-300" />
              <div className="bg-gray-300" />
              <div className="bg-white" />
            </div>
          </button>
        )}
        
        {colors.map((color, index) => (
          <button
            key={`${color}-${index}`}
            onClick={() => onSelectColor(color)}
            className={`w-full aspect-square rounded-lg transition-all hover:scale-110 ${
              selectedColor === color
                ? "ring-4 ring-violet-400 ring-offset-2 ring-offset-slate-800"
                : ""
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}

// Default color palettes
export const DEFAULT_PALETTE = [
  // Reds
  "#EF4444", "#DC2626", "#B91C1C",
  // Oranges  
  "#F97316", "#EA580C", "#C2410C",
  // Yellows
  "#EAB308", "#CA8A04", "#A16207",
  // Greens
  "#22C55E", "#16A34A", "#15803D",
  // Blues
  "#3B82F6", "#2563EB", "#1D4ED8",
  // Purples
  "#A855F7", "#9333EA", "#7C3AED",
  // Pinks
  "#EC4899", "#DB2777", "#BE185D",
  // Neutrals
  "#FFFFFF", "#A1A1AA", "#71717A", 
  "#52525B", "#3F3F46", "#27272A",
  "#18181B", "#000000",
  // Skin tones
  "#FFDBB4", "#EDB98A", "#D08B5B",
  "#AE5D29", "#614335", "#3B2219",
];

export const GAME_PALETTE = [
  // Platform colors
  "#4A5568", "#2D3748", "#1A202C",
  // Nature
  "#68D391", "#48BB78", "#38A169",
  "#2F855A", "#276749", "#22543D",
  // Sky/Water
  "#63B3ED", "#4299E1", "#3182CE",
  "#2B6CB0", "#2C5282", "#2A4365",
  // Danger
  "#FC8181", "#F56565", "#E53E3E",
  "#C53030", "#9B2C2C", "#742A2A",
  // Gold/Coins
  "#FBD38D", "#F6AD55", "#ED8936",
  "#DD6B20", "#C05621", "#9C4221",
  // Lava
  "#FEB2B2", "#FC8181", "#F56565",
  "#FF6B35", "#FF4500", "#CC3700",
];





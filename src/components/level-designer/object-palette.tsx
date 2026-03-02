"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaletteObject {
  id: string;
  name: string;
  type: string;
  subtype?: string;
  icon: string;
  color?: string;
  width?: number;
  height?: number;
  category: "platforms" | "hazards" | "enemies" | "items" | "decorations" | "powerups";
}

const DEFAULT_OBJECTS: PaletteObject[] = [
  // Platforms
  { id: "platform_solid", name: "Platform", type: "platform", subtype: "solid", icon: "🟫", category: "platforms", width: 3, height: 1 },
  { id: "platform_small", name: "Small", type: "platform", subtype: "solid", icon: "🟫", category: "platforms", width: 1, height: 1 },
  { id: "platform_moving", name: "Moving", type: "platform", subtype: "moving", icon: "↔️", category: "platforms", width: 2, height: 1 },
  { id: "platform_breakable", name: "Breakable", type: "platform", subtype: "breakable", icon: "💔", category: "platforms", width: 2, height: 1 },
  { id: "platform_bouncy", name: "Bouncy", type: "platform", subtype: "bouncy", icon: "🔵", category: "platforms", width: 2, height: 1 },
  
  // Hazards
  { id: "hazard_spike", name: "Spikes", type: "hazard", subtype: "spike", icon: "⚠️", category: "hazards", width: 1, height: 1 },
  { id: "hazard_lava", name: "Lava", type: "hazard", subtype: "lava", icon: "🔶", category: "hazards", width: 2, height: 1 },
  { id: "hazard_water", name: "Water", type: "hazard", subtype: "water", icon: "💧", category: "hazards", width: 2, height: 2 },
  
  // Enemies
  { id: "enemy_slime", name: "Slime", type: "enemy", subtype: "slime", icon: "🟢", category: "enemies" },
  { id: "enemy_bat", name: "Bat", type: "enemy", subtype: "bat", icon: "🦇", category: "enemies" },
  { id: "enemy_robot", name: "Robot", type: "enemy", subtype: "robot", icon: "🤖", category: "enemies" },
  { id: "enemy_ghost", name: "Ghost", type: "enemy", subtype: "ghost", icon: "👻", category: "enemies" },
  { id: "enemy_fish", name: "Fish", type: "enemy", subtype: "fish", icon: "🐟", category: "enemies" },
  { id: "enemy_fire", name: "Fire", type: "enemy", subtype: "fire", icon: "🔥", category: "enemies" },
  
  // Items
  { id: "coin", name: "Coin", type: "coin", icon: "🪙", category: "items" },
  { id: "spawn", name: "Spawn", type: "spawn", icon: "🎮", category: "items" },
  { id: "goal", name: "Goal", type: "goal", icon: "🚩", category: "items" },
  
  // Decorations
  { id: "decoration_tree", name: "Tree", type: "decoration", subtype: "tree", icon: "🌲", category: "decorations" },
  { id: "decoration_flower", name: "Flower", type: "decoration", subtype: "flower", icon: "🌸", category: "decorations" },
  { id: "decoration_rock", name: "Rock", type: "decoration", subtype: "rock", icon: "🪨", category: "decorations" },
  { id: "decoration_star", name: "Star", type: "decoration", subtype: "star", icon: "⭐", category: "decorations" },
  
  // Power-ups
  { id: "powerup_super_jump", name: "Super Jump", type: "powerup", subtype: "super_jump", icon: "🦘", category: "powerups" },
  { id: "powerup_turbo_speed", name: "Turbo Speed", type: "powerup", subtype: "turbo_speed", icon: "💨", category: "powerups" },
  { id: "powerup_sky_glide", name: "Sky Glide", type: "powerup", subtype: "sky_glide", icon: "🪂", category: "powerups" },
  { id: "powerup_flame_thrower", name: "Flame Thrower", type: "powerup", subtype: "flame_thrower", icon: "🔥", category: "powerups" },
  { id: "powerup_ice_blast", name: "Ice Blast", type: "powerup", subtype: "ice_blast", icon: "❄️", category: "powerups" },
  { id: "powerup_boomerang", name: "Boomerang", type: "powerup", subtype: "boomerang", icon: "🪃", category: "powerups" },
  { id: "powerup_iron_shield", name: "Iron Shield", type: "powerup", subtype: "iron_shield", icon: "🛡️", category: "powerups" },
  { id: "powerup_laser_eyes", name: "Laser Eyes", type: "powerup", subtype: "laser_eyes", icon: "👁️", category: "powerups" },
];

const CATEGORIES = [
  { id: "platforms", name: "Platforms", icon: "🏗️" },
  { id: "hazards", name: "Hazards", icon: "⚠️" },
  { id: "enemies", name: "Enemies", icon: "👾" },
  { id: "items", name: "Items", icon: "🪙" },
  { id: "powerups", name: "Power-ups", icon: "⚡" },
  { id: "decorations", name: "Decor", icon: "🌿" },
];

interface ObjectPaletteProps {
  selectedObject: string | null;
  onSelectObject: (objectId: string) => void;
  customObjects?: PaletteObject[];
}

export function ObjectPalette({
  selectedObject,
  onSelectObject,
  customObjects = [],
}: ObjectPaletteProps) {
  const [activeCategory, setActiveCategory] = useState<string>("platforms");
  const [page, setPage] = useState(0);
  const itemsPerPage = 8;

  const allObjects = [...DEFAULT_OBJECTS, ...customObjects];
  const filteredObjects = allObjects.filter(obj => obj.category === activeCategory);
  const totalPages = Math.ceil(filteredObjects.length / itemsPerPage);
  const currentObjects = filteredObjects.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setPage(0);
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
        <span className="text-2xl">🧱</span>
        Objects
      </h3>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1 mb-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === cat.id
                ? "bg-violet-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Objects Grid */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {currentObjects.map(obj => (
          <motion.button
            key={obj.id}
            onClick={() => onSelectObject(obj.id)}
            className={`relative p-2 rounded-xl transition-all ${
              selectedObject === obj.id
                ? "bg-violet-500 ring-2 ring-violet-300"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-full aspect-square flex items-center justify-center mb-1">
              <span className="text-2xl">{obj.icon}</span>
            </div>
            <p className="text-xs text-center text-white/80 truncate">
              {obj.name}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-lg bg-slate-700 text-white/70 hover:bg-slate-600 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-400">{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-1.5 rounded-lg bg-slate-700 text-white/70 hover:bg-slate-600 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// Get object config by ID
export function getObjectConfig(id: string): PaletteObject | undefined {
  return DEFAULT_OBJECTS.find(obj => obj.id === id);
}


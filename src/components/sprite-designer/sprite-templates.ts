/**
 * Sprite Templates for Obstacles and Enemies
 * 
 * Pre-designed pixel art templates for inspiration.
 */

export interface SpriteTemplate {
  id: string;
  name: string;
  category: "obstacle" | "enemy" | "item" | "decoration";
  pixels: string[][];
  colors: string[];
  defaultBehavior?: EnemyBehavior;
}

export interface EnemyBehavior {
  type: "patrol" | "chase" | "jump" | "fly" | "stationary";
  speed: number;
  range: number;
  jumpHeight?: number;
}

// 16x16 pixel art templates
export const SPRITE_TEMPLATES: SpriteTemplate[] = [
  // ==================== ENEMIES ====================
  {
    id: "slime_green",
    name: "Green Slime",
    category: "enemy",
    defaultBehavior: { type: "patrol", speed: 2, range: 4 },
    colors: ["#22c55e", "#16a34a", "#15803d", "#166534"],
    pixels: [
      ["transparent","transparent","transparent","transparent","transparent","transparent","#22c55e","#22c55e","#22c55e","#22c55e","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","#22c55e","#22c55e","#16a34a","#16a34a","#16a34a","#16a34a","#22c55e","#22c55e","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","#22c55e","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#22c55e","transparent","transparent","transparent"],
      ["transparent","transparent","#22c55e","#16a34a","#16a34a","#ffffff","#ffffff","#16a34a","#16a34a","#ffffff","#ffffff","#16a34a","#16a34a","#22c55e","transparent","transparent"],
      ["transparent","transparent","#22c55e","#16a34a","#16a34a","#ffffff","#000000","#16a34a","#16a34a","#ffffff","#000000","#16a34a","#16a34a","#22c55e","transparent","transparent"],
      ["transparent","#22c55e","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#22c55e","transparent"],
      ["transparent","#22c55e","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#22c55e","transparent"],
      ["#22c55e","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#22c55e"],
      ["#22c55e","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#22c55e"],
      ["#22c55e","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#22c55e"],
      ["#22c55e","#15803d","#15803d","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#15803d","#15803d","#22c55e"],
      ["transparent","#22c55e","#15803d","#15803d","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#16a34a","#15803d","#15803d","#22c55e","transparent"],
      ["transparent","transparent","#22c55e","#15803d","#15803d","#15803d","#15803d","#15803d","#15803d","#15803d","#15803d","#15803d","#15803d","#22c55e","transparent","transparent"],
      ["transparent","transparent","transparent","#22c55e","#22c55e","#15803d","#15803d","#15803d","#15803d","#15803d","#15803d","#22c55e","#22c55e","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","#22c55e","#22c55e","#22c55e","#22c55e","#22c55e","#22c55e","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
    ],
  },
  {
    id: "bat_purple",
    name: "Purple Bat",
    category: "enemy",
    defaultBehavior: { type: "fly", speed: 3, range: 5 },
    colors: ["#a855f7", "#9333ea", "#7c3aed", "#6d28d9"],
    pixels: [
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","#a855f7","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","#a855f7","transparent","transparent"],
      ["transparent","#a855f7","#9333ea","#a855f7","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","#a855f7","#9333ea","#a855f7","transparent"],
      ["#a855f7","#9333ea","#9333ea","#9333ea","#a855f7","transparent","transparent","transparent","transparent","transparent","transparent","#a855f7","#9333ea","#9333ea","#9333ea","#a855f7"],
      ["#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#a855f7","#a855f7","#a855f7","#a855f7","#a855f7","#a855f7","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea"],
      ["#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea"],
      ["#7c3aed","#9333ea","#9333ea","#9333ea","#9333ea","#ffffff","#000000","#9333ea","#9333ea","#ffffff","#000000","#9333ea","#9333ea","#9333ea","#9333ea","#7c3aed"],
      ["transparent","#7c3aed","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#7c3aed","transparent"],
      ["transparent","transparent","#7c3aed","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#7c3aed","transparent","transparent"],
      ["transparent","transparent","transparent","#7c3aed","#9333ea","#9333ea","#9333ea","#ff6b6b","#ff6b6b","#9333ea","#9333ea","#9333ea","#7c3aed","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","#7c3aed","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#7c3aed","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","#7c3aed","#9333ea","#9333ea","#9333ea","#9333ea","#7c3aed","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","#7c3aed","#7c3aed","#7c3aed","#7c3aed","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
    ],
  },
  {
    id: "robot_gray",
    name: "Robot",
    category: "enemy",
    defaultBehavior: { type: "patrol", speed: 1, range: 3 },
    colors: ["#64748b", "#475569", "#334155", "#1e293b"],
    pixels: [
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","#64748b","#475569","#475569","#475569","#475569","#475569","#475569","#64748b","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","#64748b","#475569","#ff0000","#ff0000","#475569","#475569","#ff0000","#ff0000","#475569","#64748b","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","#64748b","#475569","#ff0000","#ffffff","#475569","#475569","#ff0000","#ffffff","#475569","#64748b","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","#64748b","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#64748b","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","#64748b","#475569","#475569","#334155","#334155","#334155","#334155","#475569","#475569","#64748b","transparent","transparent","transparent"],
      ["transparent","transparent","#64748b","#64748b","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#64748b","#64748b","transparent","transparent"],
      ["transparent","transparent","#64748b","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#64748b","transparent","transparent"],
      ["transparent","transparent","#334155","#475569","#475569","#64748b","#475569","#475569","#475569","#475569","#64748b","#475569","#475569","#334155","transparent","transparent"],
      ["transparent","transparent","#334155","#475569","#475569","#64748b","#475569","#475569","#475569","#475569","#64748b","#475569","#475569","#334155","transparent","transparent"],
      ["transparent","transparent","transparent","#334155","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#334155","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","#334155","#475569","#475569","#475569","transparent","transparent","#475569","#475569","#475569","#334155","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","#334155","#334155","#334155","#334155","transparent","transparent","#334155","#334155","#334155","#334155","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
    ],
  },
  {
    id: "ghost_white",
    name: "Ghost",
    category: "enemy",
    defaultBehavior: { type: "chase", speed: 2, range: 6 },
    colors: ["#f8fafc", "#e2e8f0", "#cbd5e1", "#94a3b8"],
    pixels: [
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","#f8fafc","#f8fafc","#f8fafc","#f8fafc","#f8fafc","#f8fafc","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","#f8fafc","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#f8fafc","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","#f8fafc","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#f8fafc","transparent","transparent","transparent"],
      ["transparent","transparent","#f8fafc","#e2e8f0","#e2e8f0","#000000","#000000","#e2e8f0","#e2e8f0","#000000","#000000","#e2e8f0","#e2e8f0","#f8fafc","transparent","transparent"],
      ["transparent","transparent","#f8fafc","#e2e8f0","#e2e8f0","#000000","#000000","#e2e8f0","#e2e8f0","#000000","#000000","#e2e8f0","#e2e8f0","#f8fafc","transparent","transparent"],
      ["transparent","transparent","#f8fafc","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#f8fafc","transparent","transparent"],
      ["transparent","transparent","#f8fafc","#e2e8f0","#e2e8f0","#e2e8f0","#cbd5e1","#cbd5e1","#cbd5e1","#cbd5e1","#e2e8f0","#e2e8f0","#e2e8f0","#f8fafc","transparent","transparent"],
      ["transparent","transparent","#f8fafc","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#f8fafc","transparent","transparent"],
      ["transparent","transparent","#f8fafc","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#f8fafc","transparent","transparent"],
      ["transparent","transparent","#f8fafc","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#f8fafc","transparent","transparent"],
      ["transparent","transparent","#f8fafc","#cbd5e1","#e2e8f0","#e2e8f0","#cbd5e1","#e2e8f0","#e2e8f0","#cbd5e1","#e2e8f0","#e2e8f0","#cbd5e1","#f8fafc","transparent","transparent"],
      ["transparent","transparent","#f8fafc","transparent","#cbd5e1","#cbd5e1","transparent","#cbd5e1","#cbd5e1","transparent","#cbd5e1","#cbd5e1","transparent","#f8fafc","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
    ],
  },

  // ==================== OBSTACLES ====================
  {
    id: "spike_metal",
    name: "Metal Spikes",
    category: "obstacle",
    colors: ["#64748b", "#475569", "#334155"],
    pixels: [
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","#475569","#475569","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","#475569","#64748b","#64748b","#475569","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","#475569","#64748b","#64748b","#64748b","#64748b","#475569","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","#475569","transparent","transparent","#475569","#64748b","#64748b","#64748b","#64748b","#475569","transparent","transparent","#475569","transparent","transparent"],
      ["transparent","#475569","#64748b","#475569","#475569","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#475569","#475569","#64748b","#475569","transparent"],
      ["transparent","#475569","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#475569","transparent"],
      ["#475569","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#475569"],
      ["#475569","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#475569"],
      ["#334155","#475569","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#475569","#334155"],
      ["#334155","#334155","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#475569","#334155","#334155"],
      ["#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155"],
      ["#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155"],
      ["#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155","#334155"],
    ],
  },
  {
    id: "rock_brown",
    name: "Boulder",
    category: "obstacle",
    colors: ["#78716c", "#57534e", "#44403c", "#292524"],
    pixels: [
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","#78716c","#78716c","#78716c","#78716c","#78716c","#78716c","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","#78716c","#78716c","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#78716c","#78716c","transparent","transparent","transparent"],
      ["transparent","transparent","#78716c","#57534e","#57534e","#57534e","#78716c","#78716c","#57534e","#57534e","#57534e","#57534e","#57534e","#78716c","transparent","transparent"],
      ["transparent","#78716c","#57534e","#57534e","#57534e","#78716c","#78716c","#78716c","#78716c","#57534e","#57534e","#57534e","#57534e","#57534e","#78716c","transparent"],
      ["transparent","#78716c","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#44403c","#44403c","#57534e","#57534e","#78716c","transparent"],
      ["#78716c","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#44403c","#44403c","#44403c","#44403c","#57534e","#57534e","#78716c"],
      ["#78716c","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#44403c","#44403c","#44403c","#44403c","#57534e","#57534e","#78716c"],
      ["#78716c","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#44403c","#44403c","#57534e","#57534e","#57534e","#78716c"],
      ["#78716c","#57534e","#57534e","#44403c","#44403c","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#78716c"],
      ["#78716c","#57534e","#44403c","#44403c","#44403c","#44403c","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#78716c"],
      ["transparent","#78716c","#44403c","#44403c","#44403c","#44403c","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#78716c","transparent"],
      ["transparent","#78716c","#57534e","#44403c","#44403c","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#78716c","transparent"],
      ["transparent","transparent","#78716c","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#78716c","transparent","transparent"],
      ["transparent","transparent","transparent","#78716c","#78716c","#57534e","#57534e","#57534e","#57534e","#57534e","#57534e","#78716c","#78716c","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","#78716c","#78716c","#78716c","#78716c","#78716c","#78716c","transparent","transparent","transparent","transparent","transparent"],
    ],
  },

  // ==================== ITEMS ====================
  {
    id: "coin_gold",
    name: "Gold Coin",
    category: "item",
    colors: ["#fcd34d", "#fbbf24", "#f59e0b", "#d97706"],
    pixels: [
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","#fcd34d","#fcd34d","#fcd34d","#fcd34d","#fcd34d","#fcd34d","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","#fcd34d","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fcd34d","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","#fcd34d","#fbbf24","#fbbf24","#fcd34d","#fcd34d","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fcd34d","transparent","transparent","transparent"],
      ["transparent","transparent","#fcd34d","#fbbf24","#fbbf24","#fcd34d","#fcd34d","#fcd34d","#fcd34d","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fcd34d","transparent","transparent"],
      ["transparent","transparent","#fcd34d","#fbbf24","#fbbf24","#fcd34d","#fcd34d","#fcd34d","#fcd34d","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fcd34d","transparent","transparent"],
      ["transparent","transparent","#fcd34d","#fbbf24","#fbbf24","#fbbf24","#fcd34d","#fcd34d","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fcd34d","transparent","transparent"],
      ["transparent","transparent","#fcd34d","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fcd34d","transparent","transparent"],
      ["transparent","transparent","#fcd34d","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#f59e0b","#f59e0b","#fbbf24","#fcd34d","transparent","transparent"],
      ["transparent","transparent","#fcd34d","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#f59e0b","#f59e0b","#f59e0b","#fbbf24","#fcd34d","transparent","transparent"],
      ["transparent","transparent","transparent","#fcd34d","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#f59e0b","#f59e0b","#f59e0b","#fbbf24","#fcd34d","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","#fcd34d","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fbbf24","#fcd34d","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","#fcd34d","#fcd34d","#fcd34d","#fcd34d","#fcd34d","#fcd34d","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
    ],
  },
  {
    id: "heart_red",
    name: "Heart",
    category: "item",
    colors: ["#fca5a5", "#f87171", "#ef4444", "#dc2626"],
    pixels: [
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","#ef4444","#ef4444","#ef4444","transparent","transparent","transparent","transparent","#ef4444","#ef4444","#ef4444","transparent","transparent","transparent"],
      ["transparent","transparent","#ef4444","#f87171","#f87171","#f87171","#ef4444","transparent","transparent","#ef4444","#f87171","#f87171","#f87171","#ef4444","transparent","transparent"],
      ["transparent","#ef4444","#f87171","#fca5a5","#fca5a5","#f87171","#f87171","#ef4444","#ef4444","#f87171","#f87171","#f87171","#f87171","#f87171","#ef4444","transparent"],
      ["transparent","#ef4444","#f87171","#fca5a5","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#ef4444","transparent"],
      ["transparent","#ef4444","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#ef4444","transparent"],
      ["transparent","#ef4444","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#ef4444","transparent"],
      ["transparent","transparent","#ef4444","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#ef4444","transparent","transparent"],
      ["transparent","transparent","transparent","#ef4444","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#ef4444","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","#ef4444","#f87171","#f87171","#f87171","#f87171","#f87171","#f87171","#ef4444","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","#ef4444","#f87171","#f87171","#f87171","#f87171","#ef4444","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","#ef4444","#f87171","#f87171","#ef4444","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","#ef4444","#ef4444","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
      ["transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent","transparent"],
    ],
  },
];

// Create an empty 16x16 grid
export function createEmptyGrid(): string[][] {
  return Array(16).fill(null).map(() => Array(16).fill("transparent"));
}

// Get templates by category
export function getTemplatesByCategory(category: SpriteTemplate["category"]): SpriteTemplate[] {
  return SPRITE_TEMPLATES.filter(t => t.category === category);
}



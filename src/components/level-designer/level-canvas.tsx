"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { ZoomIn, ZoomOut, Move, Trash2 } from "lucide-react";
import { THEMES, ThemeId } from "@/lib/level-templates";

export interface LevelObject {
  id: string;
  type: "platform" | "coin" | "enemy" | "goal" | "spawn" | "decoration" | "hazard" | "powerup";
  x: number;
  y: number;
  width: number;
  height: number;
  subtype?: string;
  data?: Record<string, unknown>;
}

interface LevelCanvasProps {
  width?: number;  // Canvas width in tiles
  height?: number; // Canvas height in tiles
  tileSize?: number;
  theme: ThemeId;
  objects: LevelObject[];
  selectedTool: "select" | "place" | "erase" | "pan";
  selectedObjectType?: string;
  onObjectPlace?: (x: number, y: number, type: string, subtype?: string) => void;
  onObjectMove?: (id: string, x: number, y: number) => void;
  onObjectDelete?: (id: string) => void;
  onObjectSelect?: (object: LevelObject | null) => void;
  selectedObjectId?: string | null;
  isInfinite?: boolean;
}

const OBJECT_ICONS: Record<string, string> = {
  spawn: "🎮",
  goal: "🚩",
  coin: "🪙",
  enemy_slime: "🟢",
  enemy_bat: "🦇",
  enemy_robot: "🤖",
  enemy_ghost: "👻",
  enemy_fish: "🐟",
  enemy_fire: "🔥",
  hazard_spike: "⚠️",
  hazard_lava: "🔶",
  hazard_water: "💧",
  decoration: "🌿",
  // Power-ups
  powerup_super_jump: "🦘",
  powerup_turbo_speed: "💨",
  powerup_sky_glide: "🪂",
  powerup_flame_thrower: "🔥",
  powerup_ice_blast: "❄️",
  powerup_boomerang: "🪃",
  powerup_iron_shield: "🛡️",
  powerup_laser_eyes: "👁️",
};

const POWERUP_COLORS: Record<string, string> = {
  super_jump: "#22c55e",
  turbo_speed: "#f97316",
  sky_glide: "#3b82f6",
  flame_thrower: "#ef4444",
  ice_blast: "#06b6d4",
  boomerang: "#a855f7",
  iron_shield: "#64748b",
  laser_eyes: "#eab308",
};

export function LevelCanvas({
  width = 40,
  height = 25,
  tileSize = 20,
  theme,
  objects,
  selectedTool,
  selectedObjectType,
  onObjectPlace,
  onObjectMove,
  onObjectDelete,
  onObjectSelect,
  selectedObjectId,
  isInfinite = false,
}: LevelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPos, setLastPanPos] = useState({ x: 0, y: 0 });
  const [hoverTile, setHoverTile] = useState<{ x: number; y: number } | null>(null);
  const [draggedObject, setDraggedObject] = useState<LevelObject | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasWidth = width * tileSize;
  const canvasHeight = height * tileSize;
  const themeConfig = THEMES[theme];

  // Draw the canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear with background color
    ctx.fillStyle = themeConfig.backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * tileSize, 0);
      ctx.lineTo(x * tileSize, canvasHeight);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * tileSize);
      ctx.lineTo(canvasWidth, y * tileSize);
      ctx.stroke();
    }

    // Draw objects sorted by layer
    const sortedObjects = [...objects].sort((a, b) => {
      const order: Record<string, number> = { decoration: 0, platform: 1, hazard: 2, coin: 3, powerup: 4, enemy: 5, spawn: 6, goal: 7 };
      return (order[a.type] || 0) - (order[b.type] || 0);
    });

    for (const obj of sortedObjects) {
      drawObject(ctx, obj, obj.id === selectedObjectId);
    }

    // Draw infinite loop indicators
    if (isInfinite) {
      // Left side loop indicator
      ctx.fillStyle = "rgba(168, 85, 247, 0.3)";
      ctx.fillRect(0, 0, tileSize * 2, canvasHeight);
      
      // Right side loop indicator
      ctx.fillRect(canvasWidth - tileSize * 2, 0, tileSize * 2, canvasHeight);
      
      // Loop arrows
      ctx.font = "bold 24px system-ui";
      ctx.fillStyle = "rgba(168, 85, 247, 0.8)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("♾️", tileSize, canvasHeight / 2);
      ctx.fillText("♾️", canvasWidth - tileSize, canvasHeight / 2);
      
      // Loop connection lines
      ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(0, canvasHeight / 2);
      ctx.lineTo(tileSize * 2, canvasHeight / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(canvasWidth - tileSize * 2, canvasHeight / 2);
      ctx.lineTo(canvasWidth, canvasHeight / 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw hover preview
    if (hoverTile && selectedTool === "place" && selectedObjectType) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.fillRect(hoverTile.x * tileSize, hoverTile.y * tileSize, tileSize, tileSize);
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(hoverTile.x * tileSize, hoverTile.y * tileSize, tileSize, tileSize);
      ctx.setLineDash([]);
    }

    // Draw dragged object preview
    if (draggedObject && hoverTile) {
      ctx.globalAlpha = 0.5;
      const previewObj = { ...draggedObject, x: hoverTile.x, y: hoverTile.y };
      drawObject(ctx, previewObj, false);
      ctx.globalAlpha = 1;
    }
  }, [objects, width, height, tileSize, canvasWidth, canvasHeight, themeConfig, selectedObjectId, hoverTile, selectedTool, selectedObjectType, draggedObject, isInfinite]);

  const drawObject = (ctx: CanvasRenderingContext2D, obj: LevelObject, isSelected: boolean) => {
    const x = obj.x * tileSize;
    const y = obj.y * tileSize;
    const w = obj.width * tileSize;
    const h = obj.height * tileSize;

    switch (obj.type) {
      case "platform":
        // Draw platform with theme colors
        ctx.fillStyle = themeConfig.platformColor;
        ctx.fillRect(x, y, w, h);
        
        // Top highlight
        ctx.fillStyle = themeConfig.platformAccent;
        ctx.fillRect(x, y, w, 4);
        
        // Bottom shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(x, y + h - 4, w, 4);
        break;

      case "coin":
        // Animated coin effect
        const pulse = Math.sin(Date.now() / 200) * 2;
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, 8 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = "#ffd700";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + w / 2 - 2, y + h / 2 - 2, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fill();
        break;

      case "enemy":
        // Draw enemy based on subtype
        const enemyColor = obj.subtype === "slime" ? "#22c55e" :
                         obj.subtype === "bat" ? "#a855f7" :
                         obj.subtype === "robot" ? "#64748b" :
                         obj.subtype === "ghost" ? "#94a3b8" :
                         obj.subtype === "fish" ? "#3b82f6" :
                         obj.subtype === "fire" ? "#f97316" : "#ef4444";
        
        ctx.fillStyle = enemyColor;
        if (obj.subtype === "slime") {
          ctx.beginPath();
          ctx.ellipse(x + w / 2, y + h * 0.7, w / 2 - 2, h / 3, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
        }
        
        // Eyes
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(x + w / 2 - 4, y + h / 3, 3, 0, Math.PI * 2);
        ctx.arc(x + w / 2 + 4, y + h / 3, 3, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "goal":
        // Flag pole
        ctx.fillStyle = "#888888";
        ctx.fillRect(x + w / 2 - 2, y, 4, h);
        
        // Flag
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.moveTo(x + w / 2 + 2, y);
        ctx.lineTo(x + w / 2 + 20, y + 10);
        ctx.lineTo(x + w / 2 + 2, y + 20);
        ctx.closePath();
        ctx.fill();
        break;

      case "spawn":
        // Player spawn indicator
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
        ctx.setLineDash([]);
        
        ctx.font = "16px system-ui";
        ctx.fillStyle = "#a855f7";
        ctx.textAlign = "center";
        ctx.fillText("🎮", x + w / 2, y + h / 2 + 6);
        break;

      case "hazard":
        // Draw hazard based on subtype
        if (obj.subtype === "spike") {
          ctx.fillStyle = "#ef4444";
          for (let i = 0; i < obj.width; i++) {
            ctx.beginPath();
            ctx.moveTo(x + i * tileSize, y + h);
            ctx.lineTo(x + i * tileSize + tileSize / 2, y);
            ctx.lineTo(x + (i + 1) * tileSize, y + h);
            ctx.closePath();
            ctx.fill();
          }
        } else if (obj.subtype === "lava") {
          ctx.fillStyle = "#f97316";
          ctx.fillRect(x, y, w, h);
          // Lava bubbles
          ctx.fillStyle = "#fbbf24";
          for (let i = 0; i < 3; i++) {
            const bx = x + (i + 0.5) * (w / 3);
            const by = y + Math.sin(Date.now() / 300 + i) * 3 + h / 2;
            ctx.beginPath();
            ctx.arc(bx, by, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (obj.subtype === "water") {
          ctx.fillStyle = "rgba(59, 130, 246, 0.6)";
          ctx.fillRect(x, y, w, h);
        }
        break;

      case "decoration":
        ctx.font = `${Math.min(tileSize * 0.8, 20)}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const decoIcon = obj.subtype ? (OBJECT_ICONS[`decoration_${obj.subtype}`] || "🌿") : "🌿";
        ctx.fillText(decoIcon, x + w / 2, y + h / 2);
        break;

      case "powerup":
        // Draw glowing box
        const powerupColor = obj.subtype ? POWERUP_COLORS[obj.subtype] || "#a855f7" : "#a855f7";
        const glowPulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
        
        // Outer glow
        ctx.fillStyle = powerupColor + "40";
        ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
        
        // Main box with gradient effect
        ctx.fillStyle = powerupColor;
        ctx.fillRect(x, y, w, h);
        
        // Highlight
        ctx.fillStyle = `rgba(255, 255, 255, ${glowPulse * 0.5})`;
        ctx.fillRect(x + 2, y + 2, w - 4, 6);
        
        // Question mark box style
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
        
        // Icon
        const powerupIcon = obj.subtype ? (OBJECT_ICONS[`powerup_${obj.subtype}`] || "⚡") : "⚡";
        ctx.font = `${Math.min(tileSize * 0.7, 18)}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.fillText(powerupIcon, x + w / 2, y + h / 2);
        break;
    }

    // Selection highlight
    if (isSelected) {
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 3;
      ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);
    }
  };

  useEffect(() => {
    draw();
    // Animation frame for animated objects
    const frame = requestAnimationFrame(() => draw());
    return () => cancelAnimationFrame(frame);
  }, [draw]);

  // Continuously redraw for animations
  useEffect(() => {
    const interval = setInterval(draw, 100);
    return () => clearInterval(interval);
  }, [draw]);

  const getTileCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;
    
    const x = Math.floor((e.clientX - rect.left) * scaleX / tileSize);
    const y = Math.floor((e.clientY - rect.top) * scaleY / tileSize);
    
    if (x >= 0 && x < width && y >= 0 && y < height) {
      return { x, y };
    }
    return null;
  }, [canvasWidth, canvasHeight, tileSize, width, height]);

  const getObjectAt = useCallback((x: number, y: number): LevelObject | null => {
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      if (x >= obj.x && x < obj.x + obj.width && y >= obj.y && y < obj.y + obj.height) {
        return obj;
      }
    }
    return null;
  }, [objects]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1 || (e.button === 0 && selectedTool === "pan")) {
      setIsPanning(true);
      setLastPanPos({ x: e.clientX, y: e.clientY });
      return;
    }

    const coords = getTileCoords(e);
    if (!coords) return;

    if (e.button === 2) {
      const obj = getObjectAt(coords.x, coords.y);
      if (obj) onObjectDelete?.(obj.id);
      return;
    }

    if (selectedTool === "select") {
      const obj = getObjectAt(coords.x, coords.y);
      onObjectSelect?.(obj);
      if (obj) {
        setDraggedObject(obj);
        setDragOffset({ x: coords.x - obj.x, y: coords.y - obj.y });
      }
    } else if (selectedTool === "place" && selectedObjectType) {
      const existing = getObjectAt(coords.x, coords.y);
      if (!existing) {
        const [type, subtype] = selectedObjectType.split("_");
        onObjectPlace?.(coords.x, coords.y, type, subtype);
      }
    } else if (selectedTool === "erase") {
      const obj = getObjectAt(coords.x, coords.y);
      if (obj) onObjectDelete?.(obj.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      const dx = e.clientX - lastPanPos.x;
      const dy = e.clientY - lastPanPos.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPanPos({ x: e.clientX, y: e.clientY });
      return;
    }

    const coords = getTileCoords(e);
    setHoverTile(coords);
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    
    if (draggedObject && hoverTile) {
      onObjectMove?.(draggedObject.id, hoverTile.x - dragOffset.x, hoverTile.y - dragOffset.y);
    }
    setDraggedObject(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className="relative" ref={containerRef}>
      {/* Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 bg-slate-800/90 rounded-lg p-1">
        <button
          onClick={() => setZoom(z => Math.min(z * 1.2, 2))}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z / 1.2, 0.5))}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded"
          title="Reset View"
        >
          <Move className="w-4 h-4" />
        </button>
      </div>

      {/* Coordinates */}
      {hoverTile && (
        <div className="absolute bottom-2 left-2 z-10 bg-slate-800/90 text-white/70 text-xs px-2 py-1 rounded">
          ({hoverTile.x}, {hoverTile.y})
        </div>
      )}

      {/* Canvas - fixed size container with scrollbars for larger levels */}
      <div 
        className="overflow-auto rounded-xl border-2 border-slate-700 bg-slate-900"
        style={{ 
          height: "500px",
          width: "800px",
        }}
      >
        <div style={{ 
          width: canvasWidth * zoom, 
          height: canvasHeight * zoom,
          minWidth: "100%",
          minHeight: "100%",
        }}>
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className={`${selectedTool === "pan" ? "cursor-grab" : selectedTool === "erase" ? "cursor-crosshair" : "cursor-cell"}`}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              imageRendering: "pixelated",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { setHoverTile(null); setDraggedObject(null); }}
            onContextMenu={handleContextMenu}
          />
        </div>
      </div>
    </div>
  );
}


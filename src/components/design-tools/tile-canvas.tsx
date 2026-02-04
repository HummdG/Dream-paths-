"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { ZoomIn, ZoomOut, Move, Hand } from "lucide-react";

export interface TileObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data?: Record<string, unknown>;
}

interface TileCanvasProps {
  width: number;  // Canvas width in tiles
  height: number; // Canvas height in tiles
  tileSize: number; // Size of each tile in pixels
  objects: TileObject[];
  selectedTool?: string;
  selectedObjectType?: string;
  onObjectPlace?: (x: number, y: number, type: string) => void;
  onObjectMove?: (id: string, x: number, y: number) => void;
  onObjectDelete?: (id: string) => void;
  onObjectSelect?: (object: TileObject | null) => void;
  gridColor?: string;
  backgroundColor?: string;
  renderTile?: (object: TileObject, ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => void;
}

const DEFAULT_TILE_COLORS: Record<string, string> = {
  platform: "#4a5568",
  ground: "#68d391",
  spike: "#fc8181",
  lava: "#f6ad55",
  water: "#63b3ed",
  coin: "#fbd38d",
  enemy: "#fc8181",
  goal: "#68d391",
  spawn: "#9f7aea",
  decoration: "#a0aec0",
};

export function TileCanvas({
  width,
  height,
  tileSize,
  objects,
  selectedTool = "place",
  selectedObjectType,
  onObjectPlace,
  onObjectMove,
  onObjectDelete,
  onObjectSelect,
  gridColor = "rgba(255, 255, 255, 0.1)",
  backgroundColor = "#1a202c",
  renderTile,
}: TileCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPos, setLastPanPos] = useState({ x: 0, y: 0 });
  const [selectedObject, setSelectedObject] = useState<TileObject | null>(null);
  const [draggedObject, setDraggedObject] = useState<TileObject | null>(null);
  const [hoverTile, setHoverTile] = useState<{ x: number; y: number } | null>(null);

  const canvasWidth = width * tileSize;
  const canvasHeight = height * tileSize;

  // Default tile renderer
  const defaultRenderTile = useCallback((
    object: TileObject,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) => {
    const color = DEFAULT_TILE_COLORS[object.type] || "#718096";
    
    ctx.fillStyle = color;
    ctx.fillRect(x, y, object.width * size, object.height * size);
    
    // Add a slight border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, object.width * size, object.height * size);
    
    // Draw icon/label for certain types
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = `${Math.min(12, size * 0.6)}px system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    const icons: Record<string, string> = {
      spawn: "🎮",
      goal: "🚩",
      coin: "🪙",
      enemy: "👾",
      spike: "⚠️",
    };
    
    if (icons[object.type]) {
      ctx.font = `${Math.min(20, size * 0.8)}px system-ui`;
      ctx.fillText(icons[object.type], x + (object.width * size) / 2, y + (object.height * size) / 2);
    }
  }, []);

  // Draw the canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid
    ctx.strokeStyle = gridColor;
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

    // Draw objects
    for (const object of objects) {
      const render = renderTile || defaultRenderTile;
      render(object, ctx, object.x * tileSize, object.y * tileSize, tileSize);
      
      // Highlight selected object
      if (selectedObject?.id === object.id) {
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 3;
        ctx.strokeRect(
          object.x * tileSize - 1,
          object.y * tileSize - 1,
          object.width * tileSize + 2,
          object.height * tileSize + 2
        );
      }
    }

    // Draw hover preview for placement
    if (hoverTile && selectedTool === "place" && selectedObjectType) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
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
      const render = renderTile || defaultRenderTile;
      render(draggedObject, ctx, hoverTile.x * tileSize, hoverTile.y * tileSize, tileSize);
      ctx.globalAlpha = 1;
    }
  }, [
    objects, width, height, tileSize, canvasWidth, canvasHeight,
    gridColor, backgroundColor, selectedObject, hoverTile,
    selectedTool, selectedObjectType, draggedObject, renderTile, defaultRenderTile
  ]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Get tile coordinates from mouse event
  const getTileCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;
    
    const x = Math.floor(((e.clientX - rect.left) * scaleX - pan.x) / tileSize / zoom);
    const y = Math.floor(((e.clientY - rect.top) * scaleY - pan.y) / tileSize / zoom);
    
    if (x >= 0 && x < width && y >= 0 && y < height) {
      return { x, y };
    }
    return null;
  }, [canvasWidth, canvasHeight, pan, tileSize, zoom, width, height]);

  // Find object at coordinates
  const getObjectAt = useCallback((x: number, y: number): TileObject | null => {
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      if (
        x >= obj.x && x < obj.x + obj.width &&
        y >= obj.y && y < obj.y + obj.height
      ) {
        return obj;
      }
    }
    return null;
  }, [objects]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1 || (e.button === 0 && selectedTool === "pan")) {
      // Middle click or pan tool - start panning
      setIsPanning(true);
      setLastPanPos({ x: e.clientX, y: e.clientY });
      return;
    }

    const coords = getTileCoords(e);
    if (!coords) return;

    if (e.button === 2) {
      // Right click - delete
      const obj = getObjectAt(coords.x, coords.y);
      if (obj) {
        onObjectDelete?.(obj.id);
      }
      return;
    }

    if (selectedTool === "select") {
      const obj = getObjectAt(coords.x, coords.y);
      setSelectedObject(obj);
      onObjectSelect?.(obj);
      if (obj) {
        setDraggedObject(obj);
      }
    } else if (selectedTool === "place" && selectedObjectType) {
      // Check if tile is empty
      const existing = getObjectAt(coords.x, coords.y);
      if (!existing) {
        onObjectPlace?.(coords.x, coords.y, selectedObjectType);
      }
    } else if (selectedTool === "erase") {
      const obj = getObjectAt(coords.x, coords.y);
      if (obj) {
        onObjectDelete?.(obj.id);
      }
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

    if (draggedObject && coords) {
      // Preview drag position
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPanning(false);

    if (draggedObject && hoverTile) {
      onObjectMove?.(draggedObject.id, hoverTile.x, hoverTile.y);
      setDraggedObject(null);
    }
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
    setHoverTile(null);
    setDraggedObject(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 bg-slate-800/80 rounded-lg p-1">
        <button
          onClick={handleZoomIn}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
          title="Reset View"
        >
          <Move className="w-4 h-4" />
        </button>
      </div>

      {/* Coordinates display */}
      {hoverTile && (
        <div className="absolute bottom-2 left-2 z-10 bg-slate-800/80 text-white/70 text-xs px-2 py-1 rounded">
          ({hoverTile.x}, {hoverTile.y})
        </div>
      )}

      {/* Canvas */}
      <div 
        className="overflow-hidden rounded-xl border-2 border-slate-700"
        style={{ 
          width: canvasWidth * zoom,
          height: canvasHeight * zoom,
          maxWidth: "100%",
          maxHeight: "100%"
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="cursor-crosshair"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "top left",
            imageRendering: "pixelated",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onContextMenu={handleContextMenu}
        />
      </div>
    </div>
  );
}



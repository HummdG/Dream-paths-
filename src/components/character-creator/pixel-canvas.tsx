"use client";

import { useCallback, useRef, useState, useEffect } from "react";

interface PixelCanvasProps {
  size: number; // Grid size (e.g., 16 for 16x16)
  pixelSize: number; // Size of each pixel in pixels
  pixels: string[][];
  onPixelChange: (x: number, y: number, color: string) => void;
  currentColor: string;
  tool: "draw" | "erase" | "fill";
}

export function PixelCanvas({
  size,
  pixelSize,
  pixels,
  onPixelChange,
  currentColor,
  tool,
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPixel, setLastPixel] = useState<{ x: number; y: number } | null>(null);

  // Draw the entire canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid background pattern (checkerboard for transparency)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const isEven = (x + y) % 2 === 0;
        ctx.fillStyle = isEven ? "#f0f0f0" : "#e0e0e0";
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    // Draw pixels
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const color = pixels[y]?.[x];
        if (color && color !== "transparent") {
          ctx.fillStyle = color;
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    }

    // Draw grid lines
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= size; i++) {
      ctx.beginPath();
      ctx.moveTo(i * pixelSize, 0);
      ctx.lineTo(i * pixelSize, size * pixelSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * pixelSize);
      ctx.lineTo(size * pixelSize, i * pixelSize);
      ctx.stroke();
    }
  }, [pixels, size, pixelSize]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const getPixelCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);
    if (x >= 0 && x < size && y >= 0 && y < size) {
      return { x, y };
    }
    return null;
  };

  const handlePixel = (coords: { x: number; y: number } | null) => {
    if (!coords) return;
    const { x, y } = coords;

    // Skip if same pixel as last one (while dragging)
    if (lastPixel && lastPixel.x === x && lastPixel.y === y) return;
    setLastPixel(coords);

    if (tool === "draw") {
      onPixelChange(x, y, currentColor);
    } else if (tool === "erase") {
      onPixelChange(x, y, "transparent");
    } else if (tool === "fill") {
      // Flood fill
      const targetColor = pixels[y]?.[x] || "transparent";
      if (targetColor !== currentColor) {
        floodFill(x, y, targetColor, currentColor);
      }
    }
  };

  const floodFill = (startX: number, startY: number, targetColor: string, fillColor: string) => {
    const stack: [number, number][] = [[startX, startY]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;

      if (visited.has(key)) continue;
      if (x < 0 || x >= size || y < 0 || y >= size) continue;

      const currentPixelColor = pixels[y]?.[x] || "transparent";
      if (currentPixelColor !== targetColor) continue;

      visited.add(key);
      onPixelChange(x, y, fillColor);

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    setLastPixel(null);
    handlePixel(getPixelCoords(e));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    handlePixel(getPixelCoords(e));
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastPixel(null);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
    setLastPixel(null);
  };

  return (
    <canvas
      ref={canvasRef}
      width={size * pixelSize}
      height={size * pixelSize}
      className="rounded-xl cursor-crosshair shadow-lg border-4 border-white"
      style={{ imageRendering: "pixelated" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    />
  );
}







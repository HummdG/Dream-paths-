"use client";

import { useState, useEffect, useMemo } from "react";

interface SpritePreviewProps {
  pixels: string[][];
  scale?: number;
  showGrid?: boolean;
  animated?: boolean;
  animationFrames?: string[][][]; // Multiple frames for animation
  frameRate?: number;
  className?: string;
  backgroundColor?: string;
}

export function SpritePreview({
  pixels,
  scale = 1,
  showGrid = false,
  animated = false,
  animationFrames,
  frameRate = 4,
  className = "",
  backgroundColor = "transparent",
}: SpritePreviewProps) {
  const gridSize = pixels.length;
  const pixelSize = scale * 3; // Base pixel size multiplied by scale

  // For animated sprites, cycle through frames
  const [currentFrame, setCurrentFrame] = useMemo(() => {
    if (!animated || !animationFrames || animationFrames.length === 0) {
      return [pixels, () => {}] as const;
    }
    
    let frameIndex = 0;
    const interval = setInterval(() => {
      frameIndex = (frameIndex + 1) % animationFrames.length;
    }, 1000 / frameRate);
    
    return [animationFrames[frameIndex] || pixels, () => clearInterval(interval)] as const;
  }, [animated, animationFrames, frameRate, pixels]);

  const displayPixels = animated && animationFrames ? currentFrame : pixels;

  return (
    <div
      className={`inline-block ${className}`}
      style={{
        backgroundColor,
        borderRadius: "8px",
        padding: scale > 1 ? "8px" : "4px",
      }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${pixelSize}px)`,
          gap: showGrid ? "1px" : 0,
          imageRendering: "pixelated",
        }}
      >
        {displayPixels.map((row, y) =>
          row.map((color, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: color === "transparent" ? "transparent" : color,
                boxShadow: showGrid ? "inset 0 0 0 0.5px rgba(255,255,255,0.1)" : "none",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Preset component for showing sprite at different scales
interface SpriteScalesPreviewProps {
  pixels: string[][];
  scales?: number[];
  className?: string;
}

export function SpriteScalesPreview({
  pixels,
  scales = [1, 2, 4],
  className = "",
}: SpriteScalesPreviewProps) {
  return (
    <div className={`flex items-end gap-4 ${className}`}>
      {scales.map((scale) => (
        <div key={scale} className="text-center">
          <SpritePreview
            pixels={pixels}
            scale={scale}
            backgroundColor="rgba(255, 255, 255, 0.05)"
          />
          <p className="text-xs text-slate-400 mt-1">{scale}x</p>
        </div>
      ))}
    </div>
  );
}

// Component to show a sprite with animation preview
interface AnimatedSpritePreviewProps {
  frames: string[][][];
  scale?: number;
  frameRate?: number;
  showControls?: boolean;
  className?: string;
}

export function AnimatedSpritePreview({
  frames,
  scale = 2,
  frameRate = 4,
  showControls = true,
  className = "",
}: AnimatedSpritePreviewProps) {
  const gridSize = frames[0]?.length || 16;
  const pixelSize = scale * 3;

  // Simple frame cycling with state
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || frames.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
    }, 1000 / frameRate);
    
    return () => clearInterval(interval);
  }, [isPlaying, frames.length, frameRate]);

  const currentFrame = frames[currentFrameIndex] || frames[0];

  return (
    <div className={`inline-block ${className}`}>
      <div
        className="bg-slate-800/50 rounded-lg p-3"
        style={{ imageRendering: "pixelated" }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, ${pixelSize}px)`,
          }}
        >
          {currentFrame.map((row, y) =>
            row.map((color, x) => (
              <div
                key={`${x}-${y}`}
                style={{
                  width: pixelSize,
                  height: pixelSize,
                  backgroundColor: color === "transparent" ? "transparent" : color,
                }}
              />
            ))
          )}
        </div>
      </div>
      
      {showControls && frames.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-xs px-2 py-1 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <span className="text-xs text-slate-400">
            Frame {currentFrameIndex + 1}/{frames.length}
          </span>
        </div>
      )}
    </div>
  );
}



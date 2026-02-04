"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Square, RotateCcw, Maximize2, Minimize2 } from "lucide-react";

interface Sprite {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  velocityX: number;
  velocityY: number;
  isPlayer: boolean;
  type: "player" | "platform" | "coin" | "enemy" | "custom";
}

interface GameState {
  sprites: Sprite[];
  score: number;
  lives: number;
  gravity: number;
  isRunning: boolean;
  backgroundColor: string;
}

interface GameCanvasProps {
  code: string;
  autoRun?: boolean;
  height?: string;
}

// Game engine that interprets Python-like commands
class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  state: GameState;
  keysPressed: Set<string>;
  animationId: number | null;
  onStateChange: (state: GameState) => void;

  constructor(canvas: HTMLCanvasElement, onStateChange: (state: GameState) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.onStateChange = onStateChange;
    this.keysPressed = new Set();
    this.animationId = null;
    this.state = this.getInitialState();

    // Key listeners
    window.addEventListener("keydown", (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", " "].includes(e.key)) {
        e.preventDefault();
        this.keysPressed.add(e.key === " " ? "Space" : e.key);
      }
    });
    window.addEventListener("keyup", (e) => {
      this.keysPressed.delete(e.key === " " ? "Space" : e.key);
    });
  }

  getInitialState(): GameState {
    return {
      sprites: [],
      score: 0,
      lives: 3,
      gravity: 0.5,
      isRunning: false,
      backgroundColor: "#87CEEB", // Sky blue
    };
  }

  reset() {
    this.state = this.getInitialState();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.render();
    this.onStateChange(this.state);
  }

  // API methods that kids can call from Python
  createPlayer(x: number, y: number, width: number, height: number, color: string) {
    const player: Sprite = {
      id: "player",
      x, y, width, height, color,
      velocityX: 0,
      velocityY: 0,
      isPlayer: true,
      type: "player",
    };
    this.state.sprites = this.state.sprites.filter(s => s.id !== "player");
    this.state.sprites.push(player);
    this.onStateChange(this.state);
    return player;
  }

  createPlatform(x: number, y: number, width: number, height: number, color: string) {
    const platform: Sprite = {
      id: `platform_${Date.now()}_${Math.random()}`,
      x, y, width, height, color,
      velocityX: 0,
      velocityY: 0,
      isPlayer: false,
      type: "platform",
    };
    this.state.sprites.push(platform);
    this.onStateChange(this.state);
    return platform;
  }

  createCoin(x: number, y: number) {
    const coin: Sprite = {
      id: `coin_${Date.now()}_${Math.random()}`,
      x, y, width: 20, height: 20, color: "#FFD700",
      velocityX: 0,
      velocityY: 0,
      isPlayer: false,
      type: "coin",
    };
    this.state.sprites.push(coin);
    this.onStateChange(this.state);
    return coin;
  }

  setGravity(gravity: number) {
    this.state.gravity = gravity;
  }

  setBackgroundColor(color: string) {
    this.state.backgroundColor = color;
    this.render();
  }

  // Game loop
  start() {
    if (this.state.isRunning) return;
    this.state.isRunning = true;
    this.onStateChange(this.state);
    this.gameLoop();
  }

  stop() {
    this.state.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.onStateChange(this.state);
  }

  gameLoop() {
    if (!this.state.isRunning) return;

    this.update();
    this.render();

    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    const player = this.state.sprites.find(s => s.isPlayer);
    if (!player) return;

    // Handle input
    const speed = 5;
    const jumpForce = 12;

    if (this.keysPressed.has("ArrowLeft")) {
      player.velocityX = -speed;
    } else if (this.keysPressed.has("ArrowRight")) {
      player.velocityX = speed;
    } else {
      player.velocityX = 0;
    }

    // Check if on ground
    const onGround = this.isOnGround(player);

    if ((this.keysPressed.has("ArrowUp") || this.keysPressed.has("Space")) && onGround) {
      player.velocityY = -jumpForce;
    }

    // Apply gravity
    player.velocityY += this.state.gravity;

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Platform collisions
    this.state.sprites.filter(s => s.type === "platform").forEach(platform => {
      if (this.checkCollision(player, platform)) {
        // Landing on top of platform
        if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y) {
          player.y = platform.y - player.height;
          player.velocityY = 0;
        }
        // Hitting bottom of platform
        else if (player.velocityY < 0 && player.y - player.velocityY >= platform.y + platform.height) {
          player.y = platform.y + platform.height;
          player.velocityY = 0;
        }
        // Hitting sides
        else if (player.velocityX > 0) {
          player.x = platform.x - player.width;
        } else if (player.velocityX < 0) {
          player.x = platform.x + platform.width;
        }
      }
    });

    // Coin collection
    this.state.sprites.filter(s => s.type === "coin").forEach(coin => {
      if (this.checkCollision(player, coin)) {
        this.state.sprites = this.state.sprites.filter(s => s.id !== coin.id);
        this.state.score += 10;
        this.onStateChange(this.state);
      }
    });

    // Keep player in bounds
    player.x = Math.max(0, Math.min(this.canvas.width - player.width, player.x));
    
    // Ground collision (bottom of canvas)
    if (player.y + player.height > this.canvas.height) {
      player.y = this.canvas.height - player.height;
      player.velocityY = 0;
    }
  }

  isOnGround(sprite: Sprite): boolean {
    // Check canvas floor
    if (sprite.y + sprite.height >= this.canvas.height) return true;

    // Check platforms
    return this.state.sprites.filter(s => s.type === "platform").some(platform => {
      return (
        sprite.x < platform.x + platform.width &&
        sprite.x + sprite.width > platform.x &&
        sprite.y + sprite.height >= platform.y &&
        sprite.y + sprite.height <= platform.y + 5
      );
    });
  }

  checkCollision(a: Sprite, b: Sprite): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  render() {
    // Clear and fill background
    this.ctx.fillStyle = this.state.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw all sprites
    this.state.sprites.forEach(sprite => {
      if (sprite.type === "coin") {
        // Draw coin as circle
        this.ctx.beginPath();
        this.ctx.arc(
          sprite.x + sprite.width / 2,
          sprite.y + sprite.height / 2,
          sprite.width / 2,
          0,
          Math.PI * 2
        );
        this.ctx.fillStyle = sprite.color;
        this.ctx.fill();
        this.ctx.strokeStyle = "#B8860B";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      } else {
        // Draw as rectangle with rounded corners
        this.ctx.fillStyle = sprite.color;
        this.ctx.beginPath();
        const radius = sprite.type === "player" ? 8 : 4;
        this.ctx.roundRect(sprite.x, sprite.y, sprite.width, sprite.height, radius);
        this.ctx.fill();
      }
    });

    // Draw score
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "rgba(0,0,0,0.3)";
    this.ctx.lineWidth = 3;
    this.ctx.font = "bold 20px Nunito, sans-serif";
    const scoreText = `Score: ${this.state.score}`;
    this.ctx.strokeText(scoreText, 15, 30);
    this.ctx.fillText(scoreText, 15, 30);
  }
}

export function GameCanvas({ code, autoRun = false, height = "300px" }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize engine
  useEffect(() => {
    if (!canvasRef.current) return;
    
    engineRef.current = new GameEngine(canvasRef.current, setGameState);
    engineRef.current.render();

    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, []);

  // Execute code when it changes
  const executeCode = useCallback(async () => {
    if (!engineRef.current) return;
    setError(null);

    const engine = engineRef.current;
    engine.reset();

    try {
      // @ts-expect-error - Pyodide loaded globally
      if (typeof window.pyodide === "undefined") {
        setError("Python is still loading...");
        return;
      }

      // @ts-expect-error - Pyodide loaded globally
      const pyodide = window.pyodide;

      // Create Python bindings for our game API
      pyodide.globals.set("__game_commands__", []);
      
      const setupCode = `
# Game API - These functions help you make your game!
def create_player(x, y, width=40, height=40, color="red"):
    """Create your player character at position (x, y)"""
    __game_commands__.append(("create_player", x, y, width, height, color))

def create_platform(x, y, width, height, color="green"):
    """Create a platform at position (x, y)"""
    __game_commands__.append(("create_platform", x, y, width, height, color))

def create_coin(x, y):
    """Create a collectible coin at position (x, y)"""
    __game_commands__.append(("create_coin", x, y))

def set_gravity(gravity):
    """Set how strong gravity is (0.5 is normal, higher = stronger)"""
    __game_commands__.append(("set_gravity", gravity))

def set_background(color):
    """Set the background color of your game"""
    __game_commands__.append(("set_background", color))
`;
      
      await pyodide.runPythonAsync(setupCode);
      await pyodide.runPythonAsync(code);

      // Get and execute commands
      const commands = pyodide.globals.get("__game_commands__").toJs();
      
      for (const cmd of commands) {
        const [action, ...args] = cmd;
        switch (action) {
          case "create_player":
            engine.createPlayer(args[0], args[1], args[2], args[3], args[4]);
            break;
          case "create_platform":
            engine.createPlatform(args[0], args[1], args[2], args[3], args[4]);
            break;
          case "create_coin":
            engine.createCoin(args[0], args[1]);
            break;
          case "set_gravity":
            engine.setGravity(args[0]);
            break;
          case "set_background":
            engine.setBackgroundColor(args[0]);
            break;
        }
      }

      engine.render();
      
      if (autoRun) {
        engine.start();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong!";
      setError(msg);
    }
  }, [code, autoRun]);

  // Run code on mount and when code changes
  useEffect(() => {
    const timer = setTimeout(executeCode, 100);
    return () => clearTimeout(timer);
  }, [executeCode]);

  const handleStart = () => {
    engineRef.current?.start();
  };

  const handleStop = () => {
    engineRef.current?.stop();
  };

  const handleReset = () => {
    executeCode();
  };

  return (
    <div className={`rounded-2xl overflow-hidden border-2 border-gray-200 bg-white shadow-lg ${isFullscreen ? "fixed inset-4 z-50" : ""}`}>
      {/* Canvas Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">🎮 Game Preview</span>
          {gameState && (
            <span className="bg-white/20 text-white text-sm px-2 py-0.5 rounded">
              Score: {gameState.score}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {gameState?.isRunning ? (
            <button
              onClick={handleStop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-all"
            >
              <Play className="w-4 h-4" />
              Play
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/20 text-white hover:bg-white/30 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium bg-white/20 text-white hover:bg-white/30 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-100 border-b-2 border-red-200 px-4 py-2 text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Canvas */}
      <div className="relative bg-slate-800" style={{ height: isFullscreen ? "calc(100% - 52px)" : height }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={isFullscreen ? 500 : 300}
          className="w-full h-full"
          style={{ imageRendering: "pixelated" }}
        />
        
        {/* Controls hint */}
        {!gameState?.isRunning && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-full">
            Press <kbd className="bg-white/20 px-2 py-0.5 rounded mx-1">Play</kbd> then use <kbd className="bg-white/20 px-2 py-0.5 rounded mx-1">← →</kbd> to move, <kbd className="bg-white/20 px-2 py-0.5 rounded mx-1">↑</kbd> or <kbd className="bg-white/20 px-2 py-0.5 rounded mx-1">Space</kbd> to jump
          </div>
        )}
      </div>
    </div>
  );
}



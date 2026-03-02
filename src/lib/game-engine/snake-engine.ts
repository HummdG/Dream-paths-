/**
 * Snake Game Engine
 *
 * Grid-based snake game on an 800×500 canvas (40 cols × 25 rows, 20px cells).
 * Exposed as window.snakeEngine so Python (via Pyodide) can control it.
 */

import type { GameEvent } from './types';

// =============================================================================
// TYPES
// =============================================================================

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface SnakeCell {
  x: number;
  y: number;
}

type TickCallback = () => void;
type KeyCallback = () => void;
type FoodCallback = () => void;
type GameOverCallback = () => void;

// =============================================================================
// ENGINE
// =============================================================================

const COLS = 40;
const ROWS = 25;
const CELL = 20; // px — matches level designer tile size
const CANVAS_W = 800;
const CANVAS_H = 500;
const DEFAULT_SPEED_MS = 200;

export class SnakeEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  // Game state
  private snake: SnakeCell[] = [];
  private food: SnakeCell = { x: 0, y: 0 };
  private direction: Direction = 'RIGHT';
  private nextDirection: Direction = 'RIGHT'; // buffer one input per tick
  private score = 0;
  private isRunning = false;
  private isGameOver = false;

  // Rendering options
  private snakeColor = '#4ade80'; // emerald-400
  private bgColor = '#0f172a'; // slate-950
  private overlayMessage = '';

  // Timing
  private speedMs = DEFAULT_SPEED_MS;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  // Callbacks
  private tickCallbacks: TickCallback[] = [];
  private keyCallbacks: Map<string, KeyCallback[]> = new Map();
  private foodCallbacks: FoodCallback[] = [];
  private gameOverCallbacks: GameOverCallback[] = [];

  // Keyboard listener bound reference (for cleanup)
  private boundKeyDown: ((e: KeyboardEvent) => void) | null = null;

  // Validation events
  private events: GameEvent[] = [];

  // ==========================================================================
  // PUBLIC: LIFECYCLE
  // ==========================================================================

  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    this.boundKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.boundKeyDown);

    this._initState();
    this._draw();
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isGameOver = false;
    this.intervalId = setInterval(() => this._tick(), this.speedMs);
  }

  pause(): void {
    this.isRunning = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  restart(): void {
    this.pause();
    this.isGameOver = false;
    this.overlayMessage = '';
    this.score = 0;
    this.direction = 'RIGHT';
    this.nextDirection = 'RIGHT';
    this._initState();
    this._draw();
  }

  destroy(): void {
    this.pause();
    if (this.boundKeyDown) {
      window.removeEventListener('keydown', this.boundKeyDown);
      this.boundKeyDown = null;
    }
    this.canvas = null;
    this.ctx = null;
  }

  // ==========================================================================
  // PUBLIC: STATE
  // ==========================================================================

  setDirection(dir: Direction): void {
    // Prevent reversing directly into itself
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT',
    };
    if (opposites[dir] !== this.direction) {
      this.nextDirection = dir;
    }
    this.events.push({ type: 'snake_direction_changed', direction: dir, timestamp: Date.now(), data: {} } as unknown as GameEvent);
  }

  getDirection(): string {
    return this.direction;
  }

  getScore(): number {
    return this.score;
  }

  getSnakeLength(): number {
    return this.snake.length;
  }

  getSnakeHead(): { x: number; y: number } {
    return { ...this.snake[0] };
  }

  getFoodPosition(): { x: number; y: number } {
    return { ...this.food };
  }

  // ==========================================================================
  // PUBLIC: DISPLAY
  // ==========================================================================

  setSnakeColor(color: string): void {
    this.snakeColor = color;
    this._draw();
  }

  setBackgroundColor(color: string): void {
    this.bgColor = color;
    this._draw();
  }

  setGameSpeed(ms: number): void {
    this.speedMs = ms;
    // If already running, restart the interval with the new speed
    if (this.isRunning) {
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
      }
      this.intervalId = setInterval(() => this._tick(), this.speedMs);
    }
  }

  showMessage(text: string): void {
    this.overlayMessage = text;
    this._draw();
  }

  // ==========================================================================
  // PUBLIC: CALLBACKS
  // ==========================================================================

  onTick(cb: TickCallback): void {
    this.tickCallbacks.push(cb);
  }

  onKeyDown(key: string, cb: KeyCallback): void {
    const k = key.toUpperCase();
    if (!this.keyCallbacks.has(k)) {
      this.keyCallbacks.set(k, []);
    }
    this.keyCallbacks.get(k)!.push(cb);
  }

  onFoodEaten(cb: FoodCallback): void {
    this.foodCallbacks.push(cb);
  }

  onGameOver(cb: GameOverCallback): void {
    this.gameOverCallbacks.push(cb);
  }

  clearCallbacks(): void {
    this.tickCallbacks = [];
    this.keyCallbacks = new Map();
    this.foodCallbacks = [];
    this.gameOverCallbacks = [];
  }

  // ==========================================================================
  // PUBLIC: VALIDATION
  // ==========================================================================

  getEvents(): GameEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }

  // ==========================================================================
  // PRIVATE: GAME LOGIC
  // ==========================================================================

  private _initState(): void {
    // Start snake in the middle, 3 segments long, moving right
    const startX = 20;
    const startY = 12;
    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];
    this._spawnFood();
  }

  private _spawnFood(): void {
    let pos: SnakeCell;
    do {
      pos = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
    } while (this.snake.some(s => s.x === pos.x && s.y === pos.y));
    this.food = pos;
  }

  private _tick(): void {
    if (!this.isRunning || this.isGameOver) return;

    // Apply buffered direction
    this.direction = this.nextDirection;

    // Compute new head
    const head = { ...this.snake[0] };
    switch (this.direction) {
      case 'UP':    head.y -= 1; break;
      case 'DOWN':  head.y += 1; break;
      case 'LEFT':  head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      this._triggerGameOver();
      return;
    }

    // Self collision
    if (this.snake.some(s => s.x === head.x && s.y === head.y)) {
      this._triggerGameOver();
      return;
    }

    // Move snake
    this.snake.unshift(head);

    // Check food
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 1;
      // Snake grows — don't pop tail
      this._spawnFood();
      this.events.push({ type: 'snake_food_eaten', score: this.score, timestamp: Date.now(), data: {} } as unknown as GameEvent);
      this.foodCallbacks.forEach(cb => { try { cb(); } catch { /* ignore python errors */ } });
    } else {
      this.snake.pop(); // Move by removing tail
    }

    // Fire tick callbacks
    this.tickCallbacks.forEach(cb => { try { cb(); } catch { /* ignore */ } });

    this._draw();
  }

  private _triggerGameOver(): void {
    this.isGameOver = true;
    this.isRunning = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.events.push({ type: 'snake_game_over', score: this.score, timestamp: Date.now(), data: {} } as unknown as GameEvent);
    this.gameOverCallbacks.forEach(cb => { try { cb(); } catch { /* ignore */ } });
    this._draw();
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const keyMap: Record<string, string> = {
      ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
      w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
      W: 'UP', S: 'DOWN', A: 'LEFT', D: 'RIGHT',
    };
    const mapped = keyMap[e.key];
    if (!mapped) return;

    // Don't steal arrow keys from text inputs / the code editor
    const target = e.target as HTMLElement;
    const inTextInput = target.tagName === 'TEXTAREA' || target.tagName === 'INPUT';
    if (!inTextInput) {
      e.preventDefault();
    }

    // Built-in direction steering — works even before Python registers callbacks
    // (mirrors what on_key_down handlers would do)
    if (this.isRunning) {
      this.setDirection(mapped as 'UP' | 'DOWN' | 'LEFT' | 'RIGHT');
    }

    // Also fire any Python-registered callbacks
    const cbs = this.keyCallbacks.get(mapped) ?? [];
    cbs.forEach(cb => { try { cb(); } catch { /* ignore */ } });
  }

  // ==========================================================================
  // PRIVATE: RENDERING
  // ==========================================================================

  private _draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    // Background
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Grid lines (subtle)
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, CANVAS_H);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(CANVAS_W, y * CELL);
      ctx.stroke();
    }

    // Food
    const fx = this.food.x * CELL;
    const fy = this.food.y * CELL;
    ctx.fillStyle = '#f87171'; // red-400
    ctx.beginPath();
    ctx.arc(fx + CELL / 2, fy + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Snake body
    this.snake.forEach((seg, i) => {
      const sx = seg.x * CELL;
      const sy = seg.y * CELL;
      const pad = 1;
      if (i === 0) {
        // Head — slightly brighter
        ctx.fillStyle = '#86efac'; // green-300
      } else {
        ctx.fillStyle = this.snakeColor;
      }
      ctx.beginPath();
      ctx.roundRect(sx + pad, sy + pad, CELL - pad * 2, CELL - pad * 2, 3);
      ctx.fill();
    });

    // Score HUD
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${this.score}`, 10, 22);
    ctx.textAlign = 'left';
    ctx.fillText(`Length: ${this.snake.length}`, 110, 22);

    // Overlay message
    if (this.overlayMessage) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, CANVAS_H / 2 - 40, CANVAS_W, 80);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.overlayMessage, CANVAS_W / 2, CANVAS_H / 2 + 8);
      ctx.textAlign = 'left';
    }

    // Game over overlay
    if (this.isGameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_W / 2, CANVAS_H / 2 - 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px monospace';
      ctx.fillText(`Final Score: ${this.score}`, CANVAS_W / 2, CANVAS_H / 2 + 20);
      ctx.textAlign = 'left';
    }
  }
}

// Singleton so the page can call resetSnakeEngine() between navigations
let _snakeEngineInstance: SnakeEngine | null = null;

export function resetSnakeEngine(): SnakeEngine {
  if (_snakeEngineInstance) {
    _snakeEngineInstance.destroy();
  }
  _snakeEngineInstance = new SnakeEngine();
  return _snakeEngineInstance;
}

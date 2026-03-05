/**
 * Rocket Game Engine
 *
 * Physics-based rocket simulation on an 800×500 canvas.
 * Black starfield background, planet arc at bottom, rocket that responds to thrust/direction.
 * Exposed as window.rocketEngine so Python (via Pyodide) can control it.
 */

import type { GameEvent } from './types';

// =============================================================================
// TYPES
// =============================================================================

type UpdateCallback = () => void;

// =============================================================================
// CONSTANTS
// =============================================================================

const CANVAS_W = 800;
const CANVAS_H = 500;
const TICK_MS = 50; // 20 fps physics
const PLANET_RADIUS = 600;
const ORBIT_ALTITUDE = 400; // km — event fires at this threshold
const MAX_ALTITUDE = 800;
const FUEL_DRAIN_RATE = 0.3; // per tick per 100 thrust

// =============================================================================
// ENGINE
// =============================================================================

export class RocketEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  // Physics state
  private altitude = 0; // km
  private thrust = 0;   // 0–100
  private direction = 90; // degrees — 90 = straight up
  private fuel = 100;
  private vy = 0; // vertical velocity km/tick
  private vx = 0; // horizontal velocity
  private rocketX = CANVAS_W / 2; // pixel X
  private orbitReachedFired = false;
  private launchFired = false;
  private isRunning = false;
  private isDestroyed = false;

  // Display
  private overlayMessage = '';
  private stars: { x: number; y: number; r: number }[] = [];

  // Timing
  private intervalId: ReturnType<typeof setInterval> | null = null;

  // Callbacks
  private updateCallbacks: UpdateCallback[] = [];

  // Events
  private events: GameEvent[] = [];

  // ==========================================================================
  // PUBLIC: LIFECYCLE
  // ==========================================================================

  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    this._generateStars();
    this._resetState();
    this._draw();
  }

  start(): void {
    if (this.isRunning || this.isDestroyed) return;
    this.isRunning = true;
    this.intervalId = setInterval(() => this._tick(), TICK_MS);
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
    this._resetState();
    this._draw();
  }

  destroy(): void {
    this.isDestroyed = true;
    this.pause();
    this.canvas = null;
    this.ctx = null;
  }

  // ==========================================================================
  // PUBLIC: PYTHON API SURFACE
  // ==========================================================================

  setThrust(power: number): void {
    this.thrust = Math.max(0, Math.min(100, power));
    this.events.push({ type: 'thrust_set', timestamp: Date.now(), data: { power: this.thrust } } as unknown as GameEvent);
  }

  setDirection(angle: number): void {
    this.direction = ((angle % 360) + 360) % 360;
    this.events.push({ type: 'direction_changed', timestamp: Date.now(), data: { angle: this.direction } } as unknown as GameEvent);
  }

  getAltitude(): number {
    return Math.round(this.altitude);
  }

  getFuel(): number {
    return Math.round(this.fuel);
  }

  showMessage(text: string): void {
    this.overlayMessage = String(text);
    this._draw();
  }

  onUpdate(cb: UpdateCallback): void {
    this.updateCallbacks.push(cb);
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

  clearCallbacks(): void {
    this.updateCallbacks = [];
  }

  // ==========================================================================
  // PRIVATE: GAME LOGIC
  // ==========================================================================

  private _resetState(): void {
    this.altitude = 0;
    this.thrust = 0;
    this.direction = 90;
    this.fuel = 100;
    this.vy = 0;
    this.vx = 0;
    this.rocketX = CANVAS_W / 2;
    this.orbitReachedFired = false;
    this.launchFired = false;
    this.overlayMessage = '';
    this.events = [];
  }

  private _generateStars(): void {
    this.stars = [];
    for (let i = 0; i < 120; i++) {
      this.stars.push({
        x: Math.random() * CANVAS_W,
        y: Math.random() * CANVAS_H,
        r: Math.random() * 1.5 + 0.3,
      });
    }
  }

  private _tick(): void {
    if (!this.isRunning) return;

    // Fire launch event once altitude > 0
    if (!this.launchFired && this.thrust > 0) {
      this.launchFired = true;
      this.events.push({ type: 'rocket_launched', timestamp: Date.now(), data: {} } as unknown as GameEvent);
    }

    // Apply thrust if fuel remains
    if (this.fuel > 0 && this.thrust > 0) {
      const rad = (this.direction - 90) * (Math.PI / 180);
      const thrustMag = this.thrust * 0.004;
      this.vx += Math.cos(rad) * thrustMag;
      this.vy += Math.sin(rad) * thrustMag;
      this.fuel = Math.max(0, this.fuel - (this.thrust / 100) * FUEL_DRAIN_RATE);
    }

    // Gravity (weakens with altitude)
    const grav = 0.06 * (1 - Math.min(this.altitude / MAX_ALTITUDE, 0.8));
    this.vy -= grav;

    // Update altitude (vy > 0 = going up)
    this.altitude = Math.max(0, this.altitude + this.vy);
    this.rocketX = Math.max(20, Math.min(CANVAS_W - 20, this.rocketX + this.vx * 30));

    // Cap altitude
    if (this.altitude > MAX_ALTITUDE) {
      this.altitude = MAX_ALTITUDE;
      this.vy = 0;
    }

    // Orbit reached event
    if (!this.orbitReachedFired && this.altitude >= ORBIT_ALTITUDE) {
      this.orbitReachedFired = true;
      this.events.push({ type: 'orbit_reached', timestamp: Date.now(), data: { altitude: this.altitude } } as unknown as GameEvent);
    }

    // Ground bounce — if rocket falls back to ground
    if (this.altitude <= 0 && this.vy < 0) {
      this.altitude = 0;
      this.vy = 0;
      this.vx = 0;
    }

    // Fire update callbacks
    this.updateCallbacks.forEach(cb => { try { cb(); } catch { /* ignore python errors */ } });

    this._draw();
  }

  // ==========================================================================
  // PRIVATE: RENDERING
  // ==========================================================================

  private _draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    // Background — space gradient
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    const altFrac = Math.min(this.altitude / MAX_ALTITUDE, 1);
    // Interpolate from deep blue (ground) to pure black (space)
    const r = Math.round(10 * (1 - altFrac));
    const g = Math.round(15 * (1 - altFrac));
    const b = Math.round(50 * (1 - altFrac) + 0);
    grad.addColorStop(0, `rgb(${r},${g},${b})`);
    grad.addColorStop(1, '#000005');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Stars
    this.stars.forEach(star => {
      const twinkle = 0.5 + 0.5 * Math.sin(Date.now() / 800 + star.x);
      ctx.fillStyle = `rgba(255,255,255,${(0.4 + 0.6 * altFrac) * twinkle})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Planet arc at bottom — becomes smaller as altitude increases
    const planetY = CANVAS_H + PLANET_RADIUS * 0.15 - altFrac * 80;
    ctx.fillStyle = '#1a6b3a';
    ctx.beginPath();
    ctx.arc(CANVAS_W / 2, planetY, PLANET_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    // Atmosphere glow
    const atmGrad = ctx.createRadialGradient(CANVAS_W / 2, planetY, PLANET_RADIUS - 20, CANVAS_W / 2, planetY, PLANET_RADIUS + 30);
    atmGrad.addColorStop(0, 'rgba(100,200,255,0.15)');
    atmGrad.addColorStop(1, 'rgba(100,200,255,0)');
    ctx.fillStyle = atmGrad;
    ctx.beginPath();
    ctx.arc(CANVAS_W / 2, planetY, PLANET_RADIUS + 30, 0, Math.PI * 2);
    ctx.fill();

    // Rocket position — maps altitude to canvas Y (high altitude = near top)
    const rocketY = CANVAS_H - 80 - (this.altitude / MAX_ALTITUDE) * (CANVAS_H - 120);

    // Rocket body
    const angle = ((this.direction - 90) * Math.PI) / 180;
    ctx.save();
    ctx.translate(this.rocketX, rocketY);
    ctx.rotate(angle);

    // Body
    ctx.fillStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose cone
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.moveTo(-8, -12);
    ctx.lineTo(8, -12);
    ctx.lineTo(0, -28);
    ctx.closePath();
    ctx.fill();

    // Fins
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.moveTo(-10, 16);
    ctx.lineTo(-18, 28);
    ctx.lineTo(-10, 22);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(10, 16);
    ctx.lineTo(18, 28);
    ctx.lineTo(10, 22);
    ctx.closePath();
    ctx.fill();

    // Flame if thrust active
    if (this.thrust > 0 && this.fuel > 0) {
      const flameLen = 12 + (this.thrust / 100) * 20;
      const flameGrad = ctx.createLinearGradient(0, 20, 0, 20 + flameLen);
      flameGrad.addColorStop(0, 'rgba(255,200,50,0.9)');
      flameGrad.addColorStop(0.5, 'rgba(255,100,20,0.7)');
      flameGrad.addColorStop(1, 'rgba(255,50,0,0)');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-6, 20);
      ctx.lineTo(6, 20);
      ctx.lineTo(0, 20 + flameLen);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();

    // HUD
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 180, 80);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Altitude: ${Math.round(this.altitude)} km`, 18, 30);
    ctx.fillText(`Fuel:     ${Math.round(this.fuel)}%`, 18, 48);
    ctx.fillText(`Thrust:   ${this.thrust}%`, 18, 66);
    ctx.fillText(`Dir:      ${Math.round(this.direction)}°`, 18, 84);

    // Orbit indicator
    if (this.altitude >= ORBIT_ALTITUDE) {
      ctx.fillStyle = 'rgba(250,204,21,0.9)';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('★ ORBIT REACHED ★', CANVAS_W / 2, 30);
    }

    // Overlay message
    if (this.overlayMessage) {
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(0, CANVAS_H / 2 - 35, CANVAS_W, 70);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.overlayMessage, CANVAS_W / 2, CANVAS_H / 2 + 8);
    }

    ctx.textAlign = 'left';
  }
}

// Singleton
let _rocketEngineInstance: RocketEngine | null = null;

export function resetRocketEngine(): RocketEngine {
  if (_rocketEngineInstance) {
    _rocketEngineInstance.destroy();
  }
  _rocketEngineInstance = new RocketEngine();
  return _rocketEngineInstance;
}

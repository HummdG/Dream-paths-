/**
 * Patient Monitor Engine
 *
 * Canvas 2D hospital monitor UI on 800×500.
 * Animated EKG waveform, vital readouts, alert banner, treatment log.
 * Exposed as window.patientEngine so Python (via Pyodide) can control it.
 */

import type { GameEvent } from './types';

// =============================================================================
// CONSTANTS
// =============================================================================

const CANVAS_W = 800;
const CANVAS_H = 500;
const TICK_MS = 50; // 20 fps

// Default vitals
const DEFAULT_HR = 72;
const DEFAULT_BP_SYS = 120;
const DEFAULT_BP_DIA = 80;
const DEFAULT_O2 = 98;

// =============================================================================
// TYPES
// =============================================================================

type ReadingCallback = (vitals: { heart_rate: number; blood_pressure: string; oxygen: number }) => void;

// =============================================================================
// ENGINE
// =============================================================================

export class PatientMonitorEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  // Vitals state
  private heartRate = DEFAULT_HR;
  private bpSys = DEFAULT_BP_SYS;
  private bpDia = DEFAULT_BP_DIA;
  private oxygen = DEFAULT_O2;

  // EKG waveform
  private ekgPhase = 0;
  private ekgBuffer: number[] = [];
  private ekgWidth = 380;

  // Display
  private alertMessage = '';
  private alertFlash = 0;
  private treatments: string[] = [];
  private isRunning = false;
  private isDestroyed = false;

  // Timing
  private intervalId: ReturnType<typeof setInterval> | null = null;

  // Callbacks
  private readingCallbacks: ReadingCallback[] = [];

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

  setHeartRate(bpm: number): void {
    this.heartRate = Math.max(0, Math.min(300, bpm));
    this.events.push({ type: 'vital_set', timestamp: Date.now(), data: { vital: 'heart_rate', value: this.heartRate } } as unknown as GameEvent);
    this._draw();
  }

  setBloodPressure(sys: number, dia: number): void {
    this.bpSys = Math.max(0, sys);
    this.bpDia = Math.max(0, dia);
    this.events.push({ type: 'vital_set', timestamp: Date.now(), data: { vital: 'blood_pressure', sys: this.bpSys, dia: this.bpDia } } as unknown as GameEvent);
    this._draw();
  }

  setOxygen(pct: number): void {
    this.oxygen = Math.max(0, Math.min(100, pct));
    this.events.push({ type: 'vital_set', timestamp: Date.now(), data: { vital: 'oxygen', value: this.oxygen } } as unknown as GameEvent);
    this._draw();
  }

  getReading(vital: string): number {
    switch (String(vital).toLowerCase()) {
      case 'heart_rate': return this.heartRate;
      case 'oxygen': return this.oxygen;
      case 'bp_sys': return this.bpSys;
      case 'bp_dia': return this.bpDia;
      default: return 0;
    }
  }

  showAlert(message: string): void {
    this.alertMessage = String(message);
    this.alertFlash = 10; // number of flashes
    this.events.push({ type: 'alert_triggered', timestamp: Date.now(), data: { message: this.alertMessage } } as unknown as GameEvent);
    this._draw();
  }

  addTreatment(name: string): void {
    this.treatments.unshift(String(name)); // newest first
    if (this.treatments.length > 5) this.treatments = this.treatments.slice(0, 5);
    this.events.push({ type: 'treatment_applied', timestamp: Date.now(), data: { treatment: name } } as unknown as GameEvent);

    // Check if patient is now stable (HR 60–100, O2 >= 95)
    if (this.heartRate >= 60 && this.heartRate <= 100 && this.oxygen >= 95) {
      this.events.push({ type: 'patient_stable', timestamp: Date.now(), data: {} } as unknown as GameEvent);
    }
    this._draw();
  }

  onReading(cb: ReadingCallback): void {
    this.readingCallbacks.push(cb);
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
    this.readingCallbacks = [];
  }

  // ==========================================================================
  // PRIVATE: LOGIC
  // ==========================================================================

  private _resetState(): void {
    this.heartRate = DEFAULT_HR;
    this.bpSys = DEFAULT_BP_SYS;
    this.bpDia = DEFAULT_BP_DIA;
    this.oxygen = DEFAULT_O2;
    this.ekgPhase = 0;
    this.ekgBuffer = [];
    this.alertMessage = '';
    this.alertFlash = 0;
    this.treatments = [];
    this.events = [];
  }

  private _tick(): void {
    if (!this.isRunning) return;

    // Advance EKG waveform
    const speed = (this.heartRate / 60) * 0.3;
    this.ekgPhase += speed;

    const sample = this._ekgSample(this.ekgPhase);
    this.ekgBuffer.push(sample);
    if (this.ekgBuffer.length > this.ekgWidth) {
      this.ekgBuffer.shift();
    }

    // Decrement alert flash counter
    if (this.alertFlash > 0) this.alertFlash -= 1;

    // Fire reading callbacks
    const vitals = {
      heart_rate: this.heartRate,
      blood_pressure: `${this.bpSys}/${this.bpDia}`,
      oxygen: this.oxygen,
    };
    this.readingCallbacks.forEach(cb => { try { cb(vitals); } catch { /* ignore */ } });

    this._draw();
  }

  private _ekgSample(phase: number): number {
    // Simplified EKG shape: mostly flat with a sharp QRS spike
    const p = phase % (Math.PI * 2);
    const t = p / (Math.PI * 2); // 0–1 within one beat

    if (t < 0.05) return Math.sin(t / 0.05 * Math.PI) * 8; // P wave
    if (t < 0.15) return 0;
    if (t < 0.17) return -15; // Q dip
    if (t < 0.20) return 50; // R peak
    if (t < 0.22) return -10; // S dip
    if (t < 0.35) return 0;
    if (t < 0.45) return Math.sin((t - 0.35) / 0.1 * Math.PI) * 12; // T wave
    return 0;
  }

  // ==========================================================================
  // PRIVATE: RENDERING
  // ==========================================================================

  private _draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    // Dark hospital monitor background
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Panel border
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, CANVAS_W - 2, CANVAS_H - 2);

    // Title bar
    ctx.fillStyle = '#0d2040';
    ctx.fillRect(0, 0, CANVAS_W, 36);
    ctx.fillStyle = '#7dd3fc';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('PATIENT MONITOR — DreamPaths Medical', 16, 23);

    // ── EKG Panel ──
    const ekgX = 20;
    const ekgY = 50;
    const ekgH = 130;

    ctx.fillStyle = '#050e1a';
    ctx.fillRect(ekgX, ekgY, this.ekgWidth, ekgH);
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 1;
    ctx.strokeRect(ekgX, ekgY, this.ekgWidth, ekgH);

    // EKG grid
    ctx.strokeStyle = 'rgba(0,200,100,0.08)';
    ctx.lineWidth = 0.5;
    for (let gx = ekgX; gx < ekgX + this.ekgWidth; gx += 20) {
      ctx.beginPath(); ctx.moveTo(gx, ekgY); ctx.lineTo(gx, ekgY + ekgH); ctx.stroke();
    }
    for (let gy = ekgY; gy < ekgY + ekgH; gy += 20) {
      ctx.beginPath(); ctx.moveTo(ekgX, gy); ctx.lineTo(ekgX + this.ekgWidth, gy); ctx.stroke();
    }

    // EKG label
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('ECG', ekgX + 6, ekgY + 14);

    // EKG waveform
    if (this.ekgBuffer.length > 1) {
      const midY = ekgY + ekgH / 2;
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      this.ekgBuffer.forEach((v, i) => {
        const px = ekgX + i;
        const py = midY - v;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    // ── Vital Readout Boxes ──
    this._drawVitalBox(ctx, ekgX + this.ekgWidth + 20, ekgY, 150, ekgH, '❤ HR', `${this.heartRate}`, 'bpm', this._hrColor());
    this._drawVitalBox(ctx, ekgX + this.ekgWidth + 190, ekgY, 150, ekgH, '⬆ BP', `${this.bpSys}/${this.bpDia}`, 'mmHg', '#7dd3fc');
    this._drawVitalBox(ctx, ekgX + this.ekgWidth + 360, ekgY, 90, ekgH, '○ O₂', `${this.oxygen}%`, '', this.oxygen >= 95 ? '#4ade80' : '#f87171');

    // ── Treatment Log ──
    const logX = 20;
    const logY = ekgY + ekgH + 20;
    const logW = CANVAS_W - 40;
    const logH = 120;
    ctx.fillStyle = '#050e1a';
    ctx.fillRect(logX, logY, logW, logH);
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 1;
    ctx.strokeRect(logX, logY, logW, logH);
    ctx.fillStyle = '#7dd3fc';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('Treatment Log', logX + 8, logY + 16);

    if (this.treatments.length === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '12px monospace';
      ctx.fillText('No treatments applied yet.', logX + 8, logY + 40);
    } else {
      this.treatments.forEach((t, i) => {
        ctx.fillStyle = i === 0 ? '#4ade80' : 'rgba(255,255,255,0.6)';
        ctx.font = `${i === 0 ? 'bold' : 'normal'} 12px monospace`;
        ctx.fillText(`• ${t}`, logX + 8, logY + 34 + i * 18);
      });
    }

    // ── Alert Banner ──
    const showAlert = this.alertMessage && this.alertFlash > 0;
    const alwaysAlert = this.alertMessage && this.alertFlash === 0;
    if (showAlert || alwaysAlert) {
      const flashOn = showAlert ? (this.alertFlash % 2 === 0) : true;
      if (flashOn) {
        ctx.fillStyle = showAlert ? 'rgba(220,38,38,0.85)' : 'rgba(220,38,38,0.6)';
        ctx.fillRect(0, logY + logH + 10, CANVAS_W, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`⚠ ALERT: ${this.alertMessage}`, CANVAS_W / 2, logY + logH + 42);
      }
    }

    ctx.textAlign = 'left';
  }

  private _hrColor(): string {
    if (this.heartRate > 100 || this.heartRate < 50) return '#f87171';
    return '#4ade80';
  }

  private _drawVitalBox(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    label: string, value: string, unit: string, color: string
  ): void {
    ctx.fillStyle = '#050e1a';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(label, x + 8, y + 16);

    ctx.fillStyle = color;
    ctx.font = 'bold 26px monospace';
    ctx.fillText(value, x + 8, y + h / 2 + 10);

    if (unit) {
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '10px monospace';
      ctx.fillText(unit, x + 8, y + h - 12);
    }
  }
}

// Singleton
let _patientEngineInstance: PatientMonitorEngine | null = null;

export function resetPatientEngine(): PatientMonitorEngine {
  if (_patientEngineInstance) {
    _patientEngineInstance.destroy();
  }
  _patientEngineInstance = new PatientMonitorEngine();
  return _patientEngineInstance;
}

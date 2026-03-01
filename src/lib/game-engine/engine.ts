/**
 * Platformer Game Engine
 * 
 * A simple canvas-based platformer engine for the kids coding platform.
 * Designed to be controlled by Python code via the API bridge.
 */

import {
  GameState,
  GameEvent,
  Player,
  Platform,
  Coin,
  Enemy,
  Goal,
  EngineCallbacks,
  ThemeAssets,
  UpdateCallback,
  KeyCallback
} from './types';

// Default theme assets (will be replaced with real assets)
const DEFAULT_THEME: ThemeAssets = {
  background: '#1a1a2e',
  platformTile: '#3a3a5e',
  playerSprites: { default: '#00ff88' },
  coinSprite: '#ffd700',
  goalSprite: '#00ffff',
  enemySprites: { slime: '#ff4444', bat: '#aa44ff', robot: '#888888' },
  colors: {
    primary: '#1a1a2e',
    secondary: '#16213e',
    accent: '#0f3460',
    text: '#ffffff'
  }
};

// Theme configurations
const THEMES: Record<string, ThemeAssets> = {
  space: {
    background: '#0d0d1a',
    platformTile: '#2a2a4a',
    playerSprites: { robot: '#00ff88', astronaut: '#ffffff', cat: '#ffaa00', knight: '#aaaaaa' },
    coinSprite: '#ffd700',
    goalSprite: '#00ffff',
    enemySprites: { slime: '#ff4444', bat: '#aa44ff', robot: '#666666' },
    colors: { primary: '#1a1a2e', secondary: '#16213e', accent: '#0f3460', text: '#ffffff' }
  },
  jungle: {
    background: '#1a2f1a',
    platformTile: '#4a7c40',
    playerSprites: { robot: '#00ff88', astronaut: '#ffffff', cat: '#ff8800', knight: '#8b4513' },
    coinSprite: '#ffd700',
    goalSprite: '#ff6600',
    enemySprites: { slime: '#44aa44', bat: '#663399', robot: '#556b2f' },
    colors: { primary: '#2d5a27', secondary: '#4a7c59', accent: '#8fc93a', text: '#ffffff' }
  },
  city: {
    background: '#1a1a2a',
    platformTile: '#666666',
    playerSprites: { robot: '#ff4444', astronaut: '#ffffff', cat: '#ff8800', knight: '#c0c0c0' },
    coinSprite: '#00ff00',
    goalSprite: '#ff0000',
    enemySprites: { slime: '#ff6600', bat: '#9932cc', robot: '#333333' },
    colors: { primary: '#2c3e50', secondary: '#34495e', accent: '#e74c3c', text: '#ffffff' }
  }
};

export class PlatformerEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private state: GameState;
  private callbacks: EngineCallbacks;
  private events: GameEvent[] = [];
  private animationFrame: number | null = null;
  private lastTime: number = 0;
  private theme: ThemeAssets = DEFAULT_THEME;
  
  // Custom player sprite (pixel art)
  private customPlayerPixels: string[][] | null = null;

  // Spawn point — updated by setSpawnPoint() so respawns use the level spawn, not the hardcoded default.
  private spawnX: number = 100;
  private spawnY: number = 300;

  // Canvas dimensions — must match the level designer's 25-row grid (25 * 20px = 500px).
  // The level designer uses tileSize=20, height=25 rows → 500px canvas height.
  private width: number = 800;
  private height: number = 500;

  constructor() {
    this.state = this.createInitialState();
    this.callbacks = {
      onUpdate: [],
      onKeyDown: new Map(),
      onKeyUp: new Map()
    };
  }

  private createInitialState(): GameState {
    return {
      player: {
        id: 'player',
        type: 'player',
        x: 100,
        y: 300,  // Start on ground
        width: 32,
        height: 48,
        vx: 0,
        vy: 0,
        sprite: 'robot',
        isOnGround: true,
        facingRight: true,
        active: true
      },
      // Default ground platform so player doesn't fall off
      platforms: [
        { id: 'ground', type: 'platform', x: 0, y: 360, width: 800, height: 40, active: true }
      ],
      coins: [],
      enemies: [],
      goal: null,
      score: 0,
      lives: 3,
      isRunning: false,
      isPaused: false,
      isGameOver: false,
      hasWon: false,
      theme: 'space',
      messageQueue: [],
      speechBubble: null,
      gravity: 0.8,
      keysPressed: new Set()
    };
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  public init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    
    // Set up keyboard listeners
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  public destroy(): void {
    this.stop();
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    this.canvas = null;
    this.ctx = null;
  }

  // ==========================================================================
  // GAME LOOP
  // ==========================================================================

  public start(): void {
    if (this.state.isRunning) return; // Prevent double animation loops
    this.state.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  public stop(): void {
    this.state.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  public pause(): void {
    this.state.isPaused = true;
  }

  public resume(): void {
    this.state.isPaused = false;
  }

  private gameLoop(): void {
    if (!this.state.isRunning) return;
    
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;
    
    if (!this.state.isPaused && !this.state.isGameOver && !this.state.hasWon) {
      this.update(deltaTime);
    }
    
    this.render();
    
    this.animationFrame = requestAnimationFrame(() => this.gameLoop());
  }

  private update(deltaTime: number): void {
    // Normalise to 60 fps so physics values (gravity, speed, etc.) feel the
    // same regardless of actual frame rate. Cap at 1/30 s to avoid large
    // tunnelling jumps if the tab was backgrounded.
    const frameScale = Math.min(deltaTime, 1 / 30) * 60;

    // Run user-defined update callbacks
    for (const callback of this.callbacks.onUpdate) {
      try {
        callback();
      } catch (e) {
        console.error('Update callback error:', e);
      }
    }

    // Apply gravity to player
    if (!this.state.player.isOnGround) {
      this.state.player.vy += this.state.gravity * frameScale;
    }

    // Apply player velocity
    this.state.player.x += this.state.player.vx * frameScale;
    this.state.player.y += this.state.player.vy * frameScale;

    // Check platform collisions (pass frameScale so tolerance scales correctly)
    this.checkPlatformCollisions(frameScale);

    // Update enemies
    this.updateEnemies(frameScale);

    // Clean up expired messages
    const now = Date.now();
    this.state.messageQueue = this.state.messageQueue.filter(
      msg => now - msg.createdAt < msg.duration
    );

    // Keep player in bounds
    this.state.player.x = Math.max(0, Math.min(this.width - this.state.player.width, this.state.player.x));

    // Check if player fell off the bottom
    if (this.state.player.y > this.height + 100) {
      this.playerDied();
    }
  }

  private checkPlatformCollisions(frameScale: number = 1): void {
    const player = this.state.player;
    let onGround = false;
    // Use the actual per-frame displacement as the landing tolerance so fast
    // falls don't tunnel through thin platforms.
    const tolerance = Math.abs(player.vy * frameScale) + 2;

    for (const platform of this.state.platforms) {
      // Check if player is falling onto platform
      if (player.vy >= 0 && // Moving down (or stationary)
          player.x + player.width > platform.x &&
          player.x < platform.x + platform.width &&
          player.y + player.height >= platform.y &&
          player.y + player.height <= platform.y + platform.height + tolerance) {
        // Land on platform
        player.y = platform.y - player.height;
        player.vy = 0;
        onGround = true;

        if (!player.isOnGround) {
          this.emitEvent('player_landed', { x: player.x, y: player.y });
        }
      }
    }

    player.isOnGround = onGround;
  }

  private updateEnemies(frameScale: number = 1): void {
    for (const enemy of this.state.enemies) {
      if (!enemy.active) continue;

      // Move enemy — scale by frameScale for frame-rate-independent speed
      enemy.x += enemy.speed * enemy.direction * frameScale;

      // Simple boundary detection
      if (enemy.x <= 0 || enemy.x >= this.width - enemy.width) {
        enemy.direction *= -1;
        this.emitEvent('enemy_direction_changed', { enemyId: enemy.id, direction: enemy.direction });
      }
    }
  }

  private playerDied(): void {
    this.state.lives--;
    this.emitEvent('collision', { type: 'death' });
    
    if (this.state.lives <= 0) {
      this.state.isGameOver = true;
      this.emitEvent('game_over', {});
    } else {
      this.resetPlayerPosition();
    }
  }

  private resetPlayerPosition(): void {
    this.state.player.x = this.spawnX;
    this.state.player.y = this.spawnY;
    this.state.player.vx = 0;
    this.state.player.vy = 0;
    this.state.player.isOnGround = false;
    this.emitEvent('level_restart', {});
  }

  // ==========================================================================
  // RENDERING
  // ==========================================================================

  private render(): void {
    if (!this.ctx || !this.canvas) return;
    
    const ctx = this.ctx;
    
    // Clear and draw background
    ctx.fillStyle = this.theme.background;
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw platforms
    ctx.fillStyle = this.theme.platformTile;
    for (const platform of this.state.platforms) {
      this.drawPlatform(ctx, platform);
    }
    
    // Draw coins
    for (const coin of this.state.coins) {
      if (!coin.collected) {
        this.drawCoin(ctx, coin);
      }
    }
    
    // Draw goal
    if (this.state.goal) {
      this.drawGoal(ctx, this.state.goal);
    }
    
    // Draw enemies
    for (const enemy of this.state.enemies) {
      if (enemy.active) {
        this.drawEnemy(ctx, enemy);
      }
    }
    
    // Draw player
    this.drawPlayer(ctx, this.state.player);
    
    // Draw speech bubble near player
    this.drawSpeechBubble(ctx);
    
    // Draw UI
    this.drawUI(ctx);
    
    // Draw messages
    this.drawMessages(ctx);
  }

  private drawPlatform(ctx: CanvasRenderingContext2D, platform: Platform): void {
    // Platform with a slight 3D effect
    ctx.fillStyle = this.theme.platformTile;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    
    // Top highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(platform.x, platform.y, platform.width, 4);
    
    // Bottom shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(platform.x, platform.y + platform.height - 4, platform.width, 4);
  }

  private drawCoin(ctx: CanvasRenderingContext2D, coin: Coin): void {
    // Animated coin (simple pulse)
    const pulse = Math.sin(Date.now() / 200) * 2;
    const radius = 12 + pulse;
    
    ctx.beginPath();
    ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, radius, 0, Math.PI * 2);
    ctx.fillStyle = this.theme.coinSprite;
    ctx.fill();
    
    // Inner highlight
    ctx.beginPath();
    ctx.arc(coin.x + coin.width / 2 - 3, coin.y + coin.height / 2 - 3, radius / 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
  }

  private drawGoal(ctx: CanvasRenderingContext2D, goal: Goal): void {
    // Flag pole
    ctx.fillStyle = '#888888';
    ctx.fillRect(goal.x + goal.width / 2 - 2, goal.y, 4, goal.height);
    
    // Flag (animated wave)
    const wave = Math.sin(Date.now() / 300) * 5;
    ctx.fillStyle = this.theme.goalSprite;
    ctx.beginPath();
    ctx.moveTo(goal.x + goal.width / 2 + 2, goal.y);
    ctx.lineTo(goal.x + goal.width / 2 + 30 + wave, goal.y + 15);
    ctx.lineTo(goal.x + goal.width / 2 + 2, goal.y + 30);
    ctx.closePath();
    ctx.fill();
  }

  private drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy): void {
    const spriteColor = this.theme.enemySprites[enemy.enemyType] || '#ff4444';
    
    // Simple enemy shape (will be replaced with sprites)
    ctx.fillStyle = spriteColor;
    
    if (enemy.enemyType === 'slime') {
      // Blob shape
      ctx.beginPath();
      ctx.ellipse(
        enemy.x + enemy.width / 2, 
        enemy.y + enemy.height * 0.7, 
        enemy.width / 2, 
        enemy.height / 3, 
        0, 0, Math.PI * 2
      );
      ctx.fill();
    } else if (enemy.enemyType === 'bat') {
      // Wing-like shape
      ctx.beginPath();
      ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 3, 0, Math.PI * 2);
      ctx.fill();
      // Wings
      const wingFlap = Math.sin(Date.now() / 100) * 5;
      ctx.beginPath();
      ctx.ellipse(enemy.x + 5, enemy.y + enemy.height / 2, 8, 4 + wingFlap, 0, 0, Math.PI * 2);
      ctx.ellipse(enemy.x + enemy.width - 5, enemy.y + enemy.height / 2, 8, 4 + wingFlap, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Default rectangle
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
    
    // Eyes
    ctx.fillStyle = '#ffffff';
    const eyeOffset = enemy.direction > 0 ? 5 : -5;
    ctx.beginPath();
    ctx.arc(enemy.x + enemy.width / 2 - 6 + eyeOffset, enemy.y + enemy.height / 3, 4, 0, Math.PI * 2);
    ctx.arc(enemy.x + enemy.width / 2 + 6 + eyeOffset, enemy.y + enemy.height / 3, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
    // If custom pixel art is available, draw it
    if (this.customPlayerPixels && this.customPlayerPixels.length > 0) {
      this.drawCustomPixelPlayer(ctx, player);
      return;
    }
    
    const spriteColor = this.theme.playerSprites[player.sprite] || this.theme.playerSprites.default || '#00ff88';
    
    // Body
    ctx.fillStyle = spriteColor;
    ctx.fillRect(player.x + 4, player.y + 12, player.width - 8, player.height - 16);
    
    // Head
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y + 12, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#ffffff';
    const eyeX = player.facingRight ? 4 : -4;
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2 - 4 + eyeX, player.y + 10, 3, 0, Math.PI * 2);
    ctx.arc(player.x + player.width / 2 + 4 + eyeX, player.y + 10, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2 - 4 + eyeX + 1, player.y + 10, 1.5, 0, Math.PI * 2);
    ctx.arc(player.x + player.width / 2 + 4 + eyeX + 1, player.y + 10, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Legs (animated when moving)
    const legOffset = player.vx !== 0 ? Math.sin(Date.now() / 100) * 4 : 0;
    ctx.fillStyle = spriteColor;
    ctx.fillRect(player.x + 8, player.y + player.height - 8, 6, 8 + legOffset);
    ctx.fillRect(player.x + player.width - 14, player.y + player.height - 8, 6, 8 - legOffset);
  }

  private drawCustomPixelPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
    if (!this.customPlayerPixels) return;
    
    const gridSize = this.customPlayerPixels.length; // Usually 16x16
    const pixelSize = Math.floor(player.height / gridSize); // Scale to fit player height
    const spriteWidth = gridSize * pixelSize;
    const spriteHeight = gridSize * pixelSize;
    
    // Center the sprite on the player position
    const startX = player.x + (player.width - spriteWidth) / 2;
    const startY = player.y + (player.height - spriteHeight) / 2;
    
    // Add a subtle bounce animation when moving
    const bounceOffset = player.vx !== 0 ? Math.sin(Date.now() / 100) * 2 : 0;
    
    // Draw each pixel
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const color = this.customPlayerPixels[y]?.[x];
        if (color && color !== 'transparent') {
          ctx.fillStyle = color;
          // Flip horizontally if facing left
          const drawX = player.facingRight 
            ? startX + x * pixelSize 
            : startX + (gridSize - 1 - x) * pixelSize;
          const drawY = startY + y * pixelSize + bounceOffset;
          ctx.fillRect(drawX, drawY, pixelSize, pixelSize);
        }
      }
    }
  }

  private drawUI(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.theme.colors.text;
    ctx.font = 'bold 20px system-ui, sans-serif';
    
    // Score
    ctx.fillText(`Score: ${this.state.score}`, 20, 35);
    
    // Lives
    ctx.fillText(`Lives: ${'❤️'.repeat(this.state.lives)}`, 20, 65);
    
    // Game over or win message
    if (this.state.isGameOver) {
      this.drawCenteredText(ctx, '💀 GAME OVER 💀', 48, this.theme.colors.accent);
      this.drawCenteredText(ctx, 'Press R to restart', 24, this.theme.colors.text, 50);
    } else if (this.state.hasWon) {
      this.drawCenteredText(ctx, '🎉 YOU WIN! 🎉', 48, '#00ff88');
    }
  }

  private drawMessages(ctx: CanvasRenderingContext2D): void {
    const now = Date.now();
    let yOffset = this.height / 2 - 50;
    
    for (const msg of this.state.messageQueue) {
      const age = now - msg.createdAt;
      const alpha = Math.max(0, 1 - age / msg.duration);
      
      ctx.globalAlpha = alpha;
      this.drawCenteredText(ctx, msg.text, 28, this.theme.colors.text, yOffset - this.height / 2);
      ctx.globalAlpha = 1;
      
      yOffset += 40;
    }
  }

  private drawCenteredText(ctx: CanvasRenderingContext2D, text: string, size: number, color: string, yOffset: number = 0): void {
    ctx.font = `bold ${size}px system-ui, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(text, this.width / 2, this.height / 2 + yOffset);
    ctx.textAlign = 'left';
  }

  private drawSpeechBubble(ctx: CanvasRenderingContext2D): void {
    const bubble = this.state.speechBubble;
    if (!bubble) return;
    
    const now = Date.now();
    const age = now - bubble.createdAt;
    if (age > bubble.duration) {
      this.state.speechBubble = null;
      return;
    }
    
    // Fade out effect
    const alpha = Math.max(0, 1 - (age / bubble.duration) * 0.5);
    ctx.globalAlpha = alpha;
    
    const player = this.state.player;
    const padding = 12;
    const fontSize = 14;
    const maxWidth = 200;
    
    ctx.font = `${fontSize}px system-ui, sans-serif`;
    
    // Word wrap the text
    const words = bubble.text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    // Calculate bubble size
    const lineHeight = fontSize + 4;
    const bubbleWidth = Math.min(maxWidth, Math.max(...lines.map(l => ctx.measureText(l).width))) + padding * 2;
    const bubbleHeight = lines.length * lineHeight + padding * 2;
    
    // Position bubble above player
    const bubbleX = Math.max(10, Math.min(this.width - bubbleWidth - 10, player.x + player.width / 2 - bubbleWidth / 2));
    const bubbleY = player.y - bubbleHeight - 20;
    
    // Draw bubble background
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 8);
    ctx.fill();
    
    // Draw bubble tail
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2 - 8, bubbleY + bubbleHeight);
    ctx.lineTo(player.x + player.width / 2, bubbleY + bubbleHeight + 10);
    ctx.lineTo(player.x + player.width / 2 + 8, bubbleY + bubbleHeight);
    ctx.closePath();
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 8);
    ctx.stroke();
    
    // Draw text
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    lines.forEach((line, i) => {
      ctx.fillText(line, bubbleX + padding, bubbleY + padding + fontSize + i * lineHeight);
    });
    
    ctx.globalAlpha = 1;
  }

  // ==========================================================================
  // INPUT HANDLING
  // ==========================================================================

  private handleKeyDown(e: KeyboardEvent): void {
    // Only prevent page scroll when focus is NOT inside a text input / editor.
    // If the user is typing in the code editor, arrow keys must move the cursor normally.
    const tag = (document.activeElement?.tagName ?? '').toLowerCase();
    const isEditable =
      tag === 'textarea' ||
      tag === 'input' ||
      (document.activeElement as HTMLElement | null)?.isContentEditable;

    if (!isEditable && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
      e.preventDefault();
    }

    const key = this.normalizeKey(e.key);

    if (!this.state.keysPressed.has(key)) {
      this.state.keysPressed.add(key);
      
      // Call registered callbacks
      const callbacks = this.callbacks.onKeyDown.get(key);
      if (callbacks) {
        for (const callback of callbacks) {
          try {
            callback();
          } catch (err) {
            console.error('Key callback error:', err);
          }
        }
      }
    }
    
    // Handle restart
    if (key === 'R' && this.state.isGameOver) {
      this.restart();
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    const key = this.normalizeKey(e.key);
    this.state.keysPressed.delete(key);
    
    // Call registered callbacks
    const callbacks = this.callbacks.onKeyUp.get(key);
    if (callbacks) {
      for (const callback of callbacks) {
        try {
          callback();
        } catch (err) {
          console.error('Key callback error:', err);
        }
      }
    }
  }

  private normalizeKey(key: string): string {
    const keyMap: Record<string, string> = {
      'ArrowLeft': 'LEFT',
      'ArrowRight': 'RIGHT',
      'ArrowUp': 'UP',
      'ArrowDown': 'DOWN',
      ' ': 'SPACE',
      'a': 'LEFT',
      'd': 'RIGHT',
      'w': 'UP',
      's': 'DOWN',
    };
    return keyMap[key] || key.toUpperCase();
  }

  // ==========================================================================
  // PUBLIC API (called from Python bridge)
  // ==========================================================================

  public setTheme(themeId: string): void {
    if (THEMES[themeId]) {
      this.theme = THEMES[themeId];
      this.state.theme = themeId;
      this.emitEvent('theme_set', { themeId });
    }
  }

  public setPlayerSprite(spriteId: string): void {
    this.state.player.sprite = spriteId;
    this.emitEvent('sprite_set', { spriteId });
  }

  public setCustomPlayerSprite(pixels: string[][]): void {
    this.customPlayerPixels = pixels;
    this.emitEvent('custom_sprite_set', {});
  }

  public setSpawnPoint(x: number, y: number): void {
    this.spawnX = x;
    this.spawnY = y;
  }

  public setPlayerPosition(x: number, y: number): void {
    this.state.player.x = x;
    this.state.player.y = y;
    this.emitEvent('player_position_set', { x, y });
  }

  public getPlayerX(): number {
    return this.state.player.x;
  }

  public getPlayerY(): number {
    return this.state.player.y;
  }

  public setPlayerX(x: number): void {
    this.state.player.x = x;
    this.emitEvent('player_moved', { x, y: this.state.player.y, direction: 'horizontal' });
  }

  public setPlayerY(y: number): void {
    this.state.player.y = y;
  }

  public movePlayer(dx: number): void {
    this.state.player.x += dx;
    this.state.player.facingRight = dx > 0;
    this.emitEvent('player_moved', { dx, direction: dx > 0 ? 'right' : 'left' });
  }

  public movePlayerY(dy: number): void {
    this.state.player.y += dy;
  }

  public setPlayerVelocityY(vy: number): void {
    this.state.player.vy = vy;
    if (vy < 0) {
      this.emitEvent('player_jumped', {});
    }
  }

  public isOnGround(): boolean {
    return this.state.player.isOnGround;
  }

  public addPlatform(x: number, y: number, width: number, height: number): string {
    const id = `platform_${this.state.platforms.length}`;
    const platform: Platform = {
      id,
      type: 'platform',
      x, y, width, height,
      active: true
    };
    this.state.platforms.push(platform);
    this.emitEvent('platform_added', { id, x, y, width, height });
    return id;
  }

  public addCoin(x: number, y: number): string {
    const id = `coin_${this.state.coins.length}`;
    const coin: Coin = {
      id,
      type: 'coin',
      x, y,
      width: 24,
      height: 24,
      collected: false,
      active: true
    };
    this.state.coins.push(coin);
    this.emitEvent('coin_added', { id, x, y });
    return id;
  }

  public addEnemy(enemyType: string, x: number, y: number): string {
    const id = `enemy_${this.state.enemies.length}`;
    const enemy: Enemy = {
      id,
      type: 'enemy',
      enemyType,
      x, y,
      width: 32,
      height: 32,
      direction: 1,
      speed: 2,
      active: true
    };
    this.state.enemies.push(enemy);
    this.emitEvent('enemy_spawned', { id, enemyType, x, y });
    return id;
  }

  public setEnemyX(enemyType: string, x: number): void {
    const enemy = this.state.enemies.find(e => e.enemyType === enemyType);
    if (enemy) {
      enemy.x = x;
    }
  }

  public setEnemyPosition(enemyType: string, x: number, y: number): void {
    const enemy = this.state.enemies.find(e => e.enemyType === enemyType);
    if (enemy) {
      enemy.x = x;
      enemy.y = y;
    }
  }

  public addGoal(x: number, y: number): void {
    this.state.goal = {
      id: 'goal',
      type: 'goal',
      x, y,
      width: 40,
      height: 60,
      active: true
    };
    this.emitEvent('goal_added', { x, y });
  }

  public collidesWith(tag: string): boolean {
    const player = this.state.player;
    
    if (tag === 'COIN') {
      for (const coin of this.state.coins) {
        if (!coin.collected && this.checkCollision(player, coin)) {
          return true;
        }
      }
    } else if (tag === 'ENEMY') {
      for (const enemy of this.state.enemies) {
        if (enemy.active && this.checkCollision(player, enemy)) {
          return true;
        }
      }
    } else if (tag === 'GOAL') {
      if (this.state.goal && this.checkCollision(player, this.state.goal)) {
        return true;
      }
    }
    
    return false;
  }

  public willCollideBelow(vy: number): boolean {
    const player = this.state.player;
    const futureY = player.y + vy;
    
    for (const platform of this.state.platforms) {
      if (player.x + player.width > platform.x &&
          player.x < platform.x + platform.width &&
          futureY + player.height >= platform.y &&
          player.y + player.height <= platform.y) {
        return true;
      }
    }
    
    return false;
  }

  public snapToPlatform(): void {
    const player = this.state.player;
    
    for (const platform of this.state.platforms) {
      if (player.x + player.width > platform.x &&
          player.x < platform.x + platform.width &&
          player.y + player.height >= platform.y - 10 &&
          player.y + player.height <= platform.y + platform.height) {
        player.y = platform.y - player.height;
        player.vy = 0;
        player.isOnGround = true;
        return;
      }
    }
  }

  public removeColliding(tag: string): void {
    const player = this.state.player;
    
    if (tag === 'COIN') {
      for (const coin of this.state.coins) {
        if (!coin.collected && this.checkCollision(player, coin)) {
          coin.collected = true;
          this.emitEvent('coin_collected', { coinId: coin.id });
          return;
        }
      }
    }
  }

  private checkCollision(a: { x: number; y: number; width: number; height: number }, 
                         b: { x: number; y: number; width: number; height: number }): boolean {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }

  public setScore(score: number): void {
    this.state.score = score;
    this.emitEvent('score_changed', { score });
  }

  public getScore(): number {
    return this.state.score;
  }

  public showScore(score: number): void {
    this.state.score = score;
  }

  public showLives(lives: number): void {
    this.state.lives = lives;
  }

  public showMessage(text: string, duration: number = 3000): void {
    const message = {
      id: `msg_${Date.now()}`,
      text,
      duration,
      createdAt: Date.now()
    };
    this.state.messageQueue.push(message);
    this.emitEvent('message_shown', { text });
  }

  public showSpeechBubble(text: string, duration: number = 3000): void {
    this.state.speechBubble = {
      text,
      duration,
      createdAt: Date.now()
    };
  }

  public playSound(_name: string): void {
    // TODO: Implement sound system
    console.log(`[Sound] ${_name}`);
  }

  public freezeEnemies(): void {
    for (const enemy of this.state.enemies) {
      enemy.speed = 0;
    }
  }

  public youWin(): void {
    this.state.hasWon = true;
    this.emitEvent('win', {});
  }

  public stopGame(): void {
    this.state.isRunning = false;
  }

  public restart(): void {
    // Preserve custom player pixels
    const savedPixels = this.customPlayerPixels;

    // Reset spawn point to defaults (loadLevelIntoEngine will re-set them)
    this.spawnX = 100;
    this.spawnY = 300;

    // Reset state
    this.state = this.createInitialState();
    this.events = [];
    this.callbacks.onUpdate = [];
    this.callbacks.onKeyDown.clear();
    this.callbacks.onKeyUp.clear();
    
    // Restore custom player pixels
    this.customPlayerPixels = savedPixels;
    
    // Re-apply theme
    this.setTheme(this.state.theme);
    
    this.emitEvent('level_restart', {});
  }

  public doResetPlayerPosition(): void {
    this.state.player.x = 100;
    this.state.player.y = 300;
    this.state.player.vx = 0;
    this.state.player.vy = 0;
  }

  public unlockNextLevel(): void {
    // This will be handled by the parent component
    console.log('[Game] Next level unlocked!');
  }

  // Callback registration
  public clearCallbacks(): void {
    this.callbacks.onUpdate = [];
    this.callbacks.onKeyDown.clear();
    this.callbacks.onKeyUp.clear();
  }

  public clearPlatforms(): void {
    this.state.platforms = [];
  }

  public onUpdate(callback: UpdateCallback): void {
    this.callbacks.onUpdate.push(callback);
  }

  public onKeyDown(key: string, callback: KeyCallback): void {
    const normalizedKey = key.toUpperCase();
    if (!this.callbacks.onKeyDown.has(normalizedKey)) {
      this.callbacks.onKeyDown.set(normalizedKey, []);
    }
    this.callbacks.onKeyDown.get(normalizedKey)!.push(callback);
  }

  public onKeyUp(key: string, callback: KeyCallback): void {
    const normalizedKey = key.toUpperCase();
    if (!this.callbacks.onKeyUp.has(normalizedKey)) {
      this.callbacks.onKeyUp.set(normalizedKey, []);
    }
    this.callbacks.onKeyUp.get(normalizedKey)!.push(callback);
  }

  public isKeyPressed(key: string): boolean {
    return this.state.keysPressed.has(key.toUpperCase());
  }

  // Level presets
  public loadPlatformPreset(presetId: string): Array<[number, number, number, number]> {
    const presets: Record<string, Array<[number, number, number, number]>> = {
      easy: [
        [0, 300, 400, 40],
        [450, 280, 200, 40],
        [700, 260, 150, 40]
      ],
      medium: [
        [0, 300, 200, 40],
        [280, 260, 150, 40],
        [500, 220, 150, 40],
        [720, 180, 180, 40]
      ],
      hard: [
        [0, 300, 150, 40],
        [220, 250, 100, 40],
        [400, 200, 100, 40],
        [580, 150, 100, 40],
        [750, 120, 150, 40]
      ]
    };
    
    return presets[presetId] || presets.easy;
  }

  // ==========================================================================
  // EVENTS (for validation)
  // ==========================================================================

  private emitEvent(type: string, data: Record<string, unknown>): void {
    const event: GameEvent = {
      type: type as GameEvent['type'],
      timestamp: Date.now(),
      data
    };
    this.events.push(event);
  }

  public getEvents(): GameEvent[] {
    return [...this.events];
  }

  public clearEvents(): void {
    this.events = [];
  }

  public getState(): GameState {
    return { ...this.state };
  }
}

// Singleton instance for use in Python bridge
let engineInstance: PlatformerEngine | null = null;

export function getEngine(): PlatformerEngine {
  if (!engineInstance) {
    engineInstance = new PlatformerEngine();
  }
  return engineInstance;
}

export function resetEngine(): PlatformerEngine {
  engineInstance = new PlatformerEngine();
  return engineInstance;
}


"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, RotateCcw, Pause, Volume2, VolumeX } from "lucide-react";
import { LevelData } from "./level-designer";
import { THEMES } from "@/lib/level-templates";

interface TestModeModalProps {
  levelData: LevelData;
  heroPixels?: string[][];
  onClose: () => void;
}

// Enemy state for dynamic movement
interface EnemyState {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isAlive: boolean;
  behavior: string;
  subtype: string;
  direction: number; // 1 or -1
  initialX: number;
  initialY: number;
  timer: number;
  range: number;
  speed: number;
  isVisible: boolean; // For teleport
}

// Powerup state
interface PowerupState {
  id: string;
  x: number;
  y: number;
  subtype: string;
  collected: boolean;
}

// Active powerup effect
interface ActivePowerup {
  type: string;
  remainingTime: number;
  icon: string;
}

// Particle effect for visual feedback
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface GameState {
  playerX: number;
  playerY: number;
  playerVX: number;
  playerVY: number;
  isOnGround: boolean;
  coins: number;
  totalCoins: number;
  enemiesDefeated: number;
  totalEnemies: number;
  isWon: boolean;
  isLost: boolean;
  isPaused: boolean;
  cameraX: number;
  score: number;
  hasShield: boolean;
}

const TILE_SIZE = 24;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 32;
const ENEMY_SIZE = 24;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const MOVE_SPEED = 5;
const STOMP_BOUNCE = -8;

// Powerup colors and icons
const POWERUP_CONFIG: Record<string, { color: string; icon: string; duration: number }> = {
  super_jump: { color: "#22c55e", icon: "🦘", duration: 10 },
  turbo_speed: { color: "#f97316", icon: "💨", duration: 8 },
  sky_glide: { color: "#3b82f6", icon: "🪂", duration: 10 },
  flame_thrower: { color: "#ef4444", icon: "🔥", duration: 6 },
  ice_blast: { color: "#06b6d4", icon: "❄️", duration: 6 },
  boomerang: { color: "#a855f7", icon: "🪃", duration: 8 },
  iron_shield: { color: "#64748b", icon: "🛡️", duration: 5 },
  laser_eyes: { color: "#eab308", icon: "👁️", duration: 6 },
};

export function TestModeModal({ levelData, heroPixels, onClose }: TestModeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const particlesRef = useRef<Particle[]>([]);
  const frameCountRef = useRef(0);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize enemy states from level data
  const initializeEnemies = useCallback((): EnemyState[] => {
    return levelData.objects
      .filter(o => o.type === "enemy")
      .map(e => ({
        id: e.id,
        x: e.x * TILE_SIZE,
        y: e.y * TILE_SIZE,
        vx: 0,
        vy: 0,
        isAlive: true,
        behavior: (e.data?.behavior as string) || "patrol",
        subtype: e.subtype || "slime",
        direction: 1,
        initialX: e.x * TILE_SIZE,
        initialY: e.y * TILE_SIZE,
        timer: 0,
        range: ((e.data?.patrolRange as number) || 3) * TILE_SIZE,
        speed: 1.5,
        isVisible: true,
      }));
  }, [levelData.objects]);

  // Initialize powerup states from level data
  const initializePowerups = useCallback((): PowerupState[] => {
    return levelData.objects
      .filter(o => o.type === "powerup")
      .map(p => ({
        id: p.id,
        x: p.x * TILE_SIZE,
        y: p.y * TILE_SIZE,
        subtype: p.subtype || "super_jump",
        collected: false,
      }));
  }, [levelData.objects]);

  const [gameState, setGameState] = useState<GameState>(() => {
    const spawn = levelData.objects.find(o => o.type === "spawn");
    const totalCoins = levelData.objects.filter(o => o.type === "coin").length;
    const totalEnemies = levelData.objects.filter(o => o.type === "enemy").length;
    return {
      playerX: spawn ? spawn.x * TILE_SIZE : 64,
      playerY: spawn ? spawn.y * TILE_SIZE : 400,
      playerVX: 0,
      playerVY: 0,
      isOnGround: false,
      coins: 0,
      totalCoins,
      enemiesDefeated: 0,
      totalEnemies,
      isWon: false,
      isLost: false,
      isPaused: false,
      cameraX: 0,
      score: 0,
      hasShield: false,
    };
  });

  const [enemyStates, setEnemyStates] = useState<EnemyState[]>(initializeEnemies);
  const [powerupStates, setPowerupStates] = useState<PowerupState[]>(initializePowerups);
  const [activePowerups, setActivePowerups] = useState<ActivePowerup[]>([]);
  const [collectedCoins, setCollectedCoins] = useState<Set<string>>(new Set());

  const theme = THEMES[levelData.theme];

  // Get level objects
  const platforms = levelData.objects.filter(o => o.type === "platform");
  const hazards = levelData.objects.filter(o => o.type === "hazard");
  const coins = levelData.objects.filter(o => o.type === "coin");
  const goal = levelData.objects.find(o => o.type === "goal");

  // Level dimensions
  const levelWidth = (levelData.settings.levelSize === "short" ? 40 : 
                      levelData.settings.levelSize === "medium" ? 80 :
                      levelData.settings.levelSize === "long" ? 120 : 40) * TILE_SIZE;

  // Add particles for visual effects
  const addParticles = useCallback((x: number, y: number, color: string, count: number, spread: number = 3) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * spread * 2,
        vy: (Math.random() - 0.5) * spread * 2 - 2,
        life: 30 + Math.random() * 20,
        color,
        size: 3 + Math.random() * 4,
      });
    }
    particlesRef.current = [...particlesRef.current, ...newParticles];
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    const spawn = levelData.objects.find(o => o.type === "spawn");
    const totalCoins = levelData.objects.filter(o => o.type === "coin").length;
    const totalEnemies = levelData.objects.filter(o => o.type === "enemy").length;
    setGameState({
      playerX: spawn ? spawn.x * TILE_SIZE : 64,
      playerY: spawn ? spawn.y * TILE_SIZE : 400,
      playerVX: 0,
      playerVY: 0,
      isOnGround: false,
      coins: 0,
      totalCoins,
      enemiesDefeated: 0,
      totalEnemies,
      isWon: false,
      isLost: false,
      isPaused: false,
      cameraX: 0,
      score: 0,
      hasShield: false,
    });
    setCollectedCoins(new Set());
    setEnemyStates(initializeEnemies());
    setPowerupStates(initializePowerups());
    setActivePowerups([]);
    particlesRef.current = [];
  }, [levelData.objects, initializeEnemies, initializePowerups]);

  // Check collision with platform
  const checkPlatformCollision = useCallback((x: number, y: number, vy: number) => {
    const playerRect = {
      left: x,
      right: x + PLAYER_WIDTH,
      top: y,
      bottom: y + PLAYER_HEIGHT,
    };

    for (const platform of platforms) {
      const platRect = {
        left: platform.x * TILE_SIZE,
        right: (platform.x + platform.width) * TILE_SIZE,
        top: platform.y * TILE_SIZE,
        bottom: (platform.y + platform.height) * TILE_SIZE,
      };

      if (
        playerRect.right > platRect.left &&
        playerRect.left < platRect.right &&
        playerRect.bottom > platRect.top &&
        playerRect.top < platRect.bottom
      ) {
        if (vy >= 0 && playerRect.bottom - vy <= platRect.top + 10) {
          return { y: platRect.top - PLAYER_HEIGHT, isOnGround: true };
        }
      }
    }
    return null;
  }, [platforms]);

  // Check hazard collision
  const checkHazardCollision = useCallback((x: number, y: number) => {
    const playerRect = {
      left: x + 4,
      right: x + PLAYER_WIDTH - 4,
      top: y + 4,
      bottom: y + PLAYER_HEIGHT - 4,
    };

    for (const hazard of hazards) {
      const hazRect = {
        left: hazard.x * TILE_SIZE,
        right: (hazard.x + hazard.width) * TILE_SIZE,
        top: hazard.y * TILE_SIZE,
        bottom: (hazard.y + hazard.height) * TILE_SIZE,
      };

      if (
        playerRect.right > hazRect.left &&
        playerRect.left < hazRect.right &&
        playerRect.bottom > hazRect.top &&
        playerRect.top < hazRect.bottom
      ) {
        return true;
      }
    }
    return false;
  }, [hazards]);

  // Check coin collection
  const checkCoinCollection = useCallback((x: number, y: number) => {
    const playerRect = {
      left: x,
      right: x + PLAYER_WIDTH,
      top: y,
      bottom: y + PLAYER_HEIGHT,
    };

    const newCollected: string[] = [];
    for (const coin of coins) {
      if (collectedCoins.has(coin.id)) continue;

      const coinRect = {
        left: coin.x * TILE_SIZE,
        right: (coin.x + 1) * TILE_SIZE,
        top: coin.y * TILE_SIZE,
        bottom: (coin.y + 1) * TILE_SIZE,
      };

      if (
        playerRect.right > coinRect.left &&
        playerRect.left < coinRect.right &&
        playerRect.bottom > coinRect.top &&
        playerRect.top < coinRect.bottom
      ) {
        newCollected.push(coin.id);
        addParticles(coin.x * TILE_SIZE + TILE_SIZE / 2, coin.y * TILE_SIZE + TILE_SIZE / 2, "#ffd700", 8);
      }
    }
    return newCollected;
  }, [coins, collectedCoins, addParticles]);

  // Check enemy collision - returns stomp, death, or null
  const checkEnemyCollision = useCallback((x: number, y: number, vy: number, hasShield: boolean) => {
    const playerRect = {
      left: x + 2,
      right: x + PLAYER_WIDTH - 2,
      top: y,
      bottom: y + PLAYER_HEIGHT,
    };

    for (const enemy of enemyStates) {
      if (!enemy.isAlive || !enemy.isVisible) continue;

      const enemyRect = {
        left: enemy.x + 4,
        right: enemy.x + ENEMY_SIZE - 4,
        top: enemy.y + 4,
        bottom: enemy.y + ENEMY_SIZE - 4,
      };

      // Check overlap
      if (
        playerRect.right > enemyRect.left &&
        playerRect.left < enemyRect.right &&
        playerRect.bottom > enemyRect.top &&
        playerRect.top < enemyRect.bottom
      ) {
        // Check if stomping (player falling and above enemy center)
        const enemyCenter = enemy.y + ENEMY_SIZE / 2;
        if (vy > 0 && playerRect.bottom < enemyCenter + 8) {
          return { type: "stomp" as const, enemyId: enemy.id };
        }
        // Side collision - death (unless shielded)
        if (hasShield) {
          return { type: "shield_block" as const, enemyId: enemy.id };
        }
        return { type: "death" as const, enemyId: enemy.id };
      }
    }
    return null;
  }, [enemyStates]);

  // Check powerup collection
  const checkPowerupCollection = useCallback((x: number, y: number) => {
    const playerRect = {
      left: x,
      right: x + PLAYER_WIDTH,
      top: y,
      bottom: y + PLAYER_HEIGHT,
    };

    for (const powerup of powerupStates) {
      if (powerup.collected) continue;

      const powerupRect = {
        left: powerup.x,
        right: powerup.x + TILE_SIZE,
        top: powerup.y,
        bottom: powerup.y + TILE_SIZE,
      };

      if (
        playerRect.right > powerupRect.left &&
        playerRect.left < powerupRect.right &&
        playerRect.bottom > powerupRect.top &&
        playerRect.top < powerupRect.bottom
      ) {
        return powerup;
      }
    }
    return null;
  }, [powerupStates]);

  // Check goal reached
  const checkGoalReached = useCallback((x: number, y: number) => {
    if (!goal) return false;

    const playerRect = {
      left: x,
      right: x + PLAYER_WIDTH,
      top: y,
      bottom: y + PLAYER_HEIGHT,
    };

    const goalRect = {
      left: goal.x * TILE_SIZE,
      right: (goal.x + 1) * TILE_SIZE,
      top: goal.y * TILE_SIZE,
      bottom: (goal.y + goal.height) * TILE_SIZE,
    };

    return (
      playerRect.right > goalRect.left &&
      playerRect.left < goalRect.right &&
      playerRect.bottom > goalRect.top &&
      playerRect.top < goalRect.bottom
    );
  }, [goal]);

  // Update enemy positions based on behavior
  const updateEnemies = useCallback((playerX: number, playerY: number, deltaTime: number) => {
    setEnemyStates(prevEnemies => {
      return prevEnemies.map(enemy => {
        if (!enemy.isAlive) return enemy;

        let newX = enemy.x;
        let newY = enemy.y;
        let newVX = enemy.vx;
        let newVY = enemy.vy;
        let newDirection = enemy.direction;
        let newTimer = enemy.timer + deltaTime;
        let newIsVisible = enemy.isVisible;

        const speed = enemy.speed * 60 * deltaTime;

        switch (enemy.behavior) {
          case "patrol":
            // Move left/right within range
            newX += speed * newDirection;
            if (newX > enemy.initialX + enemy.range || newX < enemy.initialX - enemy.range) {
              newDirection *= -1;
            }
            break;

          case "chase":
            // Move toward player when in range
            const distToPlayer = Math.sqrt(
              Math.pow(playerX - enemy.x, 2) + Math.pow(playerY - enemy.y, 2)
            );
            if (distToPlayer < enemy.range * 2) {
              const dx = playerX - enemy.x;
              newDirection = dx > 0 ? 1 : -1;
              newX += speed * 1.5 * newDirection;
            } else {
              // Default patrol
              newX += speed * newDirection;
              if (newX > enemy.initialX + enemy.range || newX < enemy.initialX - enemy.range) {
                newDirection *= -1;
              }
            }
            break;

          case "jump":
            // Hop while patrolling
            newX += speed * 0.8 * newDirection;
            if (newX > enemy.initialX + enemy.range || newX < enemy.initialX - enemy.range) {
              newDirection *= -1;
            }
            // Jump periodically
            if (newTimer > 1.5) {
              newVY = -8;
              newTimer = 0;
            }
            newVY += GRAVITY * 0.5;
            newY += newVY;
            // Keep on ground
            if (newY > enemy.initialY) {
              newY = enemy.initialY;
              newVY = 0;
            }
            break;

          case "fly":
            // Float up and down while moving
            newX += speed * 0.5 * newDirection;
            if (newX > enemy.initialX + enemy.range || newX < enemy.initialX - enemy.range) {
              newDirection *= -1;
            }
            newY = enemy.initialY + Math.sin(newTimer * 3) * 30;
            break;

          case "stationary":
            // Don't move, just pulse
            break;

          case "zigzag":
            // Diagonal movement
            newX += speed * newDirection;
            newY = enemy.initialY + Math.abs(Math.sin(newTimer * 4) * 40);
            if (newX > enemy.initialX + enemy.range || newX < enemy.initialX - enemy.range) {
              newDirection *= -1;
            }
            break;

          case "sine_wave":
            // Smooth wave pattern
            newX += speed * 0.7 * newDirection;
            newY = enemy.initialY + Math.sin(newTimer * 2) * 40;
            if (newX > enemy.initialX + enemy.range || newX < enemy.initialX - enemy.range) {
              newDirection *= -1;
            }
            break;

          case "bounce":
            // Bounce around
            newVX = enemy.vx || speed * 2 * newDirection;
            newVY = (enemy.vy || 0) + GRAVITY * 0.3;
            newX += newVX;
            newY += newVY;
            // Bounce off boundaries
            if (newX > enemy.initialX + enemy.range || newX < enemy.initialX - enemy.range) {
              newVX *= -0.9;
              newDirection *= -1;
            }
            // Bounce off ground
            if (newY > enemy.initialY + 50) {
              newY = enemy.initialY + 50;
              newVY = -6 - Math.random() * 3;
            }
            break;

          case "orbit":
            // Circular movement around initial position
            const orbitRadius = enemy.range * 0.5;
            newX = enemy.initialX + Math.cos(newTimer * 2) * orbitRadius;
            newY = enemy.initialY + Math.sin(newTimer * 2) * orbitRadius * 0.6;
            break;

          case "teleport":
            // Teleport periodically
            if (newTimer > 2) {
              if (newIsVisible) {
                newIsVisible = false;
              } else {
                newIsVisible = true;
                // Teleport to random position in range
                newX = enemy.initialX + (Math.random() - 0.5) * enemy.range * 2;
                newY = enemy.initialY + (Math.random() - 0.5) * 50;
              }
              newTimer = 0;
            }
            break;

          default:
            // Default patrol
            newX += speed * newDirection;
            if (newX > enemy.initialX + enemy.range || newX < enemy.initialX - enemy.range) {
              newDirection *= -1;
            }
        }

        return {
          ...enemy,
          x: newX,
          y: newY,
          vx: newVX,
          vy: newVY,
          direction: newDirection,
          timer: newTimer,
          isVisible: newIsVisible,
        };
      });
    });
  }, []);

  // Update active powerups (decrease timers)
  const updatePowerups = useCallback((deltaTime: number) => {
    setActivePowerups(prev => {
      return prev
        .map(p => ({ ...p, remainingTime: p.remainingTime - deltaTime }))
        .filter(p => p.remainingTime > 0);
    });
  }, []);

  // Update particles
  const updateParticles = useCallback(() => {
    particlesRef.current = particlesRef.current
      .map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.15,
        life: p.life - 1,
        size: p.size * 0.97,
      }))
      .filter(p => p.life > 0);
  }, []);

  // Check if player has active powerup
  const hasActivePowerup = useCallback((type: string) => {
    return activePowerups.some(p => p.type === type);
  }, [activePowerups]);

  // Game loop
  useEffect(() => {
    if (gameState.isWon || gameState.isLost || gameState.isPaused) return;

    let lastTime = performance.now();

    const gameLoop = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;
      frameCountRef.current++;

      // Update enemies
      updateEnemies(gameState.playerX, gameState.playerY, deltaTime);
      
      // Update powerup timers
      updatePowerups(deltaTime);
      
      // Update particles
      updateParticles();

      setGameState(prev => {
        if (prev.isWon || prev.isLost || prev.isPaused) return prev;

        // Calculate speed modifiers from powerups
        const speedMultiplier = hasActivePowerup("turbo_speed") ? 1.8 : 1;
        const jumpMultiplier = hasActivePowerup("super_jump") ? 1.5 : 1;
        const glideActive = hasActivePowerup("sky_glide");
        const shieldActive = hasActivePowerup("iron_shield");

        let newX = prev.playerX;
        let newY = prev.playerY;
        let newVY = prev.playerVY + (glideActive && prev.playerVY > 0 ? GRAVITY * 0.3 : GRAVITY);
        let isOnGround = false;

        // Handle input
        if (keysRef.current.has("ArrowLeft") || keysRef.current.has("KeyA")) {
          newX -= MOVE_SPEED * speedMultiplier;
        }
        if (keysRef.current.has("ArrowRight") || keysRef.current.has("KeyD")) {
          newX += MOVE_SPEED * speedMultiplier;
        }
        if ((keysRef.current.has("ArrowUp") || keysRef.current.has("KeyW") || keysRef.current.has("Space")) && prev.isOnGround) {
          newVY = JUMP_FORCE * jumpMultiplier;
        }

        // Apply gravity
        newY += newVY;

        // Check platform collision
        const collision = checkPlatformCollision(newX, newY, newVY);
        if (collision) {
          newY = collision.y;
          isOnGround = collision.isOnGround;
          if (isOnGround) newVY = 0;
        }

        // Bound to level
        if (levelData.settings.loops) {
          if (newX > levelWidth - PLAYER_WIDTH) {
            newX = 0;
          } else if (newX < 0) {
            newX = levelWidth - PLAYER_WIDTH;
          }
        } else {
          newX = Math.max(0, Math.min(levelWidth - PLAYER_WIDTH, newX));
        }

        // Check enemy collision
        const enemyCollision = checkEnemyCollision(newX, newY, newVY, shieldActive);
        if (enemyCollision) {
          if (enemyCollision.type === "stomp") {
            // Kill enemy and bounce
            setEnemyStates(enemies => 
              enemies.map(e => 
                e.id === enemyCollision.enemyId 
                  ? { ...e, isAlive: false } 
                  : e
              )
            );
            // Add particles for defeated enemy
            const enemy = enemyStates.find(e => e.id === enemyCollision.enemyId);
            if (enemy) {
              addParticles(enemy.x + ENEMY_SIZE / 2, enemy.y + ENEMY_SIZE / 2, "#fff", 12, 5);
            }
            newVY = STOMP_BOUNCE;
            return {
              ...prev,
              playerX: newX,
              playerY: newY,
              playerVY: newVY,
              isOnGround: false,
              enemiesDefeated: prev.enemiesDefeated + 1,
              score: prev.score + 100,
            };
          } else if (enemyCollision.type === "shield_block") {
            // Shield blocks the hit, destroy enemy
            setEnemyStates(enemies => 
              enemies.map(e => 
                e.id === enemyCollision.enemyId 
                  ? { ...e, isAlive: false } 
                  : e
              )
            );
            const enemy = enemyStates.find(e => e.id === enemyCollision.enemyId);
            if (enemy) {
              addParticles(enemy.x + ENEMY_SIZE / 2, enemy.y + ENEMY_SIZE / 2, "#64748b", 15, 6);
            }
            return {
              ...prev,
              playerX: newX,
              playerY: newY,
              enemiesDefeated: prev.enemiesDefeated + 1,
              score: prev.score + 100,
            };
          } else {
            // Player dies
            return { ...prev, isLost: true };
          }
        }

        // Check hazard collision (shield doesn't protect)
        if (checkHazardCollision(newX, newY)) {
          return { ...prev, isLost: true };
        }

        // Check powerup collection
        const collectedPowerup = checkPowerupCollection(newX, newY);
        if (collectedPowerup) {
          setPowerupStates(powerups =>
            powerups.map(p =>
              p.id === collectedPowerup.id ? { ...p, collected: true } : p
            )
          );
          // Add powerup effect
          const config = POWERUP_CONFIG[collectedPowerup.subtype];
          if (config) {
            setActivePowerups(active => [
              ...active.filter(p => p.type !== collectedPowerup.subtype),
              { type: collectedPowerup.subtype, remainingTime: config.duration, icon: config.icon }
            ]);
            addParticles(
              collectedPowerup.x + TILE_SIZE / 2,
              collectedPowerup.y + TILE_SIZE / 2,
              config.color,
              15,
              4
            );
          }
          return {
            ...prev,
            score: prev.score + 50,
            hasShield: collectedPowerup.subtype === "iron_shield" || prev.hasShield,
          };
        }

        // Check coin collection
        const newCoins = checkCoinCollection(newX, newY);
        if (newCoins.length > 0) {
          setCollectedCoins(c => new Set([...c, ...newCoins]));
        }

        // Check goal
        const reachedGoal = checkGoalReached(newX, newY);
        if (reachedGoal) {
          const hasWon = levelData.settings.winCondition === "reach_goal" ||
            (levelData.settings.winCondition === "collect_all_coins" && 
             prev.coins + newCoins.length >= (levelData.settings.requiredCoins || prev.totalCoins)) ||
            (levelData.settings.winCondition === "defeat_all_enemies" &&
             prev.enemiesDefeated >= prev.totalEnemies);
          if (hasWon) {
            return { ...prev, isWon: true, playerX: newX, playerY: newY };
          }
        }

        // Fall off screen
        if (newY > 700) {
          return { ...prev, isLost: true };
        }

        // Update camera
        const canvasWidth = 800;
        let cameraX = prev.cameraX;
        const playerScreenX = newX - cameraX;
        if (playerScreenX > canvasWidth * 0.6) {
          cameraX = newX - canvasWidth * 0.6;
        } else if (playerScreenX < canvasWidth * 0.3) {
          cameraX = newX - canvasWidth * 0.3;
        }
        cameraX = Math.max(0, Math.min(levelWidth - canvasWidth, cameraX));

        return {
          ...prev,
          playerX: newX,
          playerY: newY,
          playerVY: newVY,
          isOnGround,
          coins: prev.coins + newCoins.length,
          score: prev.score + newCoins.length * 10,
          cameraX,
          hasShield: hasActivePowerup("iron_shield"),
        };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [
    gameState.isWon, gameState.isLost, gameState.isPaused, gameState.playerX, gameState.playerY,
    checkPlatformCollision, checkHazardCollision, checkCoinCollection, checkGoalReached,
    checkEnemyCollision, checkPowerupCollection, updateEnemies, updatePowerups, updateParticles,
    levelWidth, levelData.settings, addParticles, hasActivePowerup, enemyStates
  ]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      if (e.code === "Escape") {
        onClose();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onClose]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = theme.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Offset by camera
      ctx.save();
      ctx.translate(-gameState.cameraX, 0);

      // Draw platforms
      platforms.forEach(p => {
        ctx.fillStyle = theme.platformColor;
        ctx.fillRect(p.x * TILE_SIZE, p.y * TILE_SIZE, p.width * TILE_SIZE, p.height * TILE_SIZE);
        ctx.fillStyle = theme.platformAccent;
        ctx.fillRect(p.x * TILE_SIZE, p.y * TILE_SIZE, p.width * TILE_SIZE, 4);
      });

      // Draw hazards
      hazards.forEach(h => {
        if (h.subtype === "spike") {
          ctx.fillStyle = "#ef4444";
          for (let i = 0; i < h.width; i++) {
            ctx.beginPath();
            ctx.moveTo((h.x + i) * TILE_SIZE, (h.y + h.height) * TILE_SIZE);
            ctx.lineTo((h.x + i + 0.5) * TILE_SIZE, h.y * TILE_SIZE);
            ctx.lineTo((h.x + i + 1) * TILE_SIZE, (h.y + h.height) * TILE_SIZE);
            ctx.fill();
          }
        } else if (h.subtype === "lava") {
          ctx.fillStyle = "#f97316";
          ctx.fillRect(h.x * TILE_SIZE, h.y * TILE_SIZE, h.width * TILE_SIZE, h.height * TILE_SIZE);
          // Lava bubbles
          ctx.fillStyle = "#fbbf24";
          for (let i = 0; i < 3; i++) {
            const bx = h.x * TILE_SIZE + (i + 0.5) * (h.width * TILE_SIZE / 3);
            const by = h.y * TILE_SIZE + Math.sin(Date.now() / 300 + i) * 4 + 8;
            ctx.beginPath();
            ctx.arc(bx, by, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Draw coins
      coins.forEach(c => {
        if (collectedCoins.has(c.id)) return;
        const pulse = Math.sin(Date.now() / 200) * 2;
        ctx.beginPath();
        ctx.arc(
          c.x * TILE_SIZE + TILE_SIZE / 2,
          c.y * TILE_SIZE + TILE_SIZE / 2,
          8 + pulse,
          0, Math.PI * 2
        );
        ctx.fillStyle = "#ffd700";
        ctx.fill();
        // Shine
        ctx.beginPath();
        ctx.arc(
          c.x * TILE_SIZE + TILE_SIZE / 2 - 3,
          c.y * TILE_SIZE + TILE_SIZE / 2 - 3,
          3,
          0, Math.PI * 2
        );
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fill();
      });

      // Draw powerups
      powerupStates.forEach(p => {
        if (p.collected) return;
        const config = POWERUP_CONFIG[p.subtype] || { color: "#a855f7", icon: "⚡" };
        const pulse = Math.sin(Date.now() / 300) * 0.2 + 1;
        
        // Glow effect
        ctx.fillStyle = config.color + "40";
        ctx.fillRect(p.x - 4, p.y - 4, TILE_SIZE + 8, TILE_SIZE + 8);
        
        // Box
        ctx.fillStyle = config.color;
        ctx.fillRect(p.x, p.y, TILE_SIZE, TILE_SIZE);
        
        // Highlight
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillRect(p.x + 2, p.y + 2, TILE_SIZE - 4, 4);
        
        // Border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x + 1, p.y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        
        // Icon
        ctx.font = `${14 * pulse}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(config.icon, p.x + TILE_SIZE / 2, p.y + TILE_SIZE / 2);
      });

      // Draw enemies (dynamic positions)
      enemyStates.forEach(e => {
        if (!e.isAlive) return;
        if (!e.isVisible) {
          // Draw teleport shimmer
          ctx.fillStyle = "rgba(168, 85, 247, 0.3)";
          ctx.beginPath();
          ctx.arc(e.x + ENEMY_SIZE / 2, e.y + ENEMY_SIZE / 2, ENEMY_SIZE / 2, 0, Math.PI * 2);
          ctx.fill();
          return;
        }

        const enemyColor = e.subtype === "slime" ? "#22c55e" :
                          e.subtype === "bat" ? "#a855f7" :
                          e.subtype === "robot" ? "#64748b" :
                          e.subtype === "ghost" ? "#94a3b8" :
                          e.subtype === "fish" ? "#3b82f6" :
                          e.subtype === "fire" ? "#f97316" : "#ef4444";
        
        // Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.ellipse(e.x + ENEMY_SIZE / 2, e.y + ENEMY_SIZE - 2, ENEMY_SIZE / 2 - 4, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = enemyColor;
        if (e.subtype === "slime") {
          ctx.beginPath();
          ctx.ellipse(e.x + ENEMY_SIZE / 2, e.y + ENEMY_SIZE * 0.6, ENEMY_SIZE / 2 - 2, ENEMY_SIZE / 3, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (e.subtype === "ghost") {
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.arc(e.x + ENEMY_SIZE / 2, e.y + ENEMY_SIZE / 2, ENEMY_SIZE / 2 - 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        } else {
          ctx.fillRect(e.x + 4, e.y + 4, ENEMY_SIZE - 8, ENEMY_SIZE - 8);
        }

        // Eyes (look at player)
        const eyeOffsetX = (gameState.playerX - e.x) > 0 ? 2 : -2;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(e.x + ENEMY_SIZE / 2 - 5, e.y + ENEMY_SIZE / 2 - 4, 4, 0, Math.PI * 2);
        ctx.arc(e.x + ENEMY_SIZE / 2 + 5, e.y + ENEMY_SIZE / 2 - 4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(e.x + ENEMY_SIZE / 2 - 5 + eyeOffsetX, e.y + ENEMY_SIZE / 2 - 4, 2, 0, Math.PI * 2);
        ctx.arc(e.x + ENEMY_SIZE / 2 + 5 + eyeOffsetX, e.y + ENEMY_SIZE / 2 - 4, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw goal
      if (goal) {
        ctx.fillStyle = "#888";
        ctx.fillRect(goal.x * TILE_SIZE + 10, goal.y * TILE_SIZE, 4, goal.height * TILE_SIZE);
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.moveTo(goal.x * TILE_SIZE + 14, goal.y * TILE_SIZE);
        ctx.lineTo(goal.x * TILE_SIZE + 34, goal.y * TILE_SIZE + 12);
        ctx.lineTo(goal.x * TILE_SIZE + 14, goal.y * TILE_SIZE + 24);
        ctx.fill();
      }

      // Draw particles
      particlesRef.current.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 50;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw player with powerup effects
      const playerCenterX = gameState.playerX + PLAYER_WIDTH / 2;
      const playerCenterY = gameState.playerY + PLAYER_HEIGHT / 2;
      const hasPowerup = activePowerups.length > 0;
      const primaryPowerup = activePowerups[0];
      const primaryColor = primaryPowerup ? (POWERUP_CONFIG[primaryPowerup.type]?.color || "#a855f7") : "#a855f7";
      const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
      
      // Calculate player scale based on powerups
      const playerScale = hasPowerup ? 1.15 + Math.sin(Date.now() / 300) * 0.05 : 1;
      const scaledWidth = PLAYER_WIDTH * playerScale;
      const scaledHeight = PLAYER_HEIGHT * playerScale;
      const scaleOffsetX = (scaledWidth - PLAYER_WIDTH) / 2;
      const scaleOffsetY = (scaledHeight - PLAYER_HEIGHT) / 2;
      const drawX = gameState.playerX - scaleOffsetX;
      const drawY = gameState.playerY - scaleOffsetY;

      // Outer glow aura when any powerup is active
      if (hasPowerup) {
        const glowSize = 25 + Math.sin(Date.now() / 150) * 5;
        const gradient = ctx.createRadialGradient(
          playerCenterX, playerCenterY, 0,
          playerCenterX, playerCenterY, glowSize
        );
        gradient.addColorStop(0, primaryColor + "60");
        gradient.addColorStop(0.5, primaryColor + "30");
        gradient.addColorStop(1, primaryColor + "00");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(playerCenterX, playerCenterY, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shield effect - solid bubble
      if (hasActivePowerup("iron_shield")) {
        ctx.strokeStyle = "rgba(100, 116, 139, 0.9)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(playerCenterX, playerCenterY, PLAYER_WIDTH + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(100, 116, 139, 0.2)";
        ctx.fill();
      }

      // Fire effect - flames around and on player
      if (hasActivePowerup("flame_thrower")) {
        for (let i = 0; i < 6; i++) {
          const angle = (Date.now() / 200 + i * Math.PI / 3) % (Math.PI * 2);
          const flameX = playerCenterX + Math.cos(angle) * (15 + Math.sin(Date.now() / 100 + i) * 3);
          const flameY = playerCenterY + Math.sin(angle) * (20 + Math.sin(Date.now() / 100 + i) * 3);
          const flameSize = 6 + Math.sin(Date.now() / 80 + i) * 2;
          ctx.fillStyle = i % 2 === 0 ? "#ef4444" : "#fbbf24";
          ctx.beginPath();
          ctx.arc(flameX, flameY, flameSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Ice effect - spinning ice crystals
      if (hasActivePowerup("ice_blast")) {
        for (let i = 0; i < 6; i++) {
          const angle = (Date.now() / 400 + i * Math.PI / 3) % (Math.PI * 2);
          const iceX = playerCenterX + Math.cos(angle) * 22;
          const iceY = playerCenterY + Math.sin(angle) * 22;
          ctx.fillStyle = i % 2 === 0 ? "#06b6d4" : "#67e8f9";
          ctx.save();
          ctx.translate(iceX, iceY);
          ctx.rotate(angle + Date.now() / 500);
          ctx.fillRect(-4, -4, 8, 8);
          ctx.restore();
        }
      }

      // Speed effect - motion blur trail
      if (hasActivePowerup("turbo_speed")) {
        for (let i = 1; i <= 4; i++) {
          ctx.globalAlpha = 0.15 - i * 0.03;
          ctx.fillStyle = "#f97316";
          ctx.fillRect(
            drawX - i * 8,
            drawY,
            scaledWidth,
            scaledHeight
          );
        }
        ctx.globalAlpha = 1;
      }

      // Super jump - spring effect under feet
      if (hasActivePowerup("super_jump")) {
        const springBounce = Math.abs(Math.sin(Date.now() / 150)) * 5;
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.ellipse(
          playerCenterX,
          drawY + scaledHeight + 2,
          12,
          4 + springBounce,
          0, 0, Math.PI * 2
        );
        ctx.fill();
      }

      // Sky glide - wing/cape effect
      if (hasActivePowerup("sky_glide") && gameState.playerVY > 0) {
        const wingSpread = 15 + Math.sin(Date.now() / 100) * 5;
        ctx.fillStyle = "rgba(59, 130, 246, 0.5)";
        // Left wing
        ctx.beginPath();
        ctx.moveTo(drawX, drawY + scaledHeight / 2);
        ctx.quadraticCurveTo(drawX - wingSpread, drawY + scaledHeight / 3, drawX - wingSpread - 5, drawY + scaledHeight);
        ctx.lineTo(drawX, drawY + scaledHeight);
        ctx.fill();
        // Right wing
        ctx.beginPath();
        ctx.moveTo(drawX + scaledWidth, drawY + scaledHeight / 2);
        ctx.quadraticCurveTo(drawX + scaledWidth + wingSpread, drawY + scaledHeight / 3, drawX + scaledWidth + wingSpread + 5, drawY + scaledHeight);
        ctx.lineTo(drawX + scaledWidth, drawY + scaledHeight);
        ctx.fill();
      }

      // Laser eyes charging effect
      if (hasActivePowerup("laser_eyes")) {
        const laserPulse = Math.sin(Date.now() / 100) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(234, 179, 8, ${0.3 + laserPulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(drawX + scaledWidth * 0.35, drawY + scaledHeight * 0.3, 6 + laserPulse * 3, 0, Math.PI * 2);
        ctx.arc(drawX + scaledWidth * 0.75, drawY + scaledHeight * 0.3, 6 + laserPulse * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Boomerang orbiting effect
      if (hasActivePowerup("boomerang")) {
        const boomerangAngle = (Date.now() / 300) % (Math.PI * 2);
        const boomerangX = playerCenterX + Math.cos(boomerangAngle) * 25;
        const boomerangY = playerCenterY + Math.sin(boomerangAngle) * 15;
        ctx.save();
        ctx.translate(boomerangX, boomerangY);
        ctx.rotate(boomerangAngle * 2);
        ctx.fillStyle = "#a855f7";
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.quadraticCurveTo(0, -6, 8, 0);
        ctx.quadraticCurveTo(0, 2, -8, 0);
        ctx.fill();
        ctx.restore();
      }

      // Draw player body
      if (heroPixels && heroPixels.length > 0) {
        const pixelSize = scaledWidth / heroPixels[0].length;
        heroPixels.forEach((row, py) => {
          row.forEach((color, px) => {
            if (color && color !== "transparent") {
              ctx.fillStyle = color;
              ctx.fillRect(
                drawX + px * pixelSize,
                drawY + py * pixelSize,
                pixelSize,
                pixelSize
              );
            }
          });
        });
        
        // Add colored outline when powered up
        if (hasPowerup) {
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 2;
          ctx.strokeRect(drawX - 1, drawY - 1, scaledWidth + 2, scaledHeight + 2);
        }
      } else {
        // Default player with powerup-based color
        let playerColor = "#a855f7";
        if (hasActivePowerup("super_jump")) playerColor = "#22c55e";
        else if (hasActivePowerup("turbo_speed")) playerColor = "#f97316";
        else if (hasActivePowerup("flame_thrower")) playerColor = "#ef4444";
        else if (hasActivePowerup("ice_blast")) playerColor = "#06b6d4";
        else if (hasActivePowerup("iron_shield")) playerColor = "#64748b";
        else if (hasActivePowerup("sky_glide")) playerColor = "#3b82f6";
        else if (hasActivePowerup("boomerang")) playerColor = "#a855f7";
        else if (hasActivePowerup("laser_eyes")) playerColor = "#eab308";
        
        // Body with gradient
        const bodyGradient = ctx.createLinearGradient(drawX, drawY, drawX, drawY + scaledHeight);
        bodyGradient.addColorStop(0, playerColor);
        bodyGradient.addColorStop(1, hasPowerup ? playerColor + "cc" : "#7c3aed");
        ctx.fillStyle = bodyGradient;
        ctx.fillRect(drawX, drawY, scaledWidth, scaledHeight);
        
        // Eyes
        ctx.fillStyle = "#fff";
        const eyeY = drawY + scaledHeight * 0.3;
        const eyeSize = 3 * playerScale;
        ctx.beginPath();
        ctx.arc(drawX + scaledWidth * 0.35, eyeY, eyeSize, 0, Math.PI * 2);
        ctx.arc(drawX + scaledWidth * 0.75, eyeY, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(drawX + scaledWidth * 0.35, eyeY, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.arc(drawX + scaledWidth * 0.75, eyeY, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Outline when powered up
        if (hasPowerup) {
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 3;
          ctx.strokeRect(drawX - 1, drawY - 1, scaledWidth + 2, scaledHeight + 2);
        }
      }

      // Floating powerup icon above player
      if (hasPowerup && primaryPowerup) {
        const floatY = drawY - 20 + Math.sin(Date.now() / 200) * 3;
        ctx.font = "16px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(primaryPowerup.icon, playerCenterX, floatY);
      }

      ctx.restore();

      // Draw UI overlay (fixed position)
      // Background panel
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(10, 10, 200, 70);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, 200, 70);

      // Coins
      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 16px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`🪙 ${gameState.coins}/${gameState.totalCoins}`, 20, 35);

      // Enemies defeated
      ctx.fillStyle = "#ef4444";
      ctx.fillText(`👾 ${gameState.enemiesDefeated}/${gameState.totalEnemies}`, 110, 35);

      // Score
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px system-ui";
      ctx.fillText(`Score: ${gameState.score}`, 20, 58);

      // Active powerups
      if (activePowerups.length > 0) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(10, 90, activePowerups.length * 40 + 10, 40);
        
        activePowerups.forEach((powerup, i) => {
          const config = POWERUP_CONFIG[powerup.type];
          const x = 20 + i * 40;
          
          // Icon
          ctx.font = "20px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(powerup.icon, x + 12, 115);
          
          // Timer bar
          const maxDuration = config?.duration || 10;
          const barWidth = 30 * (powerup.remainingTime / maxDuration);
          ctx.fillStyle = config?.color || "#a855f7";
          ctx.fillRect(x - 3, 122, barWidth, 4);
        });
      }
    };

    render();
    const interval = setInterval(render, 1000 / 60);
    return () => clearInterval(interval);
  }, [gameState, theme, platforms, hazards, coins, enemyStates, powerupStates, goal, collectedCoins, heroPixels, activePowerups, hasActivePowerup]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl"
      >
        {/* Header */}
        <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{theme.icon}</span>
            <div>
              <h3 className="text-white font-bold">{levelData.name}</h3>
              <p className="text-white/50 text-xs">Testing your level...</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-slate-700 text-white/70 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setGameState(s => ({ ...s, isPaused: !s.isPaused }))}
              className="p-2 rounded-lg bg-slate-700 text-white/70 hover:text-white"
            >
              {gameState.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            <button
              onClick={resetGame}
              className="p-2 rounded-lg bg-slate-700 text-white/70 hover:text-white"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-700 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full"
            style={{ imageRendering: "pixelated" }}
          />

          {/* Win/Lose Overlay */}
          <AnimatePresence>
            {(gameState.isWon || gameState.isLost) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  {gameState.isWon ? (
                    <>
                      <div className="text-6xl mb-4">🎉</div>
                      <h2 className="text-3xl font-bold text-emerald-400 mb-2">You Win!</h2>
                      <p className="text-white/70 mb-2">Great level design!</p>
                      <p className="text-2xl text-yellow-400 mb-4">Score: {gameState.score}</p>
                    </>
                  ) : (
                    <>
                      <div className="text-6xl mb-4">💀</div>
                      <h2 className="text-3xl font-bold text-red-400 mb-2">Game Over</h2>
                      <p className="text-white/70 mb-2">Try again!</p>
                      <p className="text-xl text-white/50 mb-4">Score: {gameState.score}</p>
                    </>
                  )}
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={resetGame}
                      className="px-6 py-3 bg-violet-500 text-white font-bold rounded-xl hover:bg-violet-600"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600"
                    >
                      Edit Level
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pause Overlay */}
          {gameState.isPaused && !gameState.isWon && !gameState.isLost && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">⏸️</div>
                <h2 className="text-2xl font-bold text-white">Paused</h2>
                <p className="text-white/70">Press Play to continue</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls Help */}
        <div className="bg-slate-800 px-4 py-3 flex items-center justify-center gap-6 text-sm text-white/60">
          <span><kbd className="px-2 py-1 bg-slate-700 rounded">←</kbd> <kbd className="px-2 py-1 bg-slate-700 rounded">→</kbd> Move</span>
          <span><kbd className="px-2 py-1 bg-slate-700 rounded">Space</kbd> Jump</span>
          <span><kbd className="px-2 py-1 bg-slate-700 rounded">Esc</kbd> Close</span>
          <span className="text-violet-400">Jump on enemies to defeat them!</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

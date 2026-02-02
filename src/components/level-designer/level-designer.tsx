"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Play,
  Undo2,
  Redo2,
  Trash2,
  MousePointer,
  Pencil,
  Eraser,
  Hand,
  Loader2,
  Settings,
  Sparkles,
  Check,
  AlertCircle,
  X,
} from "lucide-react";
import { LevelCanvas, LevelObject } from "./level-canvas";
import { ObjectPalette, getObjectConfig } from "./object-palette";
import { LevelTemplates } from "./level-templates";
import { TestModeModal } from "./test-mode-modal";
import { THEMES, LevelTemplate, ThemeId, createEmptyLevel } from "@/lib/level-templates";

type Tool = "select" | "place" | "erase" | "pan";
type SaveStatus = "idle" | "saving" | "success" | "error";
type LevelSize = "short" | "medium" | "long" | "infinite";

const LEVEL_SIZES = {
  short: { width: 40, label: "Short", icon: "📏", description: "Quick level" },
  medium: { width: 80, label: "Medium", icon: "📐", description: "Standard level" },
  long: { width: 120, label: "Long", icon: "📏📏", description: "Epic journey" },
  infinite: { width: 40, label: "Infinite", icon: "♾️", description: "Loops forever!", loops: true },
};

interface LevelDesignerProps {
  initialLevel?: LevelTemplate;
  onSave?: (levelData: LevelData) => Promise<void>;
  onTest?: (levelData: LevelData) => void;
  childName: string;
  heroPixels?: string[][];
}

export interface LevelData {
  name: string;
  theme: ThemeId;
  objects: LevelObject[];
  settings: {
    winCondition: "reach_goal" | "collect_all_coins" | "defeat_all_enemies";
    requiredCoins?: number;
    timeLimit?: number;
    levelSize?: LevelSize;
    loops?: boolean;
  };
}

export function LevelDesigner({
  initialLevel,
  onSave,
  onTest,
  childName,
  heroPixels,
}: LevelDesignerProps) {
  // Level state
  const [levelName, setLevelName] = useState(initialLevel?.name || "My Awesome Level");
  const [theme, setTheme] = useState<ThemeId>(initialLevel?.theme || "jungle");
  const [levelSize, setLevelSize] = useState<LevelSize>("medium");
  const [objects, setObjects] = useState<LevelObject[]>(() => {
    if (initialLevel) {
      return convertTemplateToObjects(initialLevel);
    }
    // Start with spawn and goal
    return [
      { id: "spawn_1", type: "spawn", x: 2, y: 20, width: 1, height: 2 },
      { id: "goal_1", type: "goal", x: 37, y: 20, width: 1, height: 2 },
      { id: "ground_1", type: "platform", x: 0, y: 22, width: 40, height: 3, subtype: "solid" },
    ];
  });
  
  // Settings
  const [winCondition, setWinCondition] = useState<"reach_goal" | "collect_all_coins" | "defeat_all_enemies">("reach_goal");
  const [requiredCoins, setRequiredCoins] = useState(5);
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined);
  
  // Tool state
  const [selectedTool, setSelectedTool] = useState<Tool>("place");
  const [selectedObjectType, setSelectedObjectType] = useState<string | null>("platform_solid");
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  
  // UI state
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [showTestMode, setShowTestMode] = useState(false);
  const [undoStack, setUndoStack] = useState<LevelObject[][]>([]);
  const [redoStack, setRedoStack] = useState<LevelObject[][]>([]);

  // Convert template to objects
  function convertTemplateToObjects(template: LevelTemplate): LevelObject[] {
    const objs: LevelObject[] = [];
    let idCounter = 0;
    
    // Add platforms
    template.platforms.forEach((p) => {
      objs.push({
        id: `platform_${idCounter++}`,
        type: "platform",
        x: p.x,
        y: p.y,
        width: p.width,
        height: p.height,
        subtype: p.type,
        data: p.movePattern ? { movePattern: p.movePattern, moveRange: p.moveRange } : undefined,
      });
    });
    
    // Add coins
    template.coins.forEach((c) => {
      objs.push({
        id: `coin_${idCounter++}`,
        type: "coin",
        x: c.x,
        y: c.y,
        width: 1,
        height: 1,
      });
    });
    
    // Add enemies
    template.enemies.forEach((e) => {
      objs.push({
        id: `enemy_${idCounter++}`,
        type: "enemy",
        x: e.x,
        y: e.y,
        width: 1,
        height: 1,
        subtype: e.type,
        data: { behavior: e.behavior, patrolRange: e.patrolRange },
      });
    });
    
    // Add spawn
    objs.push({
      id: `spawn_${idCounter++}`,
      type: "spawn",
      x: template.playerSpawn.x,
      y: template.playerSpawn.y,
      width: 1,
      height: 2,
    });
    
    // Add goal
    objs.push({
      id: `goal_${idCounter++}`,
      type: "goal",
      x: template.goal.x,
      y: template.goal.y,
      width: 1,
      height: 2,
    });
    
    // Add decorations
    template.decorations.forEach((d) => {
      objs.push({
        id: `decoration_${idCounter++}`,
        type: "decoration",
        x: d.x,
        y: d.y,
        width: 1,
        height: 1,
        subtype: d.type,
        data: { layer: d.layer },
      });
    });
    
    return objs;
  }

  // Save state for undo
  const saveState = useCallback(() => {
    setUndoStack((prev) => [...prev.slice(-19), objects]);
    setRedoStack([]);
  }, [objects]);

  // Object management
  const handleObjectPlace = useCallback((x: number, y: number, type: string, subtype?: string) => {
    saveState();
    
    const config = getObjectConfig(selectedObjectType || "platform_solid");
    const width = config?.width || 1;
    const height = config?.height || 1;
    
    // Don't allow multiple spawns or goals
    if (type === "spawn" && objects.some(o => o.type === "spawn")) {
      // Move existing spawn
      setObjects(prev => prev.map(o => o.type === "spawn" ? { ...o, x, y } : o));
      return;
    }
    if (type === "goal" && objects.some(o => o.type === "goal")) {
      // Move existing goal
      setObjects(prev => prev.map(o => o.type === "goal" ? { ...o, x, y } : o));
      return;
    }
    
    const newObject: LevelObject = {
      id: `${type}_${Date.now()}`,
      type: type as LevelObject["type"],
      x,
      y,
      width,
      height,
      subtype,
    };
    
    setObjects((prev) => [...prev, newObject]);
  }, [selectedObjectType, objects, saveState]);

  const handleObjectMove = useCallback((id: string, x: number, y: number) => {
    saveState();
    setObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, x, y } : obj))
    );
  }, [saveState]);

  const handleObjectDelete = useCallback((id: string) => {
    saveState();
    setObjects((prev) => prev.filter((obj) => obj.id !== id));
    if (selectedObjectId === id) {
      setSelectedObjectId(null);
    }
  }, [selectedObjectId, saveState]);

  const handleObjectSelect = useCallback((object: LevelObject | null) => {
    setSelectedObjectId(object?.id || null);
    if (object) {
      setSelectedTool("select");
    }
  }, []);

  // Template loading
  const handleLoadTemplate = useCallback((template: LevelTemplate) => {
    saveState();
    setLevelName(template.name);
    setTheme(template.theme);
    setObjects(convertTemplateToObjects(template));
    setWinCondition(template.settings.winCondition as "reach_goal" | "collect_all_coins" | "defeat_all_enemies");
    if (template.settings.requiredCoins) {
      setRequiredCoins(template.settings.requiredCoins);
    }
    if (template.settings.timeLimit) {
      setTimeLimit(template.settings.timeLimit);
    }
  }, [saveState]);

  // Undo/Redo
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, objects]);
    setUndoStack((prev) => prev.slice(0, -1));
    setObjects(previous);
  }, [undoStack, objects]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, objects]);
    setRedoStack((prev) => prev.slice(0, -1));
    setObjects(next);
  }, [redoStack, objects]);

  // Clear level
  const handleClear = useCallback(() => {
    saveState();
    setObjects([
      { id: "spawn_1", type: "spawn", x: 2, y: 20, width: 1, height: 2 },
      { id: "goal_1", type: "goal", x: 37, y: 20, width: 1, height: 2 },
      { id: "ground_1", type: "platform", x: 0, y: 22, width: 40, height: 3, subtype: "solid" },
    ]);
  }, [saveState]);

  // Build current level data
  const getLevelData = useCallback((): LevelData => ({
    name: levelName,
    theme,
    objects,
    settings: {
      winCondition,
      requiredCoins: winCondition === "collect_all_coins" ? requiredCoins : undefined,
      timeLimit,
      levelSize,
      loops: LEVEL_SIZES[levelSize].loops || false,
    },
  }), [levelName, theme, objects, winCondition, requiredCoins, timeLimit, levelSize]);

  // Save level with feedback
  const handleSave = async () => {
    setSaveStatus("saving");
    setSaveMessage("");
    try {
      await onSave?.(getLevelData());
      setSaveStatus("success");
      setSaveMessage("Level saved! 🎉");
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
        setSaveMessage("");
      }, 3000);
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Failed to save level");
      // Reset status after 5 seconds
      setTimeout(() => {
        setSaveStatus("idle");
        setSaveMessage("");
      }, 5000);
    }
  };

  // Test level - open test mode modal
  const handleTest = () => {
    setShowTestMode(true);
    onTest?.(getLevelData());
  };

  // Get canvas width based on level size
  const canvasWidth = LEVEL_SIZES[levelSize].width;

  const coinCount = objects.filter(o => o.type === "coin").length;
  const enemyCount = objects.filter(o => o.type === "enemy").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
      {/* Save Status Toast */}
      <AnimatePresence>
        {saveStatus !== "idle" && saveStatus !== "saving" && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className={`fixed top-4 left-1/2 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
              saveStatus === "success" 
                ? "bg-emerald-500 text-white" 
                : "bg-red-500 text-white"
            }`}
          >
            {saveStatus === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{saveMessage}</span>
            <button 
              onClick={() => { setSaveStatus("idle"); setSaveMessage(""); }}
              className="p-1 hover:bg-white/20 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Mode Modal */}
      {showTestMode && (
        <TestModeModal
          levelData={getLevelData()}
          heroPixels={heroPixels}
          onClose={() => setShowTestMode(false)}
        />
      )}

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Level Designer
            </div>
            
            {/* Level Name */}
            <input
              type="text"
              value={levelName}
              onChange={(e) => setLevelName(e.target.value)}
              className="bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-700 focus:border-violet-500 outline-none text-sm font-medium"
              placeholder="Level name..."
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Stats */}
            <div className="flex items-center gap-3 text-sm text-white/70 mr-4">
              <span>🪙 {coinCount}</span>
              <span>👾 {enemyCount}</span>
              <span className="text-violet-400">{LEVEL_SIZES[levelSize].icon} {LEVEL_SIZES[levelSize].label}</span>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings ? "bg-violet-500 text-white" : "bg-slate-700 text-white/70 hover:text-white"
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={handleTest}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
            >
              <Play className="w-4 h-4" />
              Test
            </button>

            <button
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                saveStatus === "success" 
                  ? "bg-emerald-500 text-white" 
                  : saveStatus === "error"
                  ? "bg-red-500 text-white"
                  : "bg-violet-500 text-white hover:bg-violet-600"
              }`}
            >
              {saveStatus === "saving" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saveStatus === "success" ? (
                <Check className="w-4 h-4" />
              ) : saveStatus === "error" ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saveStatus === "saving" ? "Saving..." : saveStatus === "success" ? "Saved!" : "Save"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-4">
        <div className="grid lg:grid-cols-[280px_1fr_280px] gap-4">
          {/* Left Panel - Templates & Objects */}
          <div className="space-y-4">
            <LevelTemplates
              onSelectTemplate={handleLoadTemplate}
              selectedTemplateId={null}
            />
            
            <ObjectPalette
              selectedObject={selectedObjectType}
              onSelectObject={(id) => {
                setSelectedObjectType(id);
                setSelectedTool("place");
              }}
            />
          </div>

          {/* Center - Canvas */}
          <div className="space-y-4 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-slate-800 rounded-xl p-2">
              <div className="flex items-center gap-1">
                {[
                  { id: "select", icon: MousePointer, label: "Select" },
                  { id: "place", icon: Pencil, label: "Place" },
                  { id: "erase", icon: Eraser, label: "Erase" },
                  { id: "pan", icon: Hand, label: "Pan" },
                ].map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id as Tool)}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedTool === tool.id
                        ? "bg-violet-500 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                    title={tool.label}
                  >
                    <tool.icon className="w-5 h-5" />
                  </button>
                ))}

                <div className="w-px h-6 bg-slate-700 mx-2" />

                <button
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                  className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
                  title="Undo"
                >
                  <Undo2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
                  title="Redo"
                >
                  <Redo2 className="w-5 h-5" />
                </button>

                <div className="w-px h-6 bg-slate-700 mx-2" />

                <button
                  onClick={handleClear}
                  className="p-2 rounded-lg text-white/70 hover:text-red-400 hover:bg-red-500/10"
                  title="Clear Level"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">Theme:</span>
                <div className="flex gap-1">
                  {Object.values(THEMES).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        theme === t.id
                          ? "ring-2 ring-violet-400 ring-offset-2 ring-offset-slate-800"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: t.backgroundColor }}
                      title={t.name}
                    >
                      {t.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Canvas */}
            <LevelCanvas
              width={canvasWidth}
              theme={theme}
              objects={objects}
              selectedTool={selectedTool}
              selectedObjectType={selectedObjectType || undefined}
              selectedObjectId={selectedObjectId}
              onObjectPlace={handleObjectPlace}
              onObjectMove={handleObjectMove}
              onObjectDelete={handleObjectDelete}
              onObjectSelect={handleObjectSelect}
              isInfinite={LEVEL_SIZES[levelSize].loops || false}
            />

            {/* Instructions */}
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <p className="text-white/70 text-sm">
                <span className="text-violet-400">Click</span> to place • 
                <span className="text-violet-400"> Right-click</span> to delete • 
                <span className="text-violet-400"> Drag</span> to move objects
              </p>
            </div>
          </div>

          {/* Right Panel - Settings */}
          <div className="space-y-4">
            {/* Level Size Selector - Always visible */}
            <div className="bg-slate-800 rounded-2xl p-4">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-2xl">📐</span>
                Level Size
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(LEVEL_SIZES) as [LevelSize, typeof LEVEL_SIZES[LevelSize]][]).map(([key, size]) => (
                  <motion.button
                    key={key}
                    onClick={() => setLevelSize(key)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      levelSize === key
                        ? "bg-violet-500 ring-2 ring-violet-300"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{size.icon}</span>
                      <span className="text-white font-medium">{size.label}</span>
                    </div>
                    <p className="text-xs text-white/60">{size.description}</p>
                  </motion.button>
                ))}
              </div>
              {levelSize === "infinite" && (
                <div className="mt-3 p-2 bg-violet-500/20 rounded-lg border border-violet-500/30">
                  <p className="text-xs text-violet-300 flex items-center gap-2">
                    <span>♾️</span>
                    The level will loop seamlessly forever!
                  </p>
                </div>
              )}
            </div>

            {/* Level Settings */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-800 rounded-2xl p-4 space-y-4"
                >
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Settings
                  </h3>

                  {/* Win Condition */}
                  <div>
                    <label className="text-sm text-white/70 block mb-2">Win Condition</label>
                    <select
                      value={winCondition}
                      onChange={(e) => setWinCondition(e.target.value as typeof winCondition)}
                      className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 ring-violet-500"
                    >
                      <option value="reach_goal">🚩 Reach the Goal</option>
                      <option value="collect_all_coins">🪙 Collect All Coins</option>
                      <option value="defeat_all_enemies">👾 Defeat All Enemies</option>
                    </select>
                  </div>

                  {/* Required Coins (if applicable) */}
                  {winCondition === "collect_all_coins" && (
                    <div>
                      <label className="text-sm text-white/70 block mb-2">
                        Required Coins ({coinCount} placed)
                      </label>
                      <input
                        type="number"
                        value={requiredCoins}
                        onChange={(e) => setRequiredCoins(parseInt(e.target.value) || 0)}
                        min={1}
                        max={coinCount}
                        className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 ring-violet-500"
                      />
                    </div>
                  )}

                  {/* Time Limit */}
                  <div>
                    <label className="text-sm text-white/70 block mb-2">
                      Time Limit (seconds, 0 = none)
                    </label>
                    <input
                      type="number"
                      value={timeLimit || 0}
                      onChange={(e) => setTimeLimit(parseInt(e.target.value) || undefined)}
                      min={0}
                      max={300}
                      className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 ring-violet-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Tips */}
            <div className="bg-slate-800 rounded-2xl p-4">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Tips for {childName}
              </h3>
              
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Start with a template for inspiration!
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Make sure there's a path from spawn to goal
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Add coins to make it more fun
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Test your level often!
                </li>
              </ul>
            </div>

            {/* Preview */}
            <div className="bg-slate-800 rounded-2xl p-4">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-2xl">🎮</span>
                Your Level
              </h3>
              
              <div className="text-sm text-white/70 space-y-2">
                <p><span className="text-white">Name:</span> {levelName}</p>
                <p><span className="text-white">Theme:</span> {THEMES[theme].name} {THEMES[theme].icon}</p>
                <p><span className="text-white">Coins:</span> {coinCount} 🪙</p>
                <p><span className="text-white">Enemies:</span> {enemyCount} 👾</p>
                <p><span className="text-white">Goal:</span> {
                  winCondition === "reach_goal" ? "Reach the flag 🚩" :
                  winCondition === "collect_all_coins" ? `Collect ${requiredCoins} coins 🪙` :
                  "Defeat all enemies 👾"
                }</p>
                {timeLimit && <p><span className="text-white">Time:</span> {timeLimit}s ⏱️</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


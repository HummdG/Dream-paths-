"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { LEVEL_TEMPLATES, THEMES, LevelTemplate, ThemeId } from "@/lib/level-templates";

interface LevelTemplatesProps {
  onSelectTemplate: (template: LevelTemplate) => void;
  selectedTemplateId?: string | null;
}

export function LevelTemplates({
  onSelectTemplate,
  selectedTemplateId,
}: LevelTemplatesProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeId | "all">("all");
  const [page, setPage] = useState(0);
  const templatesPerPage = 4;

  const filteredTemplates = activeTheme === "all"
    ? LEVEL_TEMPLATES
    : LEVEL_TEMPLATES.filter(t => t.theme === activeTheme);

  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
  const currentTemplates = filteredTemplates.slice(
    page * templatesPerPage,
    (page + 1) * templatesPerPage
  );

  const handleThemeChange = (theme: ThemeId | "all") => {
    setActiveTheme(theme);
    setPage(0);
  };

  // Mini preview renderer
  const renderMiniPreview = (template: LevelTemplate) => {
    const theme = THEMES[template.theme];
    const previewWidth = 80;
    const previewHeight = 50;
    const scale = previewWidth / 40; // 40 tiles wide

    return (
      <div
        className="rounded overflow-hidden"
        style={{
          width: previewWidth,
          height: previewHeight,
          backgroundColor: theme.backgroundColor,
          position: "relative",
        }}
      >
        {/* Platforms */}
        {template.platforms.slice(0, 6).map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x * scale,
              top: p.y * scale,
              width: p.width * scale,
              height: Math.max(p.height * scale, 2),
              backgroundColor: theme.platformColor,
              borderRadius: 1,
            }}
          />
        ))}
        
        {/* Coins */}
        {template.coins.slice(0, 4).map((c, i) => (
          <div
            key={`coin-${i}`}
            style={{
              position: "absolute",
              left: c.x * scale - 2,
              top: c.y * scale - 2,
              width: 4,
              height: 4,
              backgroundColor: "#ffd700",
              borderRadius: "50%",
            }}
          />
        ))}

        {/* Goal */}
        <div
          style={{
            position: "absolute",
            left: template.goal.x * scale - 2,
            top: template.goal.y * scale - 4,
            width: 4,
            height: 8,
            backgroundColor: "#22c55e",
            borderRadius: 1,
          }}
        />

        {/* Player spawn */}
        <div
          style={{
            position: "absolute",
            left: template.playerSpawn.x * scale - 2,
            top: template.playerSpawn.y * scale - 3,
            width: 4,
            height: 6,
            backgroundColor: "#a855f7",
            borderRadius: 1,
          }}
        />
      </div>
    );
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-violet-400" />
        Templates
      </h3>

      {/* Theme Filter */}
      <div className="flex flex-wrap gap-1 mb-4">
        <button
          onClick={() => handleThemeChange("all")}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
            activeTheme === "all"
              ? "bg-violet-500 text-white"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          🌟 All
        </button>
        {Object.values(THEMES).map(theme => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTheme === theme.id
                ? "bg-violet-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {theme.icon}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <AnimatePresence mode="wait">
          {currentTemplates.map((template, i) => (
            <motion.button
              key={template.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectTemplate(template)}
              className={`p-2 rounded-xl transition-all text-left ${
                selectedTemplateId === template.id
                  ? "bg-violet-500 ring-2 ring-violet-300"
                  : "bg-slate-700/50 hover:bg-slate-700"
              }`}
            >
              {/* Preview */}
              <div className="flex justify-center mb-2">
                {renderMiniPreview(template)}
              </div>
              
              {/* Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm">{THEMES[template.theme].icon}</span>
                  <p className="text-xs font-medium text-white truncate">
                    {template.name}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    template.difficulty === "easy" ? "bg-green-500/20 text-green-300" :
                    template.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-300" :
                    "bg-red-500/20 text-red-300"
                  }`}>
                    {template.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {template.coins.length}🪙 {template.enemies.length}👾
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-lg bg-slate-700 text-white/70 hover:bg-slate-600 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-400">{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-1.5 rounded-lg bg-slate-700 text-white/70 hover:bg-slate-600 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <p className="text-[10px] text-slate-500 mt-3 text-center">
        Click a template to start, then customize it!
      </p>
    </div>
  );
}



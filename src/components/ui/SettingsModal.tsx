// SettingsModal.tsx
import React, { useState } from "react";
import { type TimerMode } from "../../App";

interface SettingsModalProps {
  durations: Record<TimerMode, number>;
  setDurations: (durations: Record<TimerMode, number>) => void;
  theme: string;
  setTheme: (theme: string) => void;
  setThemePreview: (theme: string) => void;
  onClose: (revertPreview?: boolean) => void;
}

export function SettingsModal({
  durations,
  setDurations,
  theme,
  setTheme,
  setThemePreview,
  onClose,
}: SettingsModalProps) {
  const [localFocus, setLocalFocus] = useState(durations.focus / 60);
  const [localShort, setLocalShort] = useState(durations.short / 60);
  const [localLong, setLocalLong] = useState(durations.long / 60);
  const [localTheme, setLocalTheme] = useState(theme);

  const handleThemeChangePreview = (themeId: string) => {
    setLocalTheme(themeId);
    setThemePreview(themeId); // Real-time preview alteration
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDurations({
      focus: Math.max(1, localFocus) * 60,
      short: Math.max(1, localShort) * 60,
      long: Math.max(1, localLong) * 60,
    });
    setTheme(localTheme); // Locks in theme changes permanently
    onClose(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-md"
        onClick={() => onClose(true)}
      />

      {/* Modal Box Layout */}
      <div className="relative w-full h-full sm:h-auto sm:max-w-md bg-background border-0 sm:border border-accent/20 sm:rounded-2xl shadow-2xl flex flex-col p-8 z-10 transition-all duration-300">
        {/* Header Title Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-header text-xl tracking-tight text-accent uppercase">
            Configuration
          </h2>
          <button
            type="button"
            onClick={() => onClose(true)}
            className="text-subtext/60 hover:text-maintext transition-colors text-sm font-bold tracking-wider uppercase cursor-pointer"
          >
            Close
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="flex flex-col flex-1 justify-between sm:justify-start gap-8"
        >
          <div className="flex flex-col gap-6">
            {/* 1. TIMER CONFIGURATIONS */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-subtext/60 mb-3">
                Durations (Minutes)
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-subtext capitalize">Focus</span>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={localFocus}
                    onChange={(e) =>
                      setLocalFocus(parseInt(e.target.value) || 1)
                    }
                    className="bg-accent/5 border border-accent/20 focus:border-accent outline-none px-3 py-2 text-sm rounded-lg tabular-nums text-maintext"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-subtext capitalize">Short</span>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={localShort}
                    onChange={(e) =>
                      setLocalShort(parseInt(e.target.value) || 1)
                    }
                    className="bg-accent/5 border border-accent/20 focus:border-accent outline-none px-3 py-2 text-sm rounded-lg tabular-nums text-maintext"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-subtext capitalize">Long</span>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={localLong}
                    onChange={(e) =>
                      setLocalLong(parseInt(e.target.value) || 1)
                    }
                    className="bg-accent/5 border border-accent/20 focus:border-accent outline-none px-3 py-2 text-sm rounded-lg tabular-nums text-maintext"
                  />
                </label>
              </div>
            </div>

            {/* 2. THEME SELECTION ENVIRONMENT */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-subtext/60 mb-3">
                Space Atmosphere
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: "default",
                    name: "Obsidian Lavender",
                    color: "bg-[#9d85bb]",
                  },
                  { id: "emerald", name: "Jade Nebula", color: "bg-[#50bfa0]" },
                  { id: "amber", name: "Solar Flare", color: "bg-[#dfa442]" },
                  { id: "ocean", name: "Astro Ocean", color: "bg-[#3a9fd4]" },
                  {
                    id: "blood",
                    name: "Crimson Eclipse",
                    color: "bg-[#e24a4a]",
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleThemeChangePreview(t.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 border rounded-xl text-xs font-medium cursor-pointer transition-all ${
                      localTheme === t.id
                        ? "border-accent bg-accent/10 text-maintext"
                        : "border-accent/15 text-subtext hover:text-maintext hover:border-accent/40"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Submission Button */}
          <button
            type="submit"
            className="w-full bg-accent text-background font-bold text-sm uppercase py-3.5 tracking-widest rounded-xl hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer mt-4"
          >
            Apply Changes
          </button>
        </form>
      </div>
    </div>
  );
}

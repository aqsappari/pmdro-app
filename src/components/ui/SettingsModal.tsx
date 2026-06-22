// SettingsModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { LuRefreshCcw, LuTrash2, LuX } from "react-icons/lu";
import { type TimerMode } from "../../App";

interface SettingsModalProps {
  durations: Record<TimerMode, number>;
  setDurations: (durations: Record<TimerMode, number>) => void;
  theme: string;
  setTheme: (theme: string) => void;
  setThemePreview: (theme: string) => void;
  onClose: (revertPreview?: boolean) => void;
  storageError?: string | null;
  onClearLocalData: () => void;
  onResetDefaults: () => void;
}

export function SettingsModal({
  durations,
  setDurations,
  theme,
  setTheme,
  setThemePreview,
  onClose,
  storageError,
  onClearLocalData,
  onResetDefaults,
}: SettingsModalProps) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [selectedSound, setSelectedSound] = useState("default");
  const [customSoundName, setCustomSoundName] = useState("No file selected");
  const [localFocus, setLocalFocus] = useState(durations.focus / 60);
  const [localShort, setLocalShort] = useState(durations.short / 60);
  const [localLong, setLocalLong] = useState(durations.long / 60);
  const [localTheme, setLocalTheme] = useState(theme);

  // When the modal mounts, push a history entry so the browser back
  // action (or back gesture) will close the modal instead of navigating away.
  const _closedByPop = useRef(false);
  const _pushedHistory = useRef(false);
  const allowPopCloseRef = useRef(false);
  useEffect(() => {
    try {
      window.history.pushState({ modal: "settings" }, "");
      _pushedHistory.current = true;
    } catch {
      // ignore (some platforms may restrict pushState)
    }

    const onPop = (ev: PopStateEvent) => {
      // Ignore immediate popstate events that may fire during mount.
      if (!allowPopCloseRef.current) return;
      // Only handle popstate for our pushed modal entry.
      const state = ev.state as { modal?: string } | null;
      if (state?.modal === "settings") {
        _closedByPop.current = true;
        onClose(true);
      }
    };

    window.addEventListener("popstate", onPop);
    // Allow pop to close after a short delay (prevent immediate auto-close).
    const allowId = window.setTimeout(() => {
      allowPopCloseRef.current = true;
    }, 200);

    return () => {
      window.removeEventListener("popstate", onPop);
      window.clearTimeout(allowId);
    };
  }, [onClose]);

  // Prevent the click that opened the modal from immediately closing it.
  const ignoreBackdropClickRef = useRef(true);
  useEffect(() => {
    const id = window.setTimeout(() => {
      ignoreBackdropClickRef.current = false;
    }, 150);
    return () => window.clearTimeout(id);
  }, []);

  const handleBackdropClick = () => {
    if (ignoreBackdropClickRef.current) return;
    onClose(true);
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:px-6 sm:py-8">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      <div className="relative w-full sm:max-w-5xl max-h-[calc(100vh-2rem)] bg-background border border-accent/20 sm:rounded-4xl shadow-2xl flex flex-col overflow-hidden z-10">
        <div className="flex items-center justify-between gap-3 border-b border-accent/10 bg-background/90 px-6 py-5 shrink-0">
          <div>
            <h2 className="text-lg sm:text-2xl font-header tracking-tight text-accent uppercase">
              Configuration
            </h2>
            <p className="text-sm text-subtext/70 mt-1">
              Adjust durations, theme, and alarm preferences.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {storageError && (
              <div className="rounded-full bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300">
                {storageError}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowConfirmClear(true)}
              aria-label="Clear local data"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/15 bg-surface/80 text-subtext transition hover:border-accent hover:text-maintext"
            >
              <LuTrash2 className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onResetDefaults}
              aria-label="Reset defaults"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/15 bg-surface/80 text-subtext transition hover:border-accent hover:text-maintext"
            >
              <LuRefreshCcw className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => onClose(true)}
              aria-label="Close settings"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/15 bg-surface/80 text-subtext transition hover:border-accent hover:text-maintext"
            >
              <LuX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {showConfirmClear && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-[1.5rem] border border-accent/20 bg-background/95 p-6 shadow-2xl backdrop-blur-xl">
              <p className="text-sm leading-7 text-subtext">
                Are you sure you want to clear all local data? This cannot be
                undone.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowConfirmClear(false)}
                  className="rounded-2xl border border-accent/15 bg-surface/80 px-4 py-3 text-sm font-medium text-subtext transition hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearLocalData();
                    setShowConfirmClear(false);
                  }}
                  className="rounded-2xl bg-accent px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-background transition hover:opacity-90"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="flex h-full flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scroll">
            <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-start">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-subtext/60 mb-3">
                  Durations (Minutes)
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="flex flex-col gap-2 rounded-3xl border border-accent/15 bg-surface/90 p-4">
                    <span className="text-xs font-medium text-subtext capitalize">
                      Focus
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={localFocus}
                      onChange={(e) =>
                        setLocalFocus(parseInt(e.target.value) || 1)
                      }
                      className="rounded-2xl border border-accent/15 bg-background px-3 py-3 text-sm text-maintext outline-none focus:border-accent"
                    />
                  </label>
                  <label className="flex flex-col gap-2 rounded-3xl border border-accent/15 bg-surface/90 p-4">
                    <span className="text-xs font-medium text-subtext capitalize">
                      Short
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={localShort}
                      onChange={(e) =>
                        setLocalShort(parseInt(e.target.value) || 1)
                      }
                      className="rounded-2xl border border-accent/15 bg-background px-3 py-3 text-sm text-maintext outline-none focus:border-accent"
                    />
                  </label>
                  <label className="flex flex-col gap-2 rounded-3xl border border-accent/15 bg-surface/90 p-4">
                    <span className="text-xs font-medium text-subtext capitalize">
                      Long
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={localLong}
                      onChange={(e) =>
                        setLocalLong(parseInt(e.target.value) || 1)
                      }
                      className="rounded-2xl border border-accent/15 bg-background px-3 py-3 text-sm text-maintext outline-none focus:border-accent"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-accent/15 bg-surface/90 p-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-subtext/60 mb-4">
                Space Atmosphere
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
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
                    className={`flex items-center gap-3 rounded-3xl border px-4 py-3 text-sm font-medium transition ${
                      localTheme === t.id
                        ? "border-accent bg-accent/10 text-maintext"
                        : "border-accent/15 bg-background text-subtext hover:border-accent/40 hover:text-maintext"
                    }`}
                  >
                    <span className={`h-3.5 w-3.5 rounded-full ${t.color}`} />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-accent/15 bg-surface/90 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-subtext/60">
                    Alarm Sound
                  </h3>
                  <p className="mt-2 text-sm text-subtext/70">
                    Use the default bell or upload one custom sound file.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setSelectedSound("default")}
                  className={`rounded-3xl border px-4 py-3 text-left text-sm font-medium transition ${
                    selectedSound === "default"
                      ? "border-accent bg-accent/10 text-maintext"
                      : "border-accent/15 bg-background text-subtext hover:border-accent/40 hover:text-maintext"
                  }`}
                >
                  Default Sound
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSound("custom")}
                  className={`rounded-3xl border px-4 py-3 text-left text-sm font-medium transition ${
                    selectedSound === "custom"
                      ? "border-accent bg-accent/10 text-maintext"
                      : "border-accent/15 bg-background text-subtext hover:border-accent/40 hover:text-maintext"
                  }`}
                >
                  Custom Sound
                </button>
              </div>

              <label className="mt-6 block text-xs uppercase tracking-[0.25em] text-subtext/70">
                Upload custom sound
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setSelectedSound("custom");
                    setCustomSoundName(file.name);
                  }}
                  className="mt-3 block w-full cursor-pointer rounded-3xl border border-accent/15 bg-background px-4 py-3 text-sm text-maintext"
                />
              </label>

              <div className="mt-5 rounded-3xl border border-accent/10 bg-background/80 p-4 text-sm text-subtext">
                <p>Current custom sound:</p>
                <p className="mt-2 font-medium text-maintext">
                  {customSoundName}
                </p>
                <p className="mt-3 text-xs text-subtext/60">
                  Uploading a new sound replaces the previous custom sound.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-accent/10 bg-background/95 px-6 py-5 shrink-0">
            <button
              type="submit"
              className="w-full rounded-3xl bg-accent px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-background transition hover:opacity-90"
            >
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

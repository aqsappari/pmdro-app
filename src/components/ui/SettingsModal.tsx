// SettingsModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { LuRefreshCcw, LuX } from "react-icons/lu";
import { type TimerMode } from "../../App";
import { ThemeSelector } from "./ThemeSelector";
import { DurationPicker } from "./DurationPicker";

interface SettingsModalProps {
  durations: Record<TimerMode, number>;
  setDurations: (durations: Record<TimerMode, number>) => void;
  theme: string;
  setTheme: (theme: string) => void;
  setThemePreview: (theme: string) => void;
  onClose: (revertPreview?: boolean) => void;
  storageError?: string | null;
  onClearLocalData: () => void;
}

// ==========================================
// MAIN SETTINGS MODAL CONTAINER
// ==========================================
export function SettingsModal({
  durations,
  setDurations,
  theme,
  setTheme,
  setThemePreview,
  onClose,
  storageError,
  onClearLocalData,
}: SettingsModalProps) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [selectedSound, setSelectedSound] = useState("default");
  const [customSoundName, setCustomSoundName] = useState("No file selected");

  // Parse durations into minutes and seconds local state
  const [localFocusMin, setLocalFocusMin] = useState(
    Math.floor(durations.focus / 60),
  );
  const [localFocusSec, setLocalFocusSec] = useState(durations.focus % 60);

  const [localShortMin, setLocalShortMin] = useState(
    Math.floor(durations.short / 60),
  );
  const [localShortSec, setLocalShortSec] = useState(durations.short % 60);

  const [localLongMin, setLocalLongMin] = useState(
    Math.floor(durations.long / 60),
  );
  const [localLongSec, setLocalLongSec] = useState(durations.long % 60);

  const [localTheme, setLocalTheme] = useState(theme);

  // Sync picker inputs when parent data resets or updates.
  // Run updates asynchronously to avoid cascading renders from sync setState in effects.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setLocalFocusMin(Math.floor(durations.focus / 60));
      setLocalFocusSec(durations.focus % 60);

      setLocalShortMin(Math.floor(durations.short / 60));
      setLocalShortSec(durations.short % 60);

      setLocalLongMin(Math.floor(durations.long / 60));
      setLocalLongSec(durations.long % 60);
    }, 0);

    return () => window.clearTimeout(id);
  }, [durations]);

  // Sync theme selection panel if default resets parent theme configuration
  useEffect(() => {
    const id = window.setTimeout(() => {
      setLocalTheme(theme);
    }, 0);

    return () => window.clearTimeout(id);
  }, [theme]);

  // Browser Back / History Interception Logic
  const allowPopCloseRef = useRef(false);
  useEffect(() => {
    try {
      window.history.pushState({ modal: "settings" }, "");
    } catch {
      // ignore
    }

    const onPop = (ev: PopStateEvent) => {
      if (!allowPopCloseRef.current) return;
      const state = ev.state as { modal?: string } | null;
      if (state?.modal === "settings") {
        onClose(true);
      }
    };

    window.addEventListener("popstate", onPop);
    const allowId = window.setTimeout(() => {
      allowPopCloseRef.current = true;
    }, 200);

    return () => {
      window.removeEventListener("popstate", onPop);
      window.clearTimeout(allowId);
    };
  }, [onClose]);

  // Click-Away Backdrop Logic
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
    setThemePreview(themeId);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDurations({
      focus: Math.max(1, localFocusMin * 60 + localFocusSec),
      short: Math.max(1, localShortMin * 60 + localShortSec),
      long: Math.max(1, localLongMin * 60 + localLongSec),
    });
    setTheme(localTheme);
    onClose(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:px-6 sm:py-8">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      <div className="relative w-full sm:max-w-5xl max-h-[calc(100vh-2rem)] bg-background border border-accent/20 sm:rounded-4xl shadow-2xl flex flex-col overflow-hidden z-10">
        <SettingsHeader
          storageError={storageError}
          onOpenClearConfirm={() => setShowConfirmClear(true)}
          onClose={() => onClose(true)}
        />

        <ConfirmClearOverlay
          isOpen={showConfirmClear}
          onCancel={() => setShowConfirmClear(false)}
          onConfirm={() => {
            onClearLocalData();
            setShowConfirmClear(false);
          }}
        />

        <form
          onSubmit={handleSave}
          className="flex h-full flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scroll">
            <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-start">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-subtext/60 mb-3">
                  Timer Durations
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <DurationPicker
                    label="Focus"
                    minutes={localFocusMin}
                    seconds={localFocusSec}
                    setMinutes={setLocalFocusMin}
                    setSeconds={setLocalFocusSec}
                    defaultMinutes={25}
                  />
                  <DurationPicker
                    label="Short Break"
                    minutes={localShortMin}
                    seconds={localShortSec}
                    setMinutes={setLocalShortMin}
                    setSeconds={setLocalShortSec}
                    defaultMinutes={5}
                  />
                  <DurationPicker
                    label="Long Break"
                    minutes={localLongMin}
                    seconds={localLongSec}
                    setMinutes={setLocalLongMin}
                    setSeconds={setLocalLongSec}
                    defaultMinutes={10}
                  />
                </div>
              </div>
            </div>

            <ThemeSelector
              localTheme={localTheme}
              onSelectTheme={handleThemeChangePreview}
            />

            <AlarmSoundPicker
              selectedSound={selectedSound}
              setSelectedSound={setSelectedSound}
              customSoundName={customSoundName}
              setCustomSoundName={setCustomSoundName}
            />
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

// ==========================================
// SUB-COMPONENT: HEADER
// ==========================================
interface SettingsHeaderProps {
  storageError?: string | null;
  onOpenClearConfirm: () => void;
  onClose: () => void;
}

function SettingsHeader({
  storageError,
  onOpenClearConfirm,
  onClose,
}: SettingsHeaderProps) {
  return (
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
          onClick={onOpenClearConfirm}
          aria-label="Clear local data"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/15 bg-surface/80 text-subtext transition hover:border-accent hover:text-maintext"
        >
          <LuRefreshCcw className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close settings"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/15 bg-surface/80 text-subtext transition hover:border-accent hover:text-maintext"
        >
          <LuX className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENT: CONFIRM OVERLAY
// ==========================================
interface ConfirmClearOverlayProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmClearOverlay({
  isOpen,
  onCancel,
  onConfirm,
}: ConfirmClearOverlayProps) {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl border border-accent/20 bg-background/95 p-6 shadow-2xl backdrop-blur-xl">
        <p className="text-sm leading-7 text-subtext">
          Are you sure you want to clear all local data? This cannot be undone.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-accent/15 bg-surface/80 px-4 py-3 text-sm font-medium text-subtext transition hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-2xl bg-accent px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-background transition hover:opacity-90"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENT: ALARM SOUND PANEL
// ==========================================
interface AlarmSoundPickerProps {
  selectedSound: string;
  setSelectedSound: (sound: string) => void;
  customSoundName: string;
  setCustomSoundName: (name: string) => void;
}

function AlarmSoundPicker({
  selectedSound,
  setSelectedSound,
  customSoundName,
  setCustomSoundName,
}: AlarmSoundPickerProps) {
  return (
    <div className="rounded-4xl border border-accent/15 bg-surface/90 p-6 transition-all duration-300">
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-subtext/60">
          Alarm Sound
        </h3>
        <p className="mt-1 text-sm text-subtext/70">
          Use the clean system default bell or upload your custom layout sound
          file.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setSelectedSound("default")}
          className={`rounded-3xl border px-4 py-3 text-center sm:text-left text-sm font-medium transition-all duration-200 ${
            selectedSound === "default"
              ? "border-accent bg-accent/10 text-maintext shadow-[0_0_12px_rgba(var(--accent-rgb),0.05)]"
              : "border-accent/15 bg-background text-subtext hover:border-accent/40 hover:text-maintext"
          }`}
        >
          Default Sound
        </button>
        <button
          type="button"
          onClick={() => setSelectedSound("custom")}
          className={`rounded-3xl border px-4 py-3 text-center sm:text-left text-sm font-medium transition-all duration-200 ${
            selectedSound === "custom"
              ? "border-accent bg-accent/10 text-maintext shadow-[0_0_12px_rgba(var(--accent-rgb),0.05)]"
              : "border-accent/15 bg-background text-subtext hover:border-accent/40 hover:text-maintext"
          }`}
        >
          Custom Sound
        </button>
      </div>

      {selectedSound === "custom" && (
        <div className="mt-6 space-y-5 border-t border-accent/10 pt-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="block text-xs font-bold uppercase tracking-[0.25em] text-subtext/70">
            Upload new custom sound
            <input
              type="file"
              accept="audio/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                setCustomSoundName(file.name);
              }}
              className="mt-3 block w-full cursor-pointer rounded-3xl border border-accent/15 bg-background file:mr-4 file:rounded-2xl file:border-0 file:bg-accent/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-accent hover:file:bg-accent/20 text-sm text-subtext p-1 px-3"
            />
          </label>

          <div className="rounded-3xl border border-accent/10 bg-background/50 p-4 text-sm text-subtext">
            <p className="text-xs uppercase tracking-wider text-subtext/50 font-bold">
              Current Track
            </p>
            <p className="mt-1.5 font-medium text-maintext break-all">
              {customSoundName}
            </p>
            <p className="mt-3 text-xs text-subtext/60 leading-relaxed">
              Uploading a new sound replaces the active storage slot seamlessly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

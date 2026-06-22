import { useEffect, useState } from "react";
import { loadState, saveState, clearState } from "./utils/storage";
import { Header } from "./components/blocks/Header";
import { Timer } from "./components/blocks/Timer";
import { TodoList } from "./components/blocks/TodoList";
import { CosmicBackground } from "./components/ui/CosmicBackground";
import { SettingsModal } from "./components/ui/SettingsModal";
import { Toast } from "./components/ui/Toast";

export type TimerMode = "focus" | "short" | "long";

export default function App() {
  const initialState = (() => {
    try {
      return loadState();
    } catch {
      return null;
    }
  })();

  // Theme state: default, custom-violet, deep-emerald, etc.
  const [theme, setTheme] = useState<string>(
    () => initialState?.theme ?? "default",
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [themePreview, setThemePreview] = useState<string>(
    () => initialState?.themePreview ?? initialState?.theme ?? "default",
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom durations stored in seconds
  const [durations, setDurations] = useState<Record<TimerMode, number>>(
    () =>
      (initialState?.durations as Record<TimerMode, number>) ?? {
        focus: 25 * 60,
        short: 5 * 60,
        long: 10 * 60,
      },
  );

  // Track and apply the active theme class directly to the DOM root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(
      "theme-violet",
      "theme-emerald",
      "theme-amber",
      "theme-ocean",
      "theme-blood",
    );

    if (themePreview !== "default") {
      root.classList.add(`theme-${themePreview}`);
    }
  }, [themePreview]);

  const [storageError, setStorageError] = useState<string | null>(null);

  // Persist theme + durations into single state object
  useEffect(() => {
    try {
      saveState({ theme, themePreview, durations });
    } catch {
      console.warn("Failed to save settings: storage unavailable");
    }
  }, [theme, themePreview, durations]);

  const clearLocalData = () => {
    try {
      clearState();
      const defaults = { focus: 25 * 60, short: 5 * 60, long: 10 * 60 };
      setTheme("default");
      setThemePreview("default");
      setDurations(defaults);
      try {
        saveState({
          theme: "default",
          themePreview: "default",
          durations: defaults,
          tasks: [],
        });
      } catch {
        // ignore
      }
      setStorageError(null);
      setToastMessage("Local data cleared");
    } catch {
      setStorageError("Failed to clear local data");
    }
  };

  const resetDefaults = () => {
    const defaults = { focus: 25 * 60, short: 5 * 60, long: 10 * 60 };
    setTheme("default");
    setThemePreview("default");
    setDurations(defaults);
    try {
      saveState({
        theme: "default",
        themePreview: "default",
        durations: defaults,
        tasks: [],
      });
      setStorageError(null);
      setToastMessage("Defaults restored");
    } catch {
      setStorageError("Failed to reset defaults");
    }
  };

  const handleOpenSettings = () => {
    // Sync preview to current active theme when opening
    setThemePreview(theme);
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = (revertPreview = true) => {
    if (revertPreview) {
      // Revert preview back to the saved active theme on cancel/dismiss
      setThemePreview(theme);
    }
    setIsSettingsOpen(false);
  };

  const handleApplyTheme = (confirmedTheme: string) => {
    setTheme(confirmedTheme);
    setThemePreview(confirmedTheme); // Forces the DOM class to match immediately
  };

  return (
    <div className="bg-background text-maintext font-body h-dvh w-full flex flex-col">
      <CosmicBackground />

      <Header onOpenSettings={handleOpenSettings} theme={theme} />

      <main className="flex-1 px-4 py-2">
        <div className="h-full w-full md:max-w-3/4 mx-auto flex flex-col xl:flex-row gap-1.5">
          <div className="w-full xl:w-3/5">
            <Timer durations={durations} />
          </div>
          <div className="grow w-full min-w-[min(100%,410px)] xl:w-2/5">
            <TodoList />
          </div>
        </div>
      </main>

      {/* Settings Modal Layer */}
      {isSettingsOpen && (
        <SettingsModal
          durations={durations}
          setDurations={setDurations}
          theme={theme}
          setTheme={handleApplyTheme}
          setThemePreview={setThemePreview}
          onClose={handleCloseSettings}
          storageError={storageError}
          onClearLocalData={clearLocalData}
          onResetDefaults={resetDefaults}
        />
      )}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

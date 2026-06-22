// App.tsx Snippet Changes
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { loadState, saveState, clearState } from "./utils/storage";
import { Header } from "./components/blocks/Header";
import { Timer } from "./components/blocks/Timer";
import { TodoList } from "./components/blocks/TodoList";
import { CosmicBackground } from "./components/ui/CosmicBackground";
import { SettingsModal } from "./components/ui/SettingsModal";
import { Toast } from "./components/ui/Toast";

// Define the interface here so App knows about it
interface TaskProps {
  id: number;
  text: string;
  completed: boolean;
  completedAt?: number;
}

export type TimerMode = "focus" | "short" | "long";

export default function App() {
  const initialState = (() => {
    try {
      return loadState();
    } catch {
      return null;
    }
  })();

  const [theme, setTheme] = useState<string>(
    () => initialState?.theme ?? "default",
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [themePreview, setThemePreview] = useState<string>(
    () => initialState?.themePreview ?? initialState?.theme ?? "default",
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [durations, setDurations] = useState<Record<TimerMode, number>>(
    () =>
      (initialState?.durations as Record<TimerMode, number>) ?? {
        focus: 25 * 60,
        short: 5 * 60,
        long: 10 * 60,
      },
  );

  // ==========================================
  // LIFTED TASK STATE
  // ==========================================
  const [tasks, setTasks] = useState<TaskProps[]>(() => {
    try {
      return (initialState?.tasks as TaskProps[]) ?? [];
    } catch {
      return [];
    }
  });

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

  // Save changes automatically when tasks, theme, or durations change
  useEffect(() => {
    try {
      saveState({ theme, themePreview, durations, tasks });
    } catch {
      console.warn("Failed to save settings: storage unavailable");
    }
  }, [theme, themePreview, durations, tasks]);

  const clearLocalData = () => {
    try {
      clearState();
      const defaults = { focus: 25 * 60, short: 5 * 60, long: 10 * 60 };
      setTheme("default");
      setThemePreview("default");
      setDurations(defaults);
      setTasks([]); // <--- Instantly flushes the UI list in real-time!

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

  const handleOpenSettings = () => {
    setThemePreview(theme);
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = (revertPreview = true) => {
    if (revertPreview) {
      setThemePreview(theme);
    }
    setIsSettingsOpen(false);
  };

  const handleApplyTheme = (confirmedTheme: string) => {
    setTheme(confirmedTheme);
    setThemePreview(confirmedTheme);
  };

  return (
    <div className="bg-background text-maintext font-body h-dvh w-full flex flex-col select-none">
      <CosmicBackground />

      <Header onOpenSettings={handleOpenSettings} theme={theme} />

      <main className="flex-1 px-4 py-2">
        <div className="h-full w-full md:max-w-3/4 mx-auto flex flex-col xl:flex-row gap-1.5">
          <div className="w-full xl:w-3/5">
            <Timer durations={durations} />
          </div>
          <div className="grow w-full min-w-[min(100%,410px)] xl:w-2/5">
            {/* Pass state elements down to the TodoList block component */}
            <TodoList tasks={tasks} setTasks={setTasks} />
          </div>
        </div>
      </main>

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
        />
      )}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      <Analytics />
    </div>
  );
}

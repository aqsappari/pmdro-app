import { useEffect, useState } from "react";
import { LuSettings } from "react-icons/lu";

interface UtilityProps {
  onOpenSettings: () => void;
}

export function Utility({ onOpenSettings }: UtilityProps) {
  const [timeState, setTimeState] = useState({
    timeStr: "",
    dateStr: "",
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      // Format time: e.g., 10:25pm
      const timeFormatter = new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const timeStr = timeFormatter.format(now).toLowerCase().replace(" ", "");

      // Format Date: e.g., Jun 22 - Mon
      const month = now.toLocaleDateString(navigator.language, {
        month: "short",
      });
      const day = now.getDate();
      const weekday = now.toLocaleDateString(navigator.language, {
        weekday: "short",
      });
      const dateStr = `${month} ${day} - ${weekday}`;

      setTimeState({ timeStr, dateStr });
    };

    updateClock();

    const intervalId = setInterval(updateClock, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <div className="px-4 flex flex-col items-end border-r border-accent">
        <span>{timeState.timeStr}</span>
        <span className="text-xs text-subtext">{timeState.dateStr}</span>
      </div>

      <button
        onClick={onOpenSettings}
        className="hover:text-accent hover:scale-110 active:scale-100 p-2 rounded-full transition-all duration-150 ease-out cursor-pointer bg-surface/10 border border-transparent hover:border-accent/20"
        title="Open Settings"
      >
        <LuSettings className="w-4 h-4" />
      </button>
    </div>
  );
}

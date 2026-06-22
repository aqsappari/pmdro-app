import { useEffect, useState } from "react";
import { LuSettings, LuMaximize, LuMinimize } from "react-icons/lu";

interface UtilityProps {
  onOpenSettings: () => void;
}

type FullscreenElementDocument = Document & {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
};

type FullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
};

type FullscreenHTMLElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
};

export function Utility({ onOpenSettings }: UtilityProps) {
  const [timeState, setTimeState] = useState({
    timeStr: "",
    dateStr: "",
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

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

    const updateFullscreenState = () => {
      const doc = document as FullscreenElementDocument;
      const isFull = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement,
      );
      setIsFullscreen(isFull);
    };

    updateClock();
    updateFullscreenState();

    const intervalId = setInterval(updateClock, 10000);
    document.addEventListener("fullscreenchange", updateFullscreenState);
    document.addEventListener("webkitfullscreenchange", updateFullscreenState);
    document.addEventListener("mozfullscreenchange", updateFullscreenState);
    document.addEventListener("MSFullscreenChange", updateFullscreenState);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("fullscreenchange", updateFullscreenState);
      document.removeEventListener(
        "webkitfullscreenchange",
        updateFullscreenState,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        updateFullscreenState,
      );
      document.removeEventListener("MSFullscreenChange", updateFullscreenState);
    };
  }, []);

  const toggleFullscreen = () => {
    const docEl = document.documentElement as FullscreenHTMLElement;
    const doc = document as FullscreenDocument;

    const currentDoc = document as FullscreenElementDocument;
    if (
      currentDoc.fullscreenElement ||
      currentDoc.webkitFullscreenElement ||
      currentDoc.mozFullScreenElement ||
      currentDoc.msFullscreenElement
    ) {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    } else {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="px-4 flex flex-col items-end border-r border-accent">
        <span>{timeState.timeStr}</span>
        <span className="text-xs text-subtext">{timeState.dateStr}</span>
      </div>

      <button
        onClick={toggleFullscreen}
        className="hidden md:block hover:text-accent hover:scale-110 active:scale-100 p-2 rounded-full transition-all duration-150 ease-out cursor-pointer bg-surface/10 border border-transparent hover:border-accent/20"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
          <LuMinimize className="w-4 h-4" />
        ) : (
          <LuMaximize className="w-4 h-4" />
        )}
      </button>

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

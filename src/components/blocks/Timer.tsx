import { useEffect, useRef, useState, useCallback } from "react";
import { type TimerMode } from "../../App";
import alarmAudio from "../../assets/Mudita Bell - Melodic Mirth.mp3";
import { AlarmToast } from "../ui/AlarmToast";

interface TimerProps {
  durations: Record<TimerMode, number>;
}

export function Timer({ durations }: TimerProps) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durations.focus);
  const [showAlarmToast, setShowAlarmToast] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [isFresh, setIsFresh] = useState(true);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    setHasFinished(false);
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setIsFresh(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setHasFinished(false);
    setTimeLeft(durations[mode]);
    setIsFresh(true);
  };

  const handleSkip = () => {
    if (mode === "focus") {
      handleModeChange("short");
    } else if (mode === "short") {
      handleModeChange("long");
    } else {
      handleModeChange("focus");
    }
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    setHasFinished(true);
    setShowAlarmToast(true);
    setIsFresh(false);
  };

  const stopAlarm = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      const fadeOutInterval = setInterval(() => {
        if (audio.volume <= 0.05) {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 0;
          clearInterval(fadeOutInterval);
        } else {
          audio.volume = Math.max(0, audio.volume - 0.05);
        }
      }, 100);
    }

    setShowAlarmToast(false);
    setHasFinished(false);
    setTimeLeft(durations[mode]);
    setIsFresh(true);
  }, [durations, mode]);

  const handleToggleRun = () => {
    if (hasFinished) return;
    setIsRunning((current) => {
      const next = !current;
      if (next) setIsFresh(false);
      return next;
    });
  };

  const formatTimeValues = (value: number) => {
    const minutes = Math.floor(value / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (value % 60).toString().padStart(2, "0");
    return { minutes, seconds };
  };

  const currentTimeLeft =
    isFresh && !isRunning && !showAlarmToast && !hasFinished
      ? durations[mode]
      : timeLeft;

  const { minutes, seconds } = formatTimeValues(currentTimeLeft);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (!showAlarmToast) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    audio.loop = true;
    audio.play().catch(() => {
      // autoplay can be blocked; user interaction may be required
    });

    const fadeInInterval = setInterval(() => {
      if (!audio) return;
      if (audio.volume >= 0.95) {
        audio.volume = 1;
        clearInterval(fadeInInterval);
      } else {
        audio.volume = Math.min(1, audio.volume + 0.05);
      }
    }, 100);

    return () => {
      clearInterval(fadeInInterval);
    };
  }, [showAlarmToast]);

  // Allow clicking anywhere while alarm is active to stop the ringtone.
  useEffect(() => {
    if (!showAlarmToast) return;

    const handleGlobalClick = () => {
      stopAlarm();
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, [showAlarmToast, stopAlarm]);

  const activeUnderlineStyles: Record<TimerMode, string> = {
    focus: "left-0 w-12 sm:w-14",
    short: "left-[76px] sm:left-[92px] w-[110px] sm:w-[130px]",
    long: "left-[214px] sm:left-[250px] w-[106px] sm:w-[124px]",
  };

  return (
    <section className="h-full p-8 flex flex-col justify-center items-center xl:items-start gap-8">
      <div className="relative flex gap-8 sm:gap-10 text-sm sm:text-base font-medium tracking-wider">
        <button
          onClick={() => handleModeChange("focus")}
          className={`uppercase transition-colors duration-300 pb-2 cursor-pointer ${
            mode === "focus"
              ? "text-accent font-bold"
              : "text-subtext/40 hover:text-maintext"
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => handleModeChange("short")}
          className={`uppercase transition-colors duration-300 pb-2 cursor-pointer ${
            mode === "short"
              ? "text-accent font-bold"
              : "text-subtext/40 hover:text-maintext"
          }`}
        >
          Short <span className="hidden sm:inline">Break</span>
        </button>
        <button
          onClick={() => handleModeChange("long")}
          className={`uppercase transition-colors duration-300 pb-2 cursor-pointer ${
            mode === "long"
              ? "text-accent font-bold"
              : "text-subtext/40 hover:text-maintext"
          }`}
        >
          Long <span className="hidden sm:inline">Break</span>
        </button>

        <span
          className={`absolute bottom-0 h-0.5 bg-accent rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${activeUnderlineStyles[mode]}`}
        />
      </div>

      {/* Unique Brutalist Focal Display */}
      <div className="relative flex items-center justify-center py-2 group">
        {/* Soft immersive ambient backdrop glow that wakes up when running */}
        <div
          className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 opacity-0 bg-accent/10 ${
            isRunning ? "opacity-100 scale-110" : ""
          }`}
        />

        <span
          className={`text-7xl sm:text-9xl font-header tracking-tight tabular-nums transition-all duration-500 ease-out ${
            isRunning ? "text-maintext scale-[1.02]" : ""
          }`}
        >
          {minutes}
          <span
            className={`-translate-y-4 inline-block mx-8 animate-pulse ${isRunning ? "[animation-duration:1s]" : "[animation-duration:2s]"}`}
          >
            :
          </span>
          {seconds}
        </span>
      </div>

      <audio ref={audioRef} src={alarmAudio} preload="auto" />
      {showAlarmToast && <AlarmToast onConfirm={stopAlarm} />}

      {/* Command Control Links */}
      <div className="flex items-center gap-12 text-sm font-bold tracking-widest">
        <button
          onClick={handleReset}
          className="uppercase text-subtext hover:tracking-[0.2em] active:scale-90 transition-all duration-300 cursor-pointer"
        >
          Reset
        </button>

        <button
          onClick={handleToggleRun}
          className="uppercase text-accent hover:tracking-[0.2em] active:scale-90 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.2)]"
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          onClick={handleSkip}
          className="uppercase text-subtext hover:tracking-[0.2em] active:scale-90 transition-all duration-300 cursor-pointer"
        >
          Skip
        </button>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { type TimerMode } from "../../App";

interface TimerProps {
  durations: Record<TimerMode, number>;
}

export function Timer({ durations }: TimerProps) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durations.focus);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isRunning) {
      const id = setTimeout(() => setTimeLeft(durations[mode]));
      return () => clearTimeout(id);
    }
  }, [durations, mode, isRunning]);

  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(durations[newMode]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
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
    // Optional: Add audio sound cue here
    // handleSkip(); Auto-advance to break/focus stage
  };

  const formatTimeValues = () => {
    const minutes = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");
    return { minutes, seconds };
  };

  const { minutes, seconds } = formatTimeValues();

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
          className={`text-8xl sm:text-9xl font-header tracking-tight tabular-nums transition-all duration-500 ease-out ${
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

      {/* Command Control Links */}
      <div className="flex items-center gap-12 text-sm font-bold tracking-widest">
        <button
          onClick={handleReset}
          className="uppercase text-subtext hover:tracking-[0.2em] active:scale-90 transition-all duration-300 cursor-pointer"
        >
          Reset
        </button>

        <button
          onClick={() => setIsRunning(!isRunning)}
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

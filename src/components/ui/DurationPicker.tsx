interface DurationPickerProps {
  label: string;
  minutes: number;
  seconds: number;
  setMinutes: (val: number) => void;
  setSeconds: (val: number) => void;
  defaultMinutes: number;
}

// ==========================================
// HELPERS (UPDATED)
// ==========================================
const handleNumberInput = (
  value: string,
  max: number,
  defaultValue: number,
): number => {
  // Allow empty string to mean 0 temporarily while typing,
  // so the user can backspace and type '0'
  if (value === "") return 0;
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 0) return defaultValue;
  return Math.min(num, max);
};

const formatDisplay = (value: number): string => String(value).padStart(2, "0");

// ==========================================
// SUB-COMPONENT: DURATION PICKER (UPDATED)
// ==========================================
export function DurationPicker({
  label,
  minutes,
  seconds,
  setMinutes,
  setSeconds,
  defaultMinutes,
}: DurationPickerProps) {
  // This safely checks that BOTH are not absolute zero when leaving the inputs
  const handleBlurCheck = () => {
    if (minutes === 0 && seconds === 0) {
      setMinutes(defaultMinutes);
      setSeconds(0);
    }
  };

  return (
    <div className="rounded-3xl border border-accent/15 bg-surface/90 p-4 flex flex-col">
      <span className="text-xs font-medium text-subtext capitalize block mb-3">
        {label}
      </span>
      <div className="flex items-center gap-2 w-full justify-between">
        <div className="flex flex-col flex-1 min-w-0">
          <input
            type="text"
            inputMode="numeric"
            // Displays '00' when value is 0 instead of falling back to default minutes
            value={formatDisplay(minutes)}
            onChange={(e) =>
              setMinutes(
                handleNumberInput(
                  e.target.value.replace(/\D/g, ""),
                  120,
                  defaultMinutes,
                ),
              )
            }
            onBlur={handleBlurCheck}
            placeholder={String(defaultMinutes)}
            className="w-full rounded-2xl border border-accent/15 bg-background px-2 py-2 text-center text-sm font-medium text-maintext outline-none focus:border-accent"
          />
          <span className="text-xs text-subtext/50 text-center mt-1">min</span>
        </div>
        <span className="text-sm font-bold text-subtext/50 mb-5 shrink-0">
          :
        </span>
        <div className="flex flex-col flex-1 min-w-0">
          <input
            type="text"
            inputMode="numeric"
            value={formatDisplay(seconds)}
            onChange={(e) =>
              setSeconds(
                handleNumberInput(e.target.value.replace(/\D/g, ""), 59, 0),
              )
            }
            onBlur={handleBlurCheck}
            placeholder="00"
            className="w-full rounded-2xl border border-accent/15 bg-background px-2 py-2 text-center text-sm font-medium text-maintext outline-none focus:border-accent"
          />
          <span className="text-xs text-subtext/50 text-center mt-1">sec</span>
        </div>
      </div>
    </div>
  );
}

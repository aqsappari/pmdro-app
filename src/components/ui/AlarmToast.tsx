import { LuBellRing } from "react-icons/lu";

interface AlarmToastProps {
  onConfirm: () => void;
}

export function AlarmToast({ onConfirm }: AlarmToastProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-3xl border border-accent/20 bg-surface/95 p-5 shadow-2xl backdrop-blur-md text-maintext">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent animate-bell-vibrate">
          <LuBellRing className="h-6 w-6" />
        </div>
        <div>
          <p className="font-bold text-sm">Timer complete!</p>
          <p className="text-xs text-subtext">
            Your session has ended. Confirm to stop the alarm.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onConfirm}
        className="mt-4 w-full rounded-2xl bg-accent px-4 py-3 text-sm font-bold uppercase text-background transition hover:bg-accent/95"
      >
        Confirm
      </button>
    </div>
  );
}

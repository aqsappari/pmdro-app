import { useEffect } from "react";

export function Toast({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-surface/90 text-maintext px-4 py-2 rounded-lg shadow-lg border border-accent/20 z-50">
      {message}
    </div>
  );
}

import React from "react";

export function SoundSettings({
  selectedSound,
  onSelectSound,
  onUploadSound,
}: {
  selectedSound: string;
  onSelectSound: (sound: string) => void;
  onUploadSound: (file: File) => void;
}) {
  return (
    <div className="space-y-4 rounded-3xl border border-accent/20 bg-background/95 p-5 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-subtext/80">
            Alarm Sound
          </h3>
          <p className="text-xs text-subtext/70">
            Select the default alert sound or upload your own audio file.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { id: "default", label: "Default sound" },
          { id: "custom", label: "Custom sound" },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelectSound(option.id)}
            className={`rounded-2xl border px-3 py-2 text-left text-xs font-medium transition ${
              selectedSound === option.id
                ? "border-accent bg-accent/10 text-maintext"
                : "border-accent/15 text-subtext hover:border-accent/40 hover:text-maintext"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <label className="block text-xs uppercase tracking-[0.2em] text-subtext/70">
        Upload custom sound
        <input
          type="file"
          accept="audio/*"
          onChange={(event) => {
            if (!event.target.files?.length) return;
            onUploadSound(event.target.files[0]);
          }}
          className="mt-2 block w-full cursor-pointer rounded-2xl border border-accent/15 bg-surface/10 px-3 py-2 text-sm text-maintext"
        />
      </label>

      <div className="rounded-2xl border border-accent/10 bg-surface/90 p-3 text-xs text-subtext">
        <p>
          The uploaded sound replaces the previous custom sound, but the file
          will remain persistent until refreshed.
        </p>
      </div>
    </div>
  );
}

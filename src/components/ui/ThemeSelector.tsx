interface ThemeSelectorProps {
  localTheme: string;
  onSelectTheme: (id: string) => void;
}

const THEMES = [
  { id: "default", name: "Obsidian Lavender", color: "bg-[#9d85bb]" },
  { id: "emerald", name: "Jade Nebula", color: "bg-[#50bfa0]" },
  { id: "amber", name: "Solar Flare", color: "bg-[#dfa442]" },
  { id: "ocean", name: "Astro Ocean", color: "bg-[#3a9fd4]" },
  { id: "blood", name: "Crimson Eclipse", color: "bg-[#e24a4a]" },
];

export function ThemeSelector({
  localTheme,
  onSelectTheme,
}: ThemeSelectorProps) {
  return (
    <div className="rounded-4xl border border-accent/15 bg-surface/90 p-6">
      <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-subtext/60 mb-4">
        Space Atmosphere
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectTheme(t.id)}
            className={`flex items-center gap-3 rounded-3xl border px-4 py-3 text-sm font-medium transition ${
              localTheme === t.id
                ? "border-accent bg-accent/10 text-maintext"
                : "border-accent/15 bg-background text-subtext hover:border-accent/40 hover:text-maintext"
            }`}
          >
            <span className={`h-3.5 w-3.5 rounded-full ${t.color}`} />
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}

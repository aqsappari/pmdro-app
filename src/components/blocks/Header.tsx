import { Branding } from "../ui/Branding";
import { Utility } from "../ui/Utility";

interface UtilityProps {
  onOpenSettings: () => void;
  theme: string;
}

export function Header({ onOpenSettings, theme }: UtilityProps) {
  return (
    <header className="w-full px-4 py-8 border-b border-accent/20">
      <div className="w-full md:max-w-3/4 mx-auto flex justify-between items-center">
        <Branding theme={theme} />

        <Utility onOpenSettings={onOpenSettings} />
      </div>
    </header>
  );
}

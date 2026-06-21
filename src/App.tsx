import { useState } from "react";

export default function App() {
  // Simple state to toggle between 'purple' and 'red' themes
  const [theme, setTheme] = useState("purple");

  return (
    <div
      className={`${theme} bg-background text-maintext font-body h-dvh w-full flex flex-col`}
    >
      <header className="flex w-full justify-between items-center px-56">
        {/* Uses Comfortaa automatically because it's an h1 */}
        <Branding />

        <button onClick={() => setTheme(theme === "purple" ? "red" : "purple")}>
          Switch Theme
        </button>
      </header>

      <main>
        {/* Uses Quicksand automatically because it's body text */}
        <p>Your minimalist focus space.</p>
      </main>
    </div>
  );
}

function Branding() {
  return (
    <div className="branding">
      <img
        src="/android-chrome-512x512.png"
        alt="pdrmo_logo"
        width={32}
        height={32}
      />
      <h1 className="text-accent">pmdro</h1>
    </div>
  );
}

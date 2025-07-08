import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ||
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      aria-label="Toggle dark mode"
      className="rounded-full p-2 bg-[var(--card)] border border-[var(--border)] shadow transition"
      onClick={() => setIsDark((d) => !d)}
    >
      {isDark ? (
        <Sun className="w-6 h-6 text-yellow-400" /> // Day icon for dark mode
      ) : (
        <Moon className="w-6 h-6 text-blue-700" /> // Night icon for light mode
      )}
    </button>
  );
} 
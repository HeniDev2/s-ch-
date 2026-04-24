"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, BookMarked } from "lucide-react";

type Theme = "light" | "dark" | "sepia";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = (document.documentElement.getAttribute("data-theme") ||
      "light") as Theme;
    setTheme(current);

    // Keep in sync when theme is toggled elsewhere (e.g. keyboard shortcut)
    const observer = new MutationObserver(() => {
      const now = (document.documentElement.getAttribute("data-theme") ||
        "light") as Theme;
      setTheme(now);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("reader:theme", next);
    } catch {}
  }

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Sáng", icon: <Sun size={15} /> },
    { value: "sepia", label: "Sepia", icon: <BookMarked size={15} /> },
    { value: "dark", label: "Tối", icon: <Moon size={15} /> },
  ];

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] p-0.5"
      suppressHydrationWarning
    >
      {options.map((o) => {
        const active = mounted && theme === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => apply(o.value)}
            aria-label={`Chế độ ${o.label}`}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition ${
              active
                ? "bg-[color:var(--accent)] text-white"
                : "text-[color:var(--muted)] hover:text-[color:var(--fg)]"
            }`}
          >
            {o.icon}
            <span className="hidden sm:inline">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

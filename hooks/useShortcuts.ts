"use client";

import { useEffect } from "react";

type Handlers = Record<string, (e: KeyboardEvent) => void>;

export function useShortcuts(handlers: Handlers) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isTyping =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (target && target.isContentEditable);

      // Escape always works, even when typing
      if (e.key === "Escape" && handlers.Escape) {
        handlers.Escape(e);
        return;
      }
      if (isTyping) return;

      // Ignore if modifier is held (except our "/" override)
      if (e.metaKey || e.ctrlKey || e.altKey) {
        if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
          // Cmd/Ctrl+F opens our search too
          const h = handlers["/"];
          if (h) h(e);
        }
        return;
      }

      const h = handlers[e.key];
      if (h) h(e);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlers]);
}

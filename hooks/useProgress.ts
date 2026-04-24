"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Stored = {
  slug: string;
  pct: number;
  lastHeading?: string;
  updatedAt: number;
  scrollY?: number;
};

export function useProgress(
  slug: string,
  contentRef: React.RefObject<HTMLDivElement | null>,
) {
  const [progress, setProgress] = useState(0);
  const [currentHeading, setCurrentHeading] = useState("");
  const saveTimer = useRef<number | null>(null);
  const restored = useRef(false);

  /* ---- restore last position on mount ---- */
  useEffect(() => {
    if (restored.current) return;
    try {
      const raw = localStorage.getItem(`reader:progress:${slug}`);
      if (!raw) {
        restored.current = true;
        return;
      }
      const p = JSON.parse(raw) as Stored;
      // wait one frame so content has laid out
      requestAnimationFrame(() => {
        if (typeof p.scrollY === "number" && p.scrollY > 0) {
          window.scrollTo({ top: p.scrollY, behavior: "auto" });
        }
        restored.current = true;
      });
    } catch {
      restored.current = true;
    }
  }, [slug]);

  /* ---- track scroll progress ---- */
  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? window.scrollY / scrollable : 0;
      setProgress(Math.max(0, Math.min(1, pct)));
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /* ---- debounced save ---- */
  useEffect(() => {
    if (!restored.current) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        const payload: Stored = {
          slug,
          pct: progress * 100,
          lastHeading: currentHeading,
          scrollY: window.scrollY,
          updatedAt: Date.now(),
        };
        localStorage.setItem(
          `reader:progress:${slug}`,
          JSON.stringify(payload),
        );
      } catch {}
    }, 400);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [progress, slug, currentHeading]);

  const setHeading = useCallback((h: string) => {
    setCurrentHeading(h);
  }, []);

  return {
    progress,
    currentHeading,
    setCurrentHeading: setHeading,
    contentRef,
  };
}

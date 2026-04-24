"use client";

import { useEffect, useRef, useState } from "react";
import { Type } from "lucide-react";

const FONT_SIZES = [
  "0.95rem",
  "1rem",
  "1.0625rem",
  "1.125rem",
  "1.1875rem",
  "1.25rem",
  "1.375rem",
];
const WIDTHS = ["56ch", "64ch", "68ch", "76ch", "84ch"];

export function TypographyControls() {
  const [open, setOpen] = useState(false);
  const [fontIdx, setFontIdx] = useState(3);
  const [widthIdx, setWidthIdx] = useState(2);
  const popRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const fs = localStorage.getItem("reader:font-size");
      const rw = localStorage.getItem("reader:width");
      if (fs) {
        const i = FONT_SIZES.indexOf(fs);
        if (i >= 0) setFontIdx(i);
      }
      if (rw) {
        const i = WIDTHS.indexOf(rw);
        if (i >= 0) setWidthIdx(i);
      }
    } catch {}
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function applyFont(idx: number) {
    setFontIdx(idx);
    const v = FONT_SIZES[idx];
    document.documentElement.style.setProperty("--reader-font-size", v);
    try {
      localStorage.setItem("reader:font-size", v);
    } catch {}
  }

  function applyWidth(idx: number) {
    setWidthIdx(idx);
    const v = WIDTHS[idx];
    document.documentElement.style.setProperty("--reader-width", v);
    try {
      localStorage.setItem("reader:width", v);
    } catch {}
  }

  return (
    <div className="relative" ref={popRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Kiểu chữ"
        title="Kiểu chữ"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--muted)] transition hover:bg-[color:var(--surface-2)] hover:text-[color:var(--fg)]"
      >
        <Type size={17} />
      </button>
      {open ? (
        <div className="absolute right-0 top-10 z-50 w-64 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-xl">
          <div className="mb-3">
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
              Cỡ chữ
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => applyFont(Math.max(0, fontIdx - 1))}
                className="h-7 w-7 rounded-md border border-[color:var(--border)] text-sm hover:bg-[color:var(--surface-2)]"
              >
                A−
              </button>
              <div className="flex-1 text-center text-xs text-[color:var(--muted)]">
                {fontIdx + 1} / {FONT_SIZES.length}
              </div>
              <button
                type="button"
                onClick={() =>
                  applyFont(Math.min(FONT_SIZES.length - 1, fontIdx + 1))
                }
                className="h-7 w-7 rounded-md border border-[color:var(--border)] text-base hover:bg-[color:var(--surface-2)]"
              >
                A+
              </button>
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
              Độ rộng cột
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => applyWidth(Math.max(0, widthIdx - 1))}
                className="h-7 w-7 rounded-md border border-[color:var(--border)] text-sm hover:bg-[color:var(--surface-2)]"
              >
                ‹
              </button>
              <div className="flex-1 text-center text-xs text-[color:var(--muted)]">
                {WIDTHS[widthIdx]}
              </div>
              <button
                type="button"
                onClick={() =>
                  applyWidth(Math.min(WIDTHS.length - 1, widthIdx + 1))
                }
                className="h-7 w-7 rounded-md border border-[color:var(--border)] text-sm hover:bg-[color:var(--surface-2)]"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";

type Props = {
  contentRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
};

const HIT_CLASS = "reader-hit";

export function SearchOverlay({ contentRef, onClose }: Props) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<HTMLElement[]>([]);
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ---- clear old highlights ---- */
  function clearHighlights() {
    const root = contentRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>(`mark.${HIT_CLASS}`).forEach((m) => {
      const parent = m.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(m.textContent ?? ""), m);
      parent.normalize();
    });
  }

  /* ---- search logic ---- */
  useEffect(() => {
    clearHighlights();
    if (!q.trim() || q.length < 2) {
      setHits([]);
      setIdx(0);
      return;
    }
    const root = contentRef.current;
    if (!root) return;

    const needle = q.toLocaleLowerCase("vi");
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        if (!n.nodeValue) return NodeFilter.FILTER_REJECT;
        const parentEl = n.parentElement;
        if (!parentEl) return NodeFilter.FILTER_REJECT;
        if (parentEl.closest(`mark.${HIT_CLASS}`))
          return NodeFilter.FILTER_REJECT;
        const tag = parentEl.tagName;
        if (tag === "SCRIPT" || tag === "STYLE")
          return NodeFilter.FILTER_REJECT;
        return n.nodeValue.toLocaleLowerCase("vi").includes(needle)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });

    const toWrap: Text[] = [];
    let cur: Node | null = walker.nextNode();
    while (cur) {
      toWrap.push(cur as Text);
      cur = walker.nextNode();
      if (toWrap.length > 2000) break; // safety cap
    }

    const allMarks: HTMLElement[] = [];
    for (const textNode of toWrap) {
      const text = textNode.nodeValue!;
      const lc = text.toLocaleLowerCase("vi");
      const parts: (string | HTMLElement)[] = [];
      let last = 0;
      let i = lc.indexOf(needle, 0);
      while (i !== -1) {
        if (i > last) parts.push(text.slice(last, i));
        const mark = document.createElement("mark");
        mark.className = HIT_CLASS;
        mark.textContent = text.slice(i, i + q.length);
        parts.push(mark);
        allMarks.push(mark);
        last = i + q.length;
        i = lc.indexOf(needle, last);
      }
      if (last < text.length) parts.push(text.slice(last));
      if (!parts.length) continue;
      const frag = document.createDocumentFragment();
      for (const p of parts)
        frag.appendChild(
          typeof p === "string" ? document.createTextNode(p) : p,
        );
      textNode.parentNode?.replaceChild(frag, textNode);
    }

    setHits(allMarks);
    setIdx(0);
    if (allMarks[0]) {
      allMarks[0].dataset.active = "true";
      allMarks[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [q, contentRef]);

  /* ---- on unmount, clear marks ---- */
  useEffect(() => {
    return () => {
      clearHighlights();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goto(delta: 1 | -1) {
    if (!hits.length) return;
    const next = (idx + delta + hits.length) % hits.length;
    hits[idx]?.removeAttribute("data-active");
    hits[next].dataset.active = "true";
    hits[next].scrollIntoView({ behavior: "smooth", block: "center" });
    setIdx(next);
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-3">
      <div className="flex w-full max-w-2xl items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 shadow-2xl">
        <Search size={16} className="text-[color:var(--muted)]" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") goto(e.shiftKey ? -1 : 1);
            if (e.key === "Escape") onClose();
          }}
          placeholder="Tìm trong sách…"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[color:var(--muted)]"
        />
        <span className="shrink-0 text-xs text-[color:var(--muted)]">
          {hits.length ? `${idx + 1} / ${hits.length}` : q.length ? "0" : ""}
        </span>
        <button
          type="button"
          onClick={() => goto(-1)}
          disabled={!hits.length}
          className="rounded-full p-1 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] disabled:opacity-40"
          aria-label="Kết quả trước"
        >
          <ChevronUp size={16} />
        </button>
        <button
          type="button"
          onClick={() => goto(1)}
          disabled={!hits.length}
          className="rounded-full p-1 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] disabled:opacity-40"
          aria-label="Kết quả sau"
        >
          <ChevronDown size={16} />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]"
          aria-label="Đóng"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

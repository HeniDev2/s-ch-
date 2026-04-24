"use client";

import type { TocItem } from "@/lib/markdown";

type Props = {
  items: TocItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

export function TableOfContents({ items, activeId, onSelect }: Props) {
  if (!items.length) {
    return (
      <p className="text-sm text-[color:var(--muted)]">Sách không có mục lục.</p>
    );
  }

  const minLevel = Math.min(...items.map((i) => i.level));

  return (
    <nav className="text-sm">
      <ul className="space-y-0.5">
        {items.map((item) => {
          const depth = item.level - minLevel;
          const isActive = item.id === activeId;
          return (
            <li key={`${item.id}-${item.level}`}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={`block w-full truncate rounded px-2 py-1 text-left transition ${
                  isActive
                    ? "bg-[color:var(--surface-2)] font-semibold text-[color:var(--accent)]"
                    : "text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--fg)]"
                }`}
                style={{
                  paddingLeft: `${0.5 + depth * 0.9}rem`,
                  fontSize: depth === 0 ? "0.9rem" : "0.82rem",
                }}
                title={item.text}
              >
                {item.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

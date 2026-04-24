"use client";

import { X, BookmarkCheck, Trash2 } from "lucide-react";
import type { Bookmark } from "@/hooks/useBookmarks";

type Props = {
  items: Bookmark[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onGoto: (id: string) => void;
  accent: string;
};

export function BookmarksPanel({
  items,
  onClose,
  onRemove,
  onGoto,
  accent,
}: Props) {
  return (
    <div className="fixed inset-0 z-[55]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <aside
        className="absolute right-0 top-0 h-full w-[90%] max-w-sm overflow-y-auto bg-[color:var(--surface)] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <BookmarkCheck size={18} style={{ color: accent }} />
            <span>Bookmark</span>
            <span className="rounded-full bg-[color:var(--surface-2)] px-2 py-0.5 text-xs text-[color:var(--muted)]">
              {items.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-full p-1.5 hover:bg-[color:var(--surface-2)]"
          >
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="mt-10 text-center text-sm text-[color:var(--muted)]">
            Chưa có bookmark nào.
            <br />
            Nhấn <kbd className="kbd">b</kbd> để đánh dấu mục hiện tại.
          </p>
        ) : (
          <ul className="space-y-2">
            {items
              .slice()
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((b) => (
                <li
                  key={b.id}
                  className="group flex items-start gap-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)]/50 p-3"
                >
                  <button
                    type="button"
                    onClick={() => onGoto(b.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="line-clamp-2 text-sm font-medium">
                      {b.text}
                    </div>
                    <div className="mt-1 text-xs text-[color:var(--muted)]">
                      {new Date(b.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(b.id)}
                    aria-label="Xoá"
                    className="rounded-md p-1.5 text-[color:var(--muted)] opacity-0 transition hover:bg-[color:var(--surface)] hover:text-red-500 group-hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

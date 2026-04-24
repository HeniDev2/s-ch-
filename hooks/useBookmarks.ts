"use client";

import { useCallback, useEffect, useState } from "react";

export type Bookmark = {
  id: string;
  text: string;
  createdAt: number;
};

export function useBookmarks(slug: string) {
  const [items, setItems] = useState<Bookmark[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`reader:bookmarks:${slug}`);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, [slug]);

  const persist = useCallback(
    (next: Bookmark[]) => {
      setItems(next);
      try {
        localStorage.setItem(`reader:bookmarks:${slug}`, JSON.stringify(next));
      } catch {}
    },
    [slug],
  );

  const toggleCurrent = useCallback(
    (id: string | null, text: string) => {
      if (!id) return;
      setItems((prev) => {
        const exists = prev.some((x) => x.id === id);
        const next = exists
          ? prev.filter((x) => x.id !== id)
          : [...prev, { id, text: text || id, createdAt: Date.now() }];
        try {
          localStorage.setItem(
            `reader:bookmarks:${slug}`,
            JSON.stringify(next),
          );
        } catch {}
        return next;
      });
    },
    [slug],
  );

  const remove = useCallback(
    (id: string) => {
      persist(items.filter((x) => x.id !== id));
    },
    [items, persist],
  );

  return { items, toggleCurrent, remove };
}

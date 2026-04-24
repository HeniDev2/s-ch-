"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { History } from "lucide-react";
import type { Book } from "@/lib/books";

type Enriched = Book & { readingTime: number };

type Progress = {
  slug: string;
  pct: number;
  lastHeading?: string;
  updatedAt: number;
};

export function ContinueReading({ books }: { books: Enriched[] }) {
  const [items, setItems] = useState<Progress[]>([]);

  useEffect(() => {
    try {
      const all: Progress[] = [];
      for (const b of books) {
        const raw = localStorage.getItem(`reader:progress:${b.slug}`);
        if (raw) {
          const p = JSON.parse(raw) as Progress;
          if (p && p.pct > 0.5) all.push({ ...p, slug: b.slug });
        }
      }
      all.sort((a, b) => b.updatedAt - a.updatedAt);
      setItems(all.slice(0, 3));
    } catch {}
  }, [books]);

  if (!items.length) return null;

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center gap-2">
        <History size={18} className="text-[color:var(--accent)]" />
        <h2 className="font-serif text-xl font-semibold">Đọc tiếp</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const b = books.find((x) => x.slug === p.slug);
          if (!b) return null;
          return (
            <Link
              key={p.slug}
              href={`/book/${p.slug}`}
              className="flex gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3 transition hover:shadow-lg"
            >
              <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-md bg-[color:var(--surface-2)]">
                <Image
                  src={b.cover}
                  alt={b.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="truncate font-serif text-sm font-semibold">
                  {b.title}
                </h3>
                <p className="truncate text-xs text-[color:var(--muted)]">
                  {p.lastHeading ?? b.author}
                </p>
                <div className="mt-auto">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--surface-2)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round(p.pct)}%`,
                        background: b.accent,
                      }}
                    />
                  </div>
                  <div className="mt-1 text-[11px] text-[color:var(--muted)]">
                    {Math.round(p.pct)}% hoàn thành
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function LibraryHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--bg)]/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen size={22} className="text-[color:var(--accent)]" />
          <span className="font-serif text-lg font-semibold">Thư Viện</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}

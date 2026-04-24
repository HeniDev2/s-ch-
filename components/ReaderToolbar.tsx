"use client";

import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  List,
  Search,
  Keyboard,
} from "lucide-react";
import type { Book } from "@/lib/books";
import { ThemeToggle } from "./ThemeToggle";
import { TypographyControls } from "./TypographyControls";

type Props = {
  book: Book;
  currentHeading: string;
  onOpenToc: () => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onToggleBookmark: () => void;
  hasBookmarkHere: boolean;
  onOpenHelp: () => void;
};

export function ReaderToolbar({
  book,
  currentHeading,
  onOpenToc,
  onOpenSearch,
  onOpenBookmarks,
  onToggleBookmark,
  hasBookmarkHere,
  onOpenHelp,
}: Props) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--bg)]/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-[color:var(--fg)]"
          aria-label="Về thư viện"
        >
          <BookOpen size={20} className="text-[color:var(--accent)]" />
          <span className="hidden font-serif text-sm font-semibold sm:inline">
            Thư Viện
          </span>
        </Link>

        <div className="mx-2 hidden h-6 w-px bg-[color:var(--border)] sm:block" />

        <div className="min-w-0 flex-1">
          <div className="truncate font-serif text-sm font-semibold">
            {book.title}
          </div>
          {currentHeading ? (
            <div className="truncate text-xs text-[color:var(--muted)]">
              {currentHeading}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          <IconButton
            onClick={onOpenToc}
            label="Mục lục (m)"
            className="lg:hidden"
          >
            <List size={17} />
          </IconButton>
          <IconButton onClick={onOpenSearch} label="Tìm kiếm (/)">
            <Search size={17} />
          </IconButton>
          <IconButton
            onClick={onToggleBookmark}
            label={hasBookmarkHere ? "Bỏ đánh dấu (b)" : "Đánh dấu (b)"}
            active={hasBookmarkHere}
          >
            {hasBookmarkHere ? (
              <BookmarkCheck size={17} />
            ) : (
              <Bookmark size={17} />
            )}
          </IconButton>
          <IconButton
            onClick={onOpenBookmarks}
            label="Danh sách bookmark (Shift+B)"
          >
            <span className="text-[11px] font-semibold">★</span>
          </IconButton>

          <div className="mx-1 hidden h-6 w-px bg-[color:var(--border)] sm:block" />

          <TypographyControls />
          <ThemeToggle />

          <IconButton onClick={onOpenHelp} label="Phím tắt (?)">
            <Keyboard size={17} />
          </IconButton>
        </div>
      </div>
    </header>
  );
}

function IconButton({
  children,
  onClick,
  label,
  active,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition ${
        active
          ? "bg-[color:var(--accent)] text-white"
          : "text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--fg)]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import { ArrowLeft, List, X } from "lucide-react";
import type { Book } from "@/lib/books";
import type { TocItem } from "@/lib/markdown";
import { TableOfContents } from "./TableOfContents";
import { ReaderToolbar } from "./ReaderToolbar";
import { SearchOverlay } from "./SearchOverlay";
import { BookmarksPanel } from "./BookmarksPanel";
import { ShortcutsHelp } from "./ShortcutsHelp";
import { useProgress } from "@/hooks/useProgress";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useShortcuts } from "@/hooks/useShortcuts";

type Props = {
  book: Book;
  markdown: string;
  toc: TocItem[];
};

export function Reader({ book, markdown, toc }: Props) {
  const [tocOpen, setTocOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const { progress, currentHeading, setCurrentHeading } = useProgress(
    book.slug,
    contentRef,
  );
  const bookmarks = useBookmarks(book.slug);

  /* ------- scroll-spy: track active heading ------- */
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const headings = Array.from(
      el.querySelectorAll<HTMLHeadingElement>("h1, h2, h3, h4"),
    );
    if (!headings.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop,
          );
        if (visible[0]) {
          const id = visible[0].target.id;
          setActiveId(id);
          setCurrentHeading(visible[0].target.textContent ?? "");
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [markdown, setCurrentHeading]);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTocOpen(false);
  }, []);

  /* ------- keyboard shortcuts ------- */
  useShortcuts({
    "/": (e) => {
      e.preventDefault();
      setSearchOpen(true);
    },
    t: () => {
      const order = ["light", "sepia", "dark"] as const;
      const cur = (document.documentElement.getAttribute("data-theme") ||
        "light") as (typeof order)[number];
      const next = order[(order.indexOf(cur) + 1) % order.length];
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("reader:theme", next);
      } catch {}
    },
    m: () => setTocOpen((o) => !o),
    b: () => bookmarks.toggleCurrent(activeId, currentHeading),
    B: () => setBookmarksOpen((o) => !o),
    "?": () => setHelpOpen((o) => !o),
    Escape: () => {
      setSearchOpen(false);
      setTocOpen(false);
      setBookmarksOpen(false);
      setHelpOpen(false);
    },
  });

  const tocTree = useMemo(() => toc, [toc]);
  const hasBookmarkHere = bookmarks.items.some((x) => x.id === activeId);

  return (
    <div className="relative min-h-screen">
      {/* Progress bar */}
      <div
        className="fixed left-0 right-0 top-0 z-50 h-[3px] origin-left transition-transform"
        style={{
          background: book.accent,
          transform: `scaleX(${progress})`,
        }}
        aria-hidden
      />

      <ReaderToolbar
        book={book}
        currentHeading={currentHeading}
        onOpenToc={() => setTocOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenBookmarks={() => setBookmarksOpen(true)}
        onToggleBookmark={() =>
          bookmarks.toggleCurrent(activeId, currentHeading)
        }
        hasBookmarkHere={hasBookmarkHere}
        onOpenHelp={() => setHelpOpen(true)}
      />

      <div className="mx-auto flex w-full max-w-7xl gap-8 px-5 pb-24 pt-24 sm:px-8">
        {/* Desktop TOC sidebar */}
        <aside className="sticky top-24 hidden h-[calc(100vh-6rem)] w-64 shrink-0 overflow-y-auto pr-2 lg:block">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
            <List size={14} /> Mục lục
          </div>
          <TableOfContents
            items={tocTree}
            activeId={activeId}
            onSelect={scrollToId}
          />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <div className="mb-8 border-b border-[color:var(--border)] pb-6">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--accent)]"
            >
              <ArrowLeft size={15} /> Thư viện
            </Link>
            <h1 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">
              {book.title}
            </h1>
            {book.subtitle ? (
              <p className="mt-2 text-lg text-[color:var(--muted)]">
                {book.subtitle}
              </p>
            ) : null}
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              {book.author}
            </p>
          </div>

          <div ref={contentRef} className="prose-reader">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug, rehypeRaw]}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </main>
      </div>

      {/* Mobile TOC drawer */}
      {tocOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setTocOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <aside
            className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-[color:var(--surface)] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <List size={18} /> Mục lục
              </div>
              <button
                type="button"
                onClick={() => setTocOpen(false)}
                aria-label="Đóng"
                className="rounded-full p-1.5 hover:bg-[color:var(--surface-2)]"
              >
                <X size={18} />
              </button>
            </div>
            <TableOfContents
              items={tocTree}
              activeId={activeId}
              onSelect={scrollToId}
            />
          </aside>
        </div>
      )}

      {searchOpen && (
        <SearchOverlay
          contentRef={contentRef}
          onClose={() => setSearchOpen(false)}
        />
      )}

      {bookmarksOpen && (
        <BookmarksPanel
          items={bookmarks.items}
          onClose={() => setBookmarksOpen(false)}
          onRemove={bookmarks.remove}
          onGoto={(id) => {
            scrollToId(id);
            setBookmarksOpen(false);
          }}
          accent={book.accent}
        />
      )}

      {helpOpen && <ShortcutsHelp onClose={() => setHelpOpen(false)} />}
    </div>
  );
}

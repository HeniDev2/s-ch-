import Link from "next/link";
import { books } from "@/lib/books";
import { readBookMarkdown, approxReadingTime } from "@/lib/markdown";
import { BookCard } from "@/components/BookCard";
import { LibraryHeader } from "@/components/LibraryHeader";
import { ContinueReading } from "@/components/ContinueReading";

export default async function Home() {
  const enriched = await Promise.all(
    books.map(async (b) => {
      const md = await readBookMarkdown(b.file);
      return {
        ...b,
        readingTime: approxReadingTime(md),
        chars: md.length,
      };
    }),
  );

  return (
    <div className="min-h-screen w-full">
      <LibraryHeader />

      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-6 sm:px-8">
        <section className="mb-10 sm:mb-14">
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            Thư viện của bạn
          </h1>
          <p className="mt-3 max-w-2xl text-[color:var(--muted)]">
            Những cuốn sách đang đọc — mỗi cuốn là một cuộc trò chuyện dài với
            một tâm trí khác. Chọn một cuốn và bắt đầu.
          </p>
        </section>

        <ContinueReading books={enriched} />

        <section>
          <div className="mb-5 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-semibold">Tất cả sách</h2>
            <span className="text-sm text-[color:var(--muted)]">
              {enriched.length} cuốn
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {enriched.map((book, i) => (
              <Link
                key={book.slug}
                href={`/book/${book.slug}`}
                className="group"
              >
                <BookCard book={book} priority={i < 2} />
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-20 border-t border-[color:var(--border)] pt-6 text-sm text-[color:var(--muted)]">
          Built with Next.js · Triển khai trên Vercel
        </footer>
      </main>
    </div>
  );
}

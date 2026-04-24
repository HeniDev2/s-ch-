import Image from "next/image";
import { Clock, Languages } from "lucide-react";
import type { Book } from "@/lib/books";

type Props = {
  book: Book & { readingTime: number };
  priority?: boolean;
};

export function BookCard({ book, priority = false }: Props) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[color:var(--surface-2)]">
        <Image
          src={book.cover}
          alt={book.title}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          priority={priority}
        />
        <span
          className="absolute left-3 top-3 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white"
          style={{ background: book.accent }}
        >
          {book.language === "vi" ? "Tiếng Việt" : "English"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-serif text-lg font-semibold leading-snug">
          {book.title}
        </h3>
        <p className="mt-1 text-sm text-[color:var(--muted)]">{book.author}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[color:var(--muted)]">
          {book.description}
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-[color:var(--muted)]">
          <span className="inline-flex items-center gap-1">
            <Clock size={13} />
            {book.readingTime < 60
              ? `${book.readingTime} phút`
              : `~${Math.round(book.readingTime / 60)} giờ`}
          </span>
          <span className="inline-flex items-center gap-1">
            <Languages size={13} />
            {book.language.toUpperCase()}
          </span>
        </div>
      </div>
    </article>
  );
}

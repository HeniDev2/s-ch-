import { notFound } from "next/navigation";
import { books, getBook } from "@/lib/books";
import { readBookMarkdown, extractToc } from "@/lib/markdown";
import { Reader } from "@/components/Reader";

export async function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return {};
  return {
    title: `${book.title} — Thư Viện`,
    description: book.description,
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const markdown = await readBookMarkdown(book.file);
  const toc = extractToc(markdown);

  return <Reader book={book} markdown={markdown} toc={toc} />;
}

import fs from "node:fs/promises";
import path from "node:path";
import GithubSlugger from "github-slugger";

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "books");

export async function readBookMarkdown(file: string): Promise<string> {
  const fullPath = path.join(CONTENT_DIR, file);
  return fs.readFile(fullPath, "utf-8");
}

export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const lines = markdown.split("\n");
  const items: TocItem[] = [];
  let inCodeFence = false;

  for (const rawLine of lines) {
    const line = rawLine;
    if (/^\s*```/.test(line)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = /^(#{1,4})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const level = match[1].length;
    const text = match[2]
      // strip HTML tags (epub conversions often embed <span> pagebreaks)
      .replace(/<[^>]*>/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) continue;
    const id = slugger.slug(text);
    items.push({ id, text, level });
  }
  return items;
}

export function approxReadingTime(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*_`~\-\[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

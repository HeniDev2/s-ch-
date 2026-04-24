export type Book = {
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  language: "vi" | "en";
  cover: string;
  accent: string;
  file: string;
  description: string;
  tags: string[];
};

export const books: Book[] = [
  {
    slug: "12-quy-tac-cuoc-song",
    title: "12 Quy Tắc Cho Cuộc Sống",
    subtitle: "Liều Thuốc Giải Cho Sự Hỗn Loạn",
    author: "Jordan B. Peterson",
    language: "vi",
    cover: "/covers/12-rules.svg",
    accent: "#c0392b",
    file: "12-quy-tac-cuoc-song.md",
    description:
      "Bản dịch đầy đủ tiếng Việt. 12 nguyên tắc sâu sắc để sống có trách nhiệm, ý nghĩa giữa một thế giới hỗn loạn.",
    tags: ["Triết học", "Phát triển bản thân", "Tâm lý học"],
  },
  {
    slug: "12-quy-tac-phan-tich",
    title: "12 Quy Tắc Cho Cuộc Sống — Phân Tích Chi Tiết",
    author: "Tóm tắt & phân tích",
    language: "vi",
    cover: "/covers/12-rules-summary.svg",
    accent: "#8e44ad",
    file: "12-quy-tac-phan-tich.md",
    description:
      "Bản phân tích súc tích, đi sâu vào ý tưởng cốt lõi của 12 quy tắc với ví dụ và suy ngẫm.",
    tags: ["Tóm tắt", "Phân tích"],
  },
  {
    slug: "four-thousand-weeks",
    title: "Four Thousand Weeks",
    subtitle: "Time Management for Mortals",
    author: "Oliver Burkeman",
    language: "en",
    cover: "/covers/ftw.svg",
    accent: "#d35400",
    file: "four-thousand-weeks.md",
    description:
      "A philosophical take on time management: we only get about 4000 weeks — here's how to actually live them.",
    tags: ["Philosophy", "Productivity", "Time"],
  },
  {
    slug: "bon-nghin-tuan-tom-tat",
    title: "Bốn Nghìn Tuần — Tóm Tắt Chi Tiết",
    author: "Tóm tắt tiếng Việt",
    language: "vi",
    cover: "/covers/ftw-summary.svg",
    accent: "#16a085",
    file: "bon-nghin-tuan-tom-tat.md",
    description:
      "Bản tóm tắt tiếng Việt của Four Thousand Weeks — tinh thần cốt lõi về quản lý thời gian cho người phàm.",
    tags: ["Tóm tắt", "Quản lý thời gian"],
  },
];

export function getBook(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

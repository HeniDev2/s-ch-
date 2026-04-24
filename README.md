# Thư Viện — Trang đọc sách cá nhân

Trang web đọc sách được build bằng **Next.js 16** (App Router) + **Tailwind CSS v4**, triển khai sẵn sàng trên **Vercel**.

## Tính năng

### Thư viện
- 📚 Trang chủ dạng grid, hiển thị bìa + mô tả + thời gian đọc ước tính
- ⏮️ **Đọc tiếp**: tự động hiện những cuốn đang đọc dở với thanh tiến độ
- 🌐 Hỗ trợ sách song ngữ (Vietnamese / English)

### Trình đọc
- 📖 Render markdown đẹp với font serif **Lora** (đọc lâu không mỏi mắt)
- 📑 **Mục lục tự động** ở sidebar, scroll-spy highlight chương đang đọc
- 🎨 Ba chủ đề: **Light / Sepia / Dark** (lưu localStorage)
- 🔤 Tùy chỉnh **cỡ chữ** (7 mức) và **độ rộng cột** (5 mức)
- 📊 **Thanh tiến độ** ở đầu trang + lưu vị trí cuộn, tự nhảy về chỗ đọc dở
- 🔖 **Bookmark** mục bất kỳ, xem danh sách ở panel bên phải
- 🔍 **Tìm kiếm** trong sách — tô sáng kết quả, next/prev với Enter / Shift+Enter
- ⌨️ **Phím tắt** đầy đủ (xem dưới)

### Phím tắt
| Phím | Hành động |
|---|---|
| `/` hoặc `⌘F` | Mở thanh tìm kiếm |
| `Enter` / `Shift+Enter` | Kết quả sau / trước (khi đang tìm) |
| `m` | Bật/tắt mục lục (mobile) |
| `t` | Đổi chủ đề (Sáng → Sepia → Tối) |
| `b` | Đánh dấu / bỏ đánh dấu mục hiện tại |
| `Shift+B` | Mở danh sách bookmark |
| `?` | Hiện bảng phím tắt |
| `Esc` | Đóng các bảng đang mở |

## Thêm sách mới

1. Copy file `.md` vào `content/books/`
2. Thêm metadata vào `lib/books.ts`:
   ```ts
   {
     slug: "ten-sach",
     title: "Tên Sách",
     author: "Tác giả",
     language: "vi",
     cover: "/covers/ten-sach.svg",
     accent: "#c0392b",
     file: "ten-sach.md",
     description: "Mô tả ngắn",
     tags: ["..."],
   }
   ```
3. Tạo SVG bìa ở `public/covers/ten-sach.svg` (hoặc dùng ảnh `.jpg/.png`)
4. Done — trang tự động thêm sách mới vào thư viện

## Phát triển

```bash
npm install
npm run dev         # localhost:3000
npm run build       # production build
npm start           # chạy bản production đã build
```

## Triển khai Vercel

**Cách 1 — Vercel Dashboard:**
1. Push repo lên GitHub
2. Vào [vercel.com/new](https://vercel.com/new), chọn repo
3. **Root Directory** = `web`
4. Deploy

**Cách 2 — Vercel CLI:**
```bash
npm i -g vercel
cd web
vercel          # lần đầu: chọn project
vercel --prod   # deploy production
```

## Kiến trúc

```
web/
├── app/
│   ├── layout.tsx         # Root layout + theme script
│   ├── page.tsx           # Thư viện (home)
│   ├── book/[slug]/       # Trang đọc sách (SSG)
│   └── globals.css        # Tailwind + theme CSS vars + reader styles
├── components/
│   ├── BookCard.tsx
│   ├── LibraryHeader.tsx
│   ├── ContinueReading.tsx
│   ├── Reader.tsx          # Main reader (client)
│   ├── ReaderToolbar.tsx
│   ├── TableOfContents.tsx
│   ├── TypographyControls.tsx
│   ├── ThemeToggle.tsx
│   ├── SearchOverlay.tsx
│   ├── BookmarksPanel.tsx
│   └── ShortcutsHelp.tsx
├── hooks/
│   ├── useProgress.ts
│   ├── useBookmarks.ts
│   └── useShortcuts.ts
├── lib/
│   ├── books.ts            # Book metadata
│   └── markdown.ts         # File reading + TOC extraction
├── content/books/          # *.md — nội dung sách
└── public/covers/          # Bìa sách
```

Toàn bộ nội dung và state người đọc (progress, bookmarks, theme, font) đều lưu ở **localStorage** — không cần server, không cần database.

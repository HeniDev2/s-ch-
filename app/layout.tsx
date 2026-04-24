import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thư Viện — Đọc sách online",
  description:
    "Thư viện sách cá nhân: đọc sách với trình đọc đẹp, mục lục, bookmark, tìm kiếm, tiến độ đọc.",
};

const setThemeScript = `
(function(){
  try {
    var t = localStorage.getItem('reader:theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
    var fs = localStorage.getItem('reader:font-size');
    if (fs) document.documentElement.style.setProperty('--reader-font-size', fs);
    var rw = localStorage.getItem('reader:width');
    if (rw) document.documentElement.style.setProperty('--reader-width', rw);
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${inter.variable} ${lora.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: setThemeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

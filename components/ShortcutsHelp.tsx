"use client";

import { X } from "lucide-react";

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["/"], label: "Mở thanh tìm kiếm" },
  { keys: ["⌘", "F"], label: "Mở thanh tìm kiếm" },
  { keys: ["Enter"], label: "Kết quả tiếp theo (trong ô tìm)" },
  { keys: ["Shift", "Enter"], label: "Kết quả trước (trong ô tìm)" },
  { keys: ["m"], label: "Mở / đóng mục lục" },
  { keys: ["t"], label: "Đổi chủ đề (Sáng / Sepia / Tối)" },
  { keys: ["b"], label: "Đánh dấu / bỏ đánh dấu mục hiện tại" },
  { keys: ["Shift", "B"], label: "Mở danh sách bookmark" },
  { keys: ["?"], label: "Hiện / ẩn trợ giúp" },
  { keys: ["Esc"], label: "Đóng mọi bảng đang mở" },
];

export function ShortcutsHelp({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-md rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold">Phím tắt</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-full p-1.5 hover:bg-[color:var(--surface-2)]"
          >
            <X size={18} />
          </button>
        </div>
        <dl className="space-y-2 text-sm">
          {SHORTCUTS.map((s) => (
            <div
              key={s.label + s.keys.join("+")}
              className="flex items-center justify-between gap-4"
            >
              <dd className="text-[color:var(--muted)]">{s.label}</dd>
              <dt className="flex items-center gap-1">
                {s.keys.map((k, i) => (
                  <span key={`${k}-${i}`}>
                    {i > 0 ? (
                      <span className="mx-0.5 text-[color:var(--muted)]">
                        +
                      </span>
                    ) : null}
                    <kbd className="inline-block rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] px-2 py-0.5 font-mono text-xs">
                      {k}
                    </kbd>
                  </span>
                ))}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

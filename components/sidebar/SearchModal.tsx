"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  sub: string;
  personaName: string;
}

export default function SearchModal({
  isOpen,
  onClose,
  items,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: SearchItem[];
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const filtered = items.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.sub.toLowerCase().includes(q) ||
      item.personaName.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) {
        onSelect(filtered[activeIndex].id);
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 pt-[15vh] px-4">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 dark:border-[#333336] bg-white dark:bg-[#1b1b1d] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-200 dark:border-[#333336]">
          <Search size={17} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cari percakapan..."
            className="flex-1 bg-transparent outline-none text-sm text-[#1a1a1a] dark:text-[#f2f2f0] placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black dark:hover:text-white shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[360px] overflow-y-auto py-1.5">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-8">
              Tidak ada percakapan ditemukan
            </p>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                  onClose();
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full flex flex-col items-start gap-0.5 px-4 py-2.5 text-left transition-colors ${
                  i === activeIndex
                    ? "bg-gray-100 dark:bg-[#2c2c2f]"
                    : "hover:bg-gray-50 dark:hover:bg-[#232326]"
                }`}
              >
                <span className="text-xs font-medium text-[#1a1a1a] dark:text-[#f2f2f0] truncate w-full">
                  {item.personaName}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-[#9a9a97] truncate w-full">
                  {item.title}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="flex items-center gap-3 px-4 py-2 border-t border-gray-200 dark:border-[#333336] text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#2c2c2f] font-mono">
              ↑↓
            </kbd>
            navigasi
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#2c2c2f] font-mono">
              ↵
            </kbd>
            buka
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#2c2c2f] font-mono">
              esc
            </kbd>
            tutup
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

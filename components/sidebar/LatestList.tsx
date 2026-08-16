"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MoreVertical,
  Pencil,
  Mail,
  MailOpen,
  Trash2
} from "lucide-react";

interface Item {
  id: string;
  title: string;
  sub: string;
  isUnread?: boolean;
}

interface Props {
  items: Item[];
  currentId: string;
  onSelect: (id: string) => void;
  compact?: boolean;
  onRename?: (id: string, newTitle: string) => void;
  onToggleUnread?: (id: string, isUnread: boolean) => void;
  onDelete?: (id: string) => void | Promise<void>;
}

export default function LatestList({
  items,
  currentId,
  onSelect,
  compact = false,
  onRename,
  onToggleUnread,
  onDelete,
}: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameRef = useRef<HTMLDivElement>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutsideRename(e: MouseEvent) {
      if (renameRef.current && !renameRef.current.contains(e.target as Node)) {
        setRenamingId(null);
      }
    }
    if (renamingId) {
      document.addEventListener("mousedown", handleClickOutsideRename);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideRename);
  }, [renamingId]);

  useEffect(() => {
    if (renamingId) {
      const raf = requestAnimationFrame(() => {
        const input = renameRef.current?.querySelector("input");
        input?.focus();
        input?.select();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [renamingId]);

  const hasActions = onRename || onToggleUnread || onDelete;

  const toggleMenu = (id: string) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
      return;
    }
    const btn = buttonRefs.current[id];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 208, // 208px = menu width (w-52)
      });
    }
    setOpenMenuId(id);
  };

  const startRename = (item: Item) => {
    setRenamingId(item.id);
    setRenameValue(item.sub);
    setOpenMenuId(null);
  };

  const confirmRename = (id: string) => {
    if (renameValue.trim() && onRename) {
      onRename(id, renameValue.trim());
    }
    setRenamingId(null);
  };

  const confirmDelete = async () => {
    if (!onDelete || !deleteConfirmId) return;
    try {
      setIsDeleting(true);
      await onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const openItem = items.find((i) => i.id === openMenuId);
  const deleteItem = items.find((i) => i.id === deleteConfirmId);

  return (
    <div className="flex-1 overflow-y-auto pr-0.5 scrollbar-hide">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => renamingId !== item.id && onSelect(item.id)}
          className={`group relative px-1.5 rounded-lg border-l-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2c2c2f] ${
            compact ? "py-0.5 mb-0" : "py-1.5 mb-0.5"
          } ${currentId === item.id ? "bg-gray-100 dark:bg-[#2c2c2f]" : ""} ${
            item.isUnread
              ? "bg-blue-50 dark:bg-blue-500/10 border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="flex items-start gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${
                item.isUnread ? "bg-blue-500" : "bg-transparent"
              }`}
            />

            {renamingId === item.id ? (
              <div ref={renameRef} className="min-w-0 flex-1">
                <p
                  className={`text-xs truncate ${
                    item.isUnread
                      ? "text-[#1a1a1a] dark:text-white"
                      : "text-[#1a1a1a] dark:text-[#f1f0ee]"
                  }`}
                >
                  {item.title}
                </p>
                {!compact && (
                  <input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmRename(item.id);
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ lineHeight: "inherit", fontFamily: "inherit" }}
                    className="w-full min-w-0 text-[11px] text-gray-500 dark:text-[#9a9a97] truncate mt-0.5 bg-transparent border-0 outline-none focus:text-[#1a1a1a] dark:focus:text-[#f1f0ee] p-0 m-0 block"
                  />
                )}
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs truncate ${
                    item.isUnread
                      ? "text-[#1a1a1a] dark:text-white"
                      : "text-[#1a1a1a] dark:text-[#f1f0ee]"
                  }`}
                >
                  {item.title}
                </p>
                {!compact && (
                  <p className="text-[11px] text-gray-500 dark:text-[#9a9a97] truncate mt-0.5">
                    {item.sub}
                  </p>
                )}
              </div>
            )}
          </div>

          {hasActions && renamingId !== item.id && (
            <button
              ref={(el) => {
                buttonRefs.current[item.id] = el;
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu(item.id);
              }}
              className={`absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3a3a3d] hover:text-black dark:hover:text-white transition-opacity ${
                openMenuId === item.id
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <MoreVertical size={14} />
            </button>
          )}
        </div>
      ))}

      {mounted &&
        openMenuId &&
        menuPosition &&
        openItem &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            className="w-52 rounded-lg border border-gray-200 dark:border-[#333336] bg-white dark:bg-[#232326] shadow-lg py-1 z-[9999]"
            onClick={(e) => e.stopPropagation()}
          >
            {onRename && (
              <button
                onClick={() => startRename(openItem)}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-left text-[#1a1a1a] dark:text-[#f2f2f0] hover:bg-gray-100 dark:hover:bg-[#2c2c2f]"
              >
                <Pencil size={13} strokeWidth={1.75} />
                Rename
              </button>
            )}
            {onToggleUnread && (
              <button
                onClick={() => {
                  onToggleUnread(openItem.id, !openItem.isUnread);
                  setOpenMenuId(null);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-left text-[#1a1a1a] dark:text-[#f2f2f0] hover:bg-gray-100 dark:hover:bg-[#2c2c2f]"
              >
                {openItem.isUnread ? (
                  <>
                    <Mail size={13} strokeWidth={1.75} />
                    Mark as read
                  </>
                ) : (
                  <>
                    <MailOpen size={13} strokeWidth={1.75} />
                    Mark as unread
                  </>
                )}
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  setOpenMenuId(null);
                  setDeleteConfirmId(openItem.id);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <Trash2 size={13} strokeWidth={1.75} />
                Delete conversation
              </button>
            )}
          </div>,
          document.body,
        )}

      {mounted &&
        deleteConfirmId &&
        deleteItem &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70"
            onClick={() => !isDeleting && setDeleteConfirmId(null)}
          >
            <div
              className="w-full max-w-sm rounded-lg border border-gray-200 dark:border-[#333336] bg-white dark:bg-[#232326] p-5 text-[#1a1a1a] dark:text-[#f2f2f0]"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm font-medium">
                Delete &quot;{deleteItem.title}&quot;?
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-[#9a9a9e]">
                This chat and all its messages will be permanently removed.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={isDeleting}
                  className="rounded-md px-3 py-1.5 text-sm text-gray-500 dark:text-[#9a9a9e] hover:bg-gray-100 dark:hover:bg-[#2c2c2f] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="rounded-md bg-red-500/90 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  PanelLeft,
  MoreVertical,
  Pencil,
  Mail,
  MailOpen,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { Persona } from "../persona/personas";
import { dmSans } from "@/lib/font";

export default function ChatHeader({
  persona,
  title,
  className = "",
  onMenuClick,
  onRename,
  onToggleUnread,
  isUnread,
  onDelete,
}: {
  persona: Persona;
  title: string;
  className?: string;
  onMenuClick?: () => void;
  onRename?: (newTitle: string) => void;
  onToggleUnread?: (isUnread: boolean) => void;
  isUnread?: boolean;
  onDelete?: () => void | Promise<void>;
}) {
  const Icon = persona.icon;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(title);
  const renameBlockRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutsideRename(e: MouseEvent) {
      if (
        renameBlockRef.current &&
        !renameBlockRef.current.contains(e.target as Node)
      ) {
        setIsRenaming(false); // cancel
      }
    }
    if (isRenaming) {
      document.addEventListener("mousedown", handleClickOutsideRename);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideRename);
  }, [isRenaming]);

  useEffect(() => {
    if (isRenaming) {
      const raf = requestAnimationFrame(() => {
        renameInputRef.current?.focus();
        renameInputRef.current?.select();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isRenaming]);

  const hasActions = onRename || onToggleUnread || onDelete;

  const startRename = () => {
    setRenameValue(title);
    setIsRenaming(true);
    setIsMenuOpen(false);
  };

  const confirmRename = () => {
    if (renameValue.trim() && onRename) {
      onRename(renameValue.trim());
    }
    setIsRenaming(false);
  };

  const confirmDelete = async () => {
    if (!onDelete) return;
    try {
      setIsDeleting(true);
      await onDelete();
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`absolute top-0 left-0 right-0 z-10 ${className}`}>
      <div className="flex items-center gap-3 md:gap-3.5 px-4 md:px-8 py-3 bg-white dark:bg-[#202023] backdrop-blur-md">
        <button
          onClick={onMenuClick}
          className="md:hidden shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-[#1a1a1a] dark:text-[#e8e8e6]"
        >
          <PanelLeft size={20} strokeWidth={1.75} />
        </button>

        <div className="w-[35px] h-[35px] rounded-full border-[1.5px] bg-gray-200 dark:bg-[#2c2c2f] border-gray-300 dark:border-[#5a5a56] flex items-center justify-center shrink-0">
          <Icon
            size={18}
            strokeWidth={1.75}
            className="text-[#1a1a1a] dark:text-[#e8e8e6]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-semibold text-[#1a1a1a] dark:text-[#e8e8e6] truncate ${dmSans.className}`}
          >
            {persona.name}
          </p>

          {isRenaming ? (
            <div ref={renameBlockRef}>
              <input
                ref={renameInputRef}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmRename();
                  if (e.key === "Escape") setIsRenaming(false);
                }}
                className={`w-full min-w-0 text-xs text-gray-500 dark:text-[#6f6f6b] truncate mt-0.5 bg-transparent border-0 outline-none focus:text-[#1a1a1a] dark:focus:text-[#f2f2f0] p-0 ${dmSans.className}`}
              />
            </div>
          ) : (
            <input
              disabled
              value={title}
              className={`w-full min-w-0 text-xs text-gray-500 dark:text-[#6f6f6b] truncate mt-0.5 bg-transparent border-0 outline-none p-0 cursor-default ${dmSans.className}`}
            />
          )}
        </div>

        {hasActions && !isRenaming && (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-[#9a9a97] hover:bg-gray-100 dark:hover:bg-[#2c2c2f] hover:text-black dark:hover:text-white transition-colors"
            >
              <MoreVertical size={18} strokeWidth={1.75} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-gray-200 dark:border-[#333336] bg-white dark:bg-[#232326] shadow-lg py-1 z-20">
                {onRename && (
                  <button
                    onClick={startRename}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-left text-[#1a1a1a] dark:text-[#f2f2f0] hover:bg-gray-100 dark:hover:bg-[#2c2c2f] ${dmSans.className}`}
                  >
                    <Pencil size={15} strokeWidth={1.75} />
                    Rename
                  </button>
                )}
                {onToggleUnread && (
                  <button
                    onClick={() => {
                      onToggleUnread(!isUnread);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-left text-[#1a1a1a] dark:text-[#f2f2f0] hover:bg-gray-100 dark:hover:bg-[#2c2c2f] ${dmSans.className}`}
                  >
                    {isUnread ? (
                      <Mail size={15} strokeWidth={1.75} />
                    ) : (
                      <MailOpen size={15} strokeWidth={1.75} />
                    )}
                    {isUnread ? "Mark as read" : "Mark as unread"}
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowDeleteConfirm(true);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 ${dmSans.className}`}
                  >
                    <Trash2 size={15} strokeWidth={1.75} />
                    Delete conversation
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="h-5 bg-gradient-to-b from-white dark:from-[#202023] to-white/0 dark:to-[#202023]/0" />

      {mounted &&
        showDeleteConfirm &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70"
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          >
            <div
              className="w-full max-w-sm rounded-lg border border-gray-200 dark:border-[#333336] bg-white dark:bg-[#232326] p-5 text-[#1a1a1a] dark:text-[#f2f2f0]"
              onClick={(e) => e.stopPropagation()}
            >
              <p className={`text-sm font-medium ${dmSans.className}`}>
                Delete this conversation?
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-[#9a9a9e]">
                This chat and all its messages will be permanently removed.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
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

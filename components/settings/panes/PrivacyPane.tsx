"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";
import SettingsRow from "../SettingsRow";
import { authFetch, clearToken } from "@/lib/auth";

export default function PrivacyPane() {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const [confirmAction, setConfirmAction] = useState<
    "logout" | "clearHistory" | "deleteAccount" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogout = async () => {
    setIsProcessing(true);
    try {
      await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      clearToken();
      disconnect();
      router.push("/login");
    }
  };

  const handleClearHistory = async () => {
    setIsProcessing(true);
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/clear`,
        { method: "DELETE" },
      );
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to clear history:", err);
    } finally {
      setIsProcessing(false);
      setConfirmAction(null);
    }
  };

  const handleDeleteAccount = async () => {
    setIsProcessing(true);
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        { method: "DELETE" },
      );
      if (res.ok) {
        clearToken();
        disconnect();
        router.push("/login");
      }
    } catch (err) {
      console.error("Failed to delete account:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <SettingsRow label="Log out" desc="Sign out from this device.">
        <button
          onClick={() => setConfirmAction("logout")}
          className="rounded-md border border-gray-300 dark:border-[#3a3a3d] px-4 py-1.5 text-sm font-medium text-[#1a1a1a] dark:text-[#f2f2f0] hover:bg-gray-100 dark:hover:bg-[#2c2c2f]"
        >
          Log out
        </button>
      </SettingsRow>

      <SettingsRow
        label="Clear chat history"
        desc="Delete all your conversations. This cannot be undone."
      >
        <button
          onClick={() => setConfirmAction("clearHistory")}
          className="w-[140px] truncate rounded-md bg-red-500/90 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-500"
        >
          Clear history
        </button>
      </SettingsRow>

      <SettingsRow
        label="Delete account"
        desc="Permanently delete your account and all data."
      >
        <button
          onClick={() => setConfirmAction("deleteAccount")}
          className="w-[140px] truncate rounded-md bg-red-500/90 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-500"
        >
          Delete account
        </button>
      </SettingsRow>

      {confirmAction && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70"
          onClick={() => !isProcessing && setConfirmAction(null)}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-gray-200 dark:border-[#333336] bg-white dark:bg-[#232326] p-5 text-[#1a1a1a] dark:text-[#f2f2f0]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-medium">
              {confirmAction === "logout" && "Log out from this device?"}
              {confirmAction === "clearHistory" && "Delete all chat history?"}
              {confirmAction === "deleteAccount" &&
                "Permanently delete your account?"}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-[#9a9a9e]">
              {confirmAction === "logout" &&
                "You will need to log in again to continue."}
              {confirmAction === "clearHistory" &&
                "All your conversations will be permanently removed."}
              {confirmAction === "deleteAccount" &&
                "This action is irreversible. All your data will be permanently deleted."}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmAction(null)}
                disabled={isProcessing}
                className="rounded-md px-3 py-1.5 text-sm text-gray-500 dark:text-[#9a9a9e] hover:bg-gray-100 dark:hover:bg-[#2c2c2f] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction === "logout") handleLogout();
                  if (confirmAction === "clearHistory") handleClearHistory();
                  if (confirmAction === "deleteAccount") handleDeleteAccount();
                }}
                disabled={isProcessing}
                className="rounded-md bg-red-500/90 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

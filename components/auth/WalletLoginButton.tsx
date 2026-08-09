"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

export function WalletLoginButton() {
  const { address, isConnected, status } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAndLogin() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          { credentials: "include" },
        );
        if (res.ok) {
          window.location.href = "/chat";
          return;
        }
      } catch {
      } finally {
        setCheckingSession(false);
      }

      if (status === "connected" && address && !hasAttempted) {
        setHasAttempted(true);
        handleLogin();
      }
    }

    checkAndLogin();
    if (!isConnected) setHasAttempted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, status]);

  async function handleLogin() {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const nonceRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/wallet/nonce?address=${address}`,
      );
      if (!nonceRes.ok) throw new Error("Gagal ambil nonce");
      const { message } = await nonceRes.json();

      const signature = await signMessageAsync({ message });

      const verifyRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/wallet/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ address, signature }),
        },
      );
      if (!verifyRes.ok) throw new Error("Verifikasi wallet gagal");

      const data = await verifyRes.json();
      window.location.href = data.isNewUser ? "/onboarding/goal" : "/chat";
    } catch (err) {
      console.error("Wallet login gagal:", err);
      const msg =
        err instanceof Error && err.message.includes("User rejected")
          ? "Kamu membatalkan tanda tangan."
          : "Login gagal, coba lagi.";
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <ConnectButton.Custom>
        {({ openConnectModal, connectModalOpen }) => (
          <button
            type="button"
            onClick={() => {
              setError(null);
              openConnectModal();
            }}
            disabled={loading || checkingSession || connectModalOpen}
            className="w-full flex items-center justify-center gap-2 py-2 border border-neutral-200 rounded-xl text-[13.5px] hover:bg-neutral-50 hover:border-neutral-300 transition-colors duration-200 text-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wallet size={16} />
            {loading ? "Verifying..." : "Connect Wallet"}
          </button>
        )}
      </ConnectButton.Custom>
      {error && (
        <p className="text-[12px] text-red-500 mt-2 text-center">{error}</p>
      )}
    </div>
  );
}

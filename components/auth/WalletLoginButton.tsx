"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

export function WalletLoginButton() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    if (isConnected && address && !hasAttempted) {
      setHasAttempted(true);
      handleLogin();
    }
    if (!isConnected) setHasAttempted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  async function handleLogin() {
    if (!address) return;
    setLoading(true);
    try {
      const nonceRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/wallet/nonce?address=${address}`,
      );
      const { message } = await nonceRes.json();
      const signature = await signMessageAsync({ message });

      const verifyRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/wallet/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ address, signature }),
        },
      );
      if (!verifyRes.ok) throw new Error("Verifikasi wallet gagal");

      const data = await verifyRes.json();
      localStorage.setItem("token", data.token);
      window.location.href = "/chat";
    } catch (err) {
      console.error("Wallet login gagal:", err);
      setHasAttempted(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ConnectButton.Custom>
      {({ openConnectModal, connectModalOpen }) => (
        <button
          type="button"
          onClick={openConnectModal}
          disabled={loading || connectModalOpen}
          className="w-full flex items-center justify-center gap-2 py-2 border border-neutral-200 rounded-xl text-[13.5px] hover:bg-neutral-50 hover:border-neutral-300 transition-colors duration-200 text-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet size={16} />
          {loading ? "Verifying..." : "Connect Wallet"}
        </button>
      )}
    </ConnectButton.Custom>
  );
}

"use client";
import { useEffect, useRef } from "react";
import { LucideIcon } from "lucide-react";
import { dmSans } from "@/lib/font";
import { useBalance, useSendTransaction, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { updateMessageStatus } from "@/lib/conversations";
import { useState } from "react";
import { parseEther } from "viem";

export interface Message {
  id?: string;
  from: "bot" | "user";
  text: string;
  type?: "text" | "wallet_balance" | "wallet_tx";
}

export default function ChatBody({
  messages,
  PersonaIcon,
  isLoading,
  currentConvoId,
}: {
  messages: Message[];
  PersonaIcon: LucideIcon;
  isLoading?: boolean;
  currentConvoId?: string;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const botBubbleClass =
    "translate-y-4 px-4 md:px-6 py-3 md:py-4 rounded-r-[35px] font-extralight rounded-bl-[25px] text-[14px] md:text-[15px] leading-relaxed max-w-[85%] sm:max-w-[56ch] bg-gray-100 dark:bg-[#e7e5e0] text-[#2a2a28] whitespace-pre-wrap break-words";
  const userBubbleClass =
    "translate-y-4 px-4 md:px-6 py-3 md:py-4 rounded-l-[35px] font-extralight rounded-br-[25px] text-[14px] md:text-[15px] leading-relaxed max-w-[85%] sm:max-w-[56ch] bg-[#2b2b2b] dark:bg-[#4d4d4a] text-white dark:text-[#f4f3f0] whitespace-pre-wrap break-words";

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 pt-20 md:pt-24 pb-6 md:pb-9 flex flex-col bg-white dark:bg-[#202023] chat-scrollbar">
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-4 md:gap-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 md:gap-3 ${m.from === "user" ? "justify-end" : ""}`}
          >
            <div
              className={`${dmSans.className} ${m.from === "user" ? userBubbleClass : botBubbleClass}`}
            >
              {m.type === "wallet_balance" ? (
                <WalletBalanceContent payload={m.text} />
              ) : m.type === "wallet_tx" ? (
                <WalletTransferContent
                  payload={m.text}
                  messageId={m.id}
                  conversationId={currentConvoId}
                />
              ) : (
                m.text
              )}
            </div>
            {m.from === "user" && (
              <div
                className={`w-[30px] h-[30px] md:w-[35px] md:h-[35px] rounded-full bg-gray-400 dark:bg-[#4d4d4a] text-white font-semibold flex items-center justify-center shrink-0 text-xs md:text-sm ${dmSans.className}`}
              >
                <span>U</span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-end gap-3">
            <div className="translate-y-4 px-6 py-4 flex items-center justify-center">
              <div className="loader" />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}

function WalletBalanceContent({ payload }: { payload: string }) {
  let address: `0x${string}` | undefined;
  try {
    address = JSON.parse(payload).address;
  } catch {
    return <span>Gagal membaca data wallet.</span>;
  }

  const { data, isLoading } = useBalance({ address });

  if (isLoading) return <span>Mengecek saldo...</span>;
  if (!data) return <span>Saldo tidak ditemukan.</span>;

  return (
    <span className="font-mono">
      {parseFloat(data.formatted).toFixed(4)} {data.symbol}
    </span>
  );
}

function WalletTransferContent({
  payload,
  messageId,
  conversationId,
}: {
  payload: string;
  messageId?: string;
  conversationId?: string;
}) {
  let parsed: {
    to: string;
    amount: string;
    symbol: string;
    status?: string;
    txHash?: string;
  } | null = null;
  try {
    parsed = JSON.parse(payload);
  } catch {
    parsed = null;
  }

const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">(
  parsed?.status === "success" ? "success" : "idle",
);
  const [errorMsg, setErrorMsg] = useState("");
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();

  if (!parsed) return <span>Gagal membaca data transaksi.</span>;

  async function handleSend() {
    setStatus("pending");
    setErrorMsg("");
    try {
      await switchChainAsync({ chainId: sepolia.id });
      const hash = await sendTransactionAsync({
        to: parsed!.to as `0x${string}`,
        value: parseEther(parsed!.amount),
        chainId: sepolia.id,
      });
      setStatus("success");

      if (messageId && conversationId) {
        await updateMessageStatus(conversationId, messageId, {
          status: "success",
          txHash: hash,
        });
      }
    } catch (err) {
      setStatus("error");
      console.error("Transfer error:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(
        message.includes("User rejected")
          ? "Transaksi dibatalkan."
          : `Gagal: ${message.slice(0, 150)}`,
      );
    }
  }

  return (
    <div className="flex flex-col gap-3 min-w-[240px]">
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/10 p-3">
        <p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-1">
          Kirim Transaksi
        </p>
        <p className="font-mono text-sm font-medium">
          {parsed.amount} {parsed.symbol}
        </p>
        <p className="text-xs text-neutral-500 mt-1">
          ke {parsed.to.slice(0, 6)}...{parsed.to.slice(-4)}
        </p>
      </div>

      {status === "idle" && (
        <button
          onClick={handleSend}
          className="rounded-lg bg-black text-white text-sm font-medium px-4 py-2 hover:opacity-85 transition-opacity"
        >
          Konfirmasi Kirim
        </button>
      )}

      {status === "pending" && (
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <div className="w-3 h-3 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
          Menunggu konfirmasi wallet...
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
          <span>✓</span> Transaksi berhasil dikirim!
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-red-500">{errorMsg}</span>
          <button
            onClick={handleSend}
            className="rounded-lg border border-neutral-300 text-sm font-medium px-4 py-2 hover:bg-neutral-100 transition-colors w-fit"
          >
            Coba Lagi
          </button>
        </div>
      )}
    </div>
  );
}

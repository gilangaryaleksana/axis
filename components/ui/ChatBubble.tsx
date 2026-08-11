"use client";
import { useAccount, useBalance } from "wagmi";
import { dmSans } from "../../lib/font";

type ChatBubbleProps = {
  message: string;
  type?: "text" | "wallet_balance" | "wallet_tx";
  isUser: boolean;
};

export default function ChatBubble({
  message,
  type = "text",
  isUser,
}: ChatBubbleProps) {
  return (
    <div
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`h-9 w-9 shrink-0 rounded-full ${
          isUser ? "bg-neutral-600" : "bg-neutral-300"
        }`}
      />

      <div
        className={`max-w-[75%] translate-y-6 rounded-[50px] px-4 py-2.5 text-sm font-extralight leading-relaxed ${
          isUser
            ? "bg-neutral-700 text-white rounded-tr-none"
            : "bg-neutral-300 text-neutral-900 rounded-tl-none"
        } ${dmSans.className}`}
      >
        {type === "wallet_balance" ? (
          <WalletBalanceContent payload={message} />
        ) : (
          message
        )}
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

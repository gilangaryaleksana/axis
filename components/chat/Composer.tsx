"use client";
import { useRef, useState } from "react";
import { ArrowRight, Wallet, Send, X } from "lucide-react";
import { useAccount } from "wagmi";

const SUGGESTIONS = [
  {
    label: "Check Balance",
    icon: Wallet,
    action: "quick" as const,
    text: "check my balance",
  },
  { label: "Send ETH", icon: Send, action: "form" as const },
];

export default function Composer({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const { isConnected } = useAccount();
  const [value, setValue] = useState("");
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth >= 768) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (s: (typeof SUGGESTIONS)[number]) => {
    if (s.action === "quick") {
      onSend(s.text!);
    } else {
      setShowTransferForm(true);
    }
  };

  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(toAddress);
  const isValidAmount = amount.trim().length > 0 && !isNaN(Number(amount));

  const handleSubmitTransferForm = () => {
    if (!isValidAddress || !isValidAmount) return;
    onSend(`send ${amount} eth to ${toAddress}`);
    setToAddress("");
    setAmount("");
    setShowTransferForm(false);
  };

  const hasValue = value.trim().length > 0;

  return (
    <div className="px-4 md:px-10 pt-3 md:pt-4 pb-2 bg-white dark:bg-[#202023]">
      <div className="max-w-3xl mx-auto">
        {/* Suggestion chips - only appear when wallet is connected */}
        {isConnected && !showTransferForm && (
          <div className="flex gap-2 mb-2.5 flex-wrap">
            {SUGGESTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.label}
                  onClick={() => handleSuggestionClick(s)}
                  className="flex items-center gap-1.5 rounded-full border border-gray-300 dark:border-[#3a3a3d] px-3 py-1.5 text-xs text-gray-600 dark:text-[#c9c8c4] hover:bg-gray-100 dark:hover:bg-[#2c2c2f] transition-colors"
                >
                  <Icon size={13} />
                  {s.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Inline transfer mini-form */}
        {isConnected && showTransferForm && (
          <div className="mb-2.5 rounded-2xl border border-gray-200 dark:border-[#3a3a3d] bg-gray-50 dark:bg-[#26262a] p-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-medium text-gray-500 dark:text-[#9a9a97]">
                Send ETH
              </p>
              <button
                onClick={() => setShowTransferForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <label className="block text-[11px] text-gray-500 dark:text-[#9a9a97] mb-1">
              Recipient address
            </label>
            <input
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x..."
              className={`w-full mb-2.5 rounded-lg border px-3 py-2 text-[13px] font-mono bg-white dark:bg-[#1b1b1d] text-[#1a1a1a] dark:text-[#f4f3f0] outline-none transition-colors ${
                toAddress && !isValidAddress
                  ? "border-red-400"
                  : "border-gray-300 dark:border-[#3a3a3d] focus:border-black dark:focus:border-white"
              }`}
            />

            <label className="block text-[11px] text-gray-500 dark:text-[#9a9a97] mb-1">
              Amount (ETH)
            </label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              inputMode="decimal"
              className="w-full mb-3 rounded-lg border border-gray-300 dark:border-[#3a3a3d] px-3 py-2 text-[13px] font-mono bg-white dark:bg-[#1b1b1d] text-[#1a1a1a] dark:text-[#f4f3f0] outline-none focus:border-black dark:focus:border-white transition-colors"
            />

            <button
              onClick={handleSubmitTransferForm}
              disabled={!isValidAddress || !isValidAmount}
              className={`w-full rounded-lg text-sm font-medium py-2 transition-colors ${
                isValidAddress && isValidAmount
                  ? "bg-black text-white hover:opacity-85"
                  : "bg-gray-200 dark:bg-[#3d3d3a] text-gray-400 dark:text-[#6f6f6b] cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {/* Text composer */}
        <div className="flex items-end gap-2 md:gap-2.5 bg-gray-100 dark:bg-[#2c2c2f] rounded-2xl pl-4 md:pl-5 pr-2 py-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Write a Message..."
            rows={1}
            className="flex-1 bg-transparent outline-none resize-none text-[#1a1a1a] dark:text-[#f4f3f0] placeholder:text-gray-400 dark:placeholder:text-[#c9c8c4] text-[14px] md:text-[15px] py-2 max-h-[200px] overflow-y-auto chat-scrollbar"
          />
          <button
            onClick={handleSend}
            disabled={!hasValue}
            className={`w-[38px] h-[38px] md:w-[42px] md:h-[42px] rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              hasValue
                ? "bg-[#2b2b2b] dark:bg-[#f4f3f0] text-white dark:text-[#2b2b2b] hover:bg-black dark:hover:bg-[#e0dfda]"
                : "bg-gray-300 dark:bg-[#3d3d3a] text-gray-500 dark:text-[#6f6f6b]"
            }`}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <p className="text-center italic text-[10px] md:text-xs text-gray-500 dark:text-[#6f6f6b] pt-1.5 px-2">
        AI can make mistakes. It is not a substitute for certified
        professionals.
      </p>
    </div>
  );
}

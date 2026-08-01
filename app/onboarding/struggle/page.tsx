"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crimsonText, dmSans } from "../../../lib/font";
import { Check } from "lucide-react";
import { authFetch } from "../../../lib/auth";
import { useSettings } from "../../../lib/settings-context";

const OPTIONS = [
  { value: "overtrading", label: "Overtrading / revenge trading" },
  { value: "no_stop_loss", label: "No stop-loss / poor risk management" },
  { value: "fomo", label: "FOMO, following the crowd without analysis" },
  { value: "discipline", label: "Struggling to stick to my plan" },
];

export default function StruggleQuizPage() {
  const router = useRouter();
  const { refetch } = useSettings();
  const [struggle, setStruggle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async () => {
    if (!struggle) return;
    setIsSubmitting(true);

    try {
      await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tradingStruggle: struggle }),
      });
      await refetch();
    } catch (err) {
      console.error("Failed to save struggle:", err);
    } finally {
      setIsSubmitting(false);
    }

    router.push("/chat");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <nav className="flex items-center justify-between px-16 py-7">
        <div className={`text-2xl mb-6 leading-snug ${crimsonText.className}`}>
          <h1 className="text-5xl text-black">
            A<span className="text-3xl">xis</span>
          </h1>
        </div>
        <div className="text-sm text-neutral-500">Question 5 of 5</div>
      </nav>

      <div className="h-[3px] bg-neutral-200 w-full">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: "100%" }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <p className={`text-sm text-neutral-500 mb-3 ${dmSans.className}`}>
            Get to know yourself
          </p>

          <h1 className={`text-3xl mb-3 leading-snug ${crimsonText.className}`}>
            What's your biggest struggle when trading?
          </h1>

          <p
            className={`text-neutral-500 text-sm mb-8 leading-relaxed ${dmSans.className}`}
          >
            Axis will focus on helping you with this from your very first
            conversation.
          </p>

          <div className="flex flex-col gap-3 mb-7">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStruggle(opt.value)}
                className={`flex items-center justify-between text-left px-4 py-3.5 border rounded-xl transition-colors ${
                  struggle === opt.value
                    ? "border-black bg-neutral-50"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <span className={`text-[15px] ${dmSans.className}`}>
                  {opt.label}
                </span>
                {struggle === opt.value && (
                  <Check className="w-4 h-4 text-black shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="text-neutral-500 hover:text-black text-sm px-1 py-3 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleFinish}
              disabled={!struggle || isSubmitting}
              className="px-8 py-3.5 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              {isSubmitting ? "Saving..." : "Finish"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

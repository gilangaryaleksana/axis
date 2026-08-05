"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crimsonText, dmSans } from "../../../lib/font";
import { Check } from "lucide-react";
import { authFetch } from "../../../lib/auth";

const OPTIONS = [
  {
    value: "police",
    title: "Strict & direct",
    desc: "Call me out immediately when I make a mistake. No sugarcoating.",
  },
  {
    value: "doctor",
    title: "Calm & supportive",
    desc: "Guide me gently, help me build better habits step by step.",
  },
  {
    value: "teacher",
    title: "Educational",
    desc: "Explain the reasoning behind every suggestion in detail.",
  },
  {
    value: "soldier",
    title: "Tough love",
    desc: "Push me hard. Hold me accountable to discipline, no excuses.",
  },
];

export default function CommunicationStyleQuizPage() {
  const router = useRouter();
  const [style, setStyle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (!style) return;
    setIsSubmitting(true);

    try {
      await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communicationStyle: style,
          defaultPersona: style,
        }),
      });
    } catch (err) {
      console.error("Failed to save communication style:", err);
    } finally {
      setIsSubmitting(false);
    }

    router.push("/onboarding/instruments");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <nav className="flex items-center justify-between px-6 md:px-16 py-5 md:py-7">
        <div className={`text-2xl md:mb-6 leading-snug ${crimsonText.className}`}>
          <h1 className="text-3xl md:text-5xl text-black">
            A<span className="text-xl md:text-3xl">xis</span>
          </h1>
        </div>
        <div className="text-xs md:text-sm text-neutral-500">
          Question 3 of 5
        </div>
      </nav>

      <div className="h-[3px] bg-neutral-200 w-full">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: "60%" }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-8 md:py-10">
        <div className="w-full max-w-md">
          <p className={`text-sm text-neutral-500 mb-3 ${dmSans.className}`}>
            Get to know yourself
          </p>

          <h1
            className={`text-2xl md:text-3xl mb-3 leading-snug ${crimsonText.className}`}
          >
            How do you want your AI coach to talk to you?
          </h1>

          <p
            className={`text-neutral-500 text-sm mb-8 leading-relaxed ${dmSans.className}`}
          >
            This determines which persona Axis will use by default when you
            start chatting.
          </p>

          <div className="flex flex-col gap-3 mb-7">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStyle(opt.value)}
                className={`text-left px-4 py-3.5 border rounded-xl transition-colors ${
                  style === opt.value
                    ? "border-black bg-neutral-50"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[15px] font-semibold ${dmSans.className}`}
                  >
                    {opt.title}
                  </span>
                  {style === opt.value && (
                    <Check className="w-4 h-4 text-black shrink-0" />
                  )}
                </div>
                <p
                  className={`text-[13px] text-neutral-500 mt-1 ${dmSans.className}`}
                >
                  {opt.desc}
                </p>
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
              onClick={handleNext}
              disabled={!style || isSubmitting}
              className="px-8 py-3.5 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-85 disabled:opacity-40 transition-opacity"
            >
              {isSubmitting ? "Saving..." : "Next"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

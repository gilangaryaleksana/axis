"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crimsonText, dmSans } from "../../../lib/font";
import { Check } from "lucide-react";
import { authFetch } from "../../../lib/auth";

const OPTIONS = [
  { value: "wealth", label: "Build long-term wealth" },
  { value: "income", label: "Extra income on the side" },
  { value: "career", label: "Become a full-time trader" },
  { value: "curious", label: "Just curious, learning for fun" },
];

export default function GoalQuizPage() {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (!goal) return;
    setIsSubmitting(true);

    try {
      await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tradingGoal: goal }),
      });
    } catch (err) {
      console.error("Failed to save goal:", err);
    } finally {
      setIsSubmitting(false);
    }

    router.push("/onboarding/background");
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
          Question 1 of 5
        </div>
      </nav>

      <div className="h-[3px] bg-neutral-200 w-full">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: "20%" }}
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
            What's your main goal in trading?
          </h1>

          <p
            className={`text-neutral-500 text-sm mb-8 leading-relaxed ${dmSans.className}`}
          >
            This helps Axis understand what you're working toward.
          </p>

          <div className="flex flex-col gap-3 mb-7">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setGoal(opt.value)}
                className={`flex items-center justify-between text-left px-4 py-3.5 border rounded-xl transition-colors ${
                  goal === opt.value
                    ? "border-black bg-neutral-50"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <span className={`text-[15px] ${dmSans.className}`}>
                  {opt.label}
                </span>
                {goal === opt.value && (
                  <Check className="w-4 h-4 text-black shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleNext}
              disabled={!goal || isSubmitting}
              className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-85 disabled:opacity-40 transition-opacity"
            >
              {isSubmitting ? "Saving..." : "Next"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

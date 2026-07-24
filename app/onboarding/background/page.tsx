"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const OPTIONS = [
  { value: "pemula", label: "Beginner, just getting started" },
  {
    value: "menengah",
    label: "Intermediate, have traded before but not consistently",
  },
  {
    value: "berpengalaman",
    label: "Experienced, trading regularly every week",
  },
  { value: "profesional", label: "Professional / full-time trader" },
  {
    value: "observer",
    label: "Just want to follow the market, not trading yet",
  },
];

export default function BackgroundQuizPage() {
  const router = useRouter();
  const [background, setBackground] = useState("");

  const handleNext = () => {
    if (!background) return;

    // TODO: save to global state / send to API here
    // example: await fetch("/api/onboarding/background", { method: "POST", body: JSON.stringify({ background }) })

    router.push("/onboarding/next-step");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <nav className="flex items-center justify-between px-16 py-7">
        <div
          className="text-2xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          <span className="text-3xl">A</span>xis
        </div>
        <div className="text-sm text-neutral-500">Question 2 of 5</div>
      </nav>

      <div className="h-[3px] bg-neutral-200 w-full">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: "40%" }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <p className="text-sm text-neutral-500 mb-3">Get to know yourself</p>

          <h1
            className="text-3xl mb-3 leading-snug"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            What is your background as a trader?
          </h1>

          <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
            This helps Axis choose the persona and conversation style that fits
            you best.
          </p>

          <label
            htmlFor="background"
            className="text-sm font-semibold mb-2 block"
          >
            Choose one
          </label>

          <div className="relative mb-7">
            <select
              id="background"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              required
              className="w-full appearance-none px-4 py-3.5 pr-11 border border-neutral-200 rounded-xl text-[15px] text-black bg-white outline-none focus:border-black transition-colors cursor-pointer"
            >
              <option value="" disabled hidden>
                -- Select your background --
              </option>
              {OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-xs">
              ▼
            </span>
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
              disabled={!background}
              className="px-8 py-3.5 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

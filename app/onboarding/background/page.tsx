"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crimsonText, dmSans } from "../../../lib/font";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

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
        <div className={`text-2xl mb-6 leading-snug ${crimsonText.className}`}>
          <h1 className="text-5xl text-black">
            A<span className="text-3xl">xis</span>
          </h1>
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
          <p className={`text-sm text-neutral-500 mb-3 ${dmSans.className}`}>
            Get to know yourself
          </p>

          <h1 className={`text-3xl mb-3 leading-snug ${crimsonText.className}`}>
            What is your background as a trader?
          </h1>

          <p
            className={`text-neutral-500 text-sm mb-8 leading-relaxed ${dmSans.className}`}
          >
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
            <Select.Root value={background} onValueChange={setBackground}>
              <Select.Trigger className="w-full flex items-center justify-between px-4 py-3.5 border border-neutral-200 rounded-xl text-[15px] bg-white outline-none focus:border-black transition-colors data-[placeholder]:text-neutral-400">
                <Select.Value placeholder="-- Select your background --" />
                <Select.Icon>
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                </Select.Icon>
              </Select.Trigger>

              <Select.Portal>
                <Select.Content className="overflow-hidden bg-white rounded-xl border border-neutral-200 shadow-lg z-50">
                  <Select.Viewport className="p-1">
                    {OPTIONS.map((opt) => (
                      <Select.Item
                        key={opt.value}
                        value={opt.value}
                        className="flex items-center justify-between px-3 py-2.5 text-[14px] rounded-lg text-black cursor-pointer outline-none data-[highlighted]:bg-black data-[highlighted]:text-white transition-colors"
                      >
                        <Select.ItemText>{opt.label}</Select.ItemText>
                        <Select.ItemIndicator>
                          <Check className="w-4 h-4" />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
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

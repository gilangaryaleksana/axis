"use client";
import SettingsRow from "../SettingsRow";
import { useSettings } from "@/lib/settings-context";

const GOAL_OPTIONS = [
  { value: "wealth", label: "Build long-term wealth" },
  { value: "income", label: "Extra income on the side" },
  { value: "career", label: "Become a full-time trader" },
  { value: "curious", label: "Just curious, learning for fun" },
];

const BACKGROUND_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "experienced", label: "Experienced" },
  { value: "professional", label: "Professional" },
  { value: "observer", label: "Just observing" },
];

const COMMUNICATION_OPTIONS = [
  { value: "police", label: "Strict & direct" },
  { value: "doctor", label: "Calm & supportive" },
  { value: "teacher", label: "Educational" },
  { value: "soldier", label: "Tough love" },
];

const INSTRUMENT_OPTIONS = [
  { value: "stocks", label: "Stocks" },
  { value: "crypto", label: "Crypto" },
  { value: "forex", label: "Forex" },
  { value: "options_futures", label: "Options / Futures" },
  { value: "unsure", label: "Not sure yet" },
];

const STRUGGLE_OPTIONS = [
  { value: "overtrading", label: "Overtrading / revenge trading" },
  { value: "no_stop_loss", label: "No stop-loss / poor risk management" },
  { value: "fomo", label: "FOMO, following the crowd" },
  { value: "discipline", label: "Struggling to stick to plan" },
];

export default function GeneralPane() {
  const { data, setField, isLoading } = useSettings();

  if (isLoading) {
    return <p className="text-sm text-[#9a9a9e]">Loading...</p>;
  }

  const selectClass =
    "w-full sm:w-48 rounded-md border border-gray-300 dark:border-[#3a3a3d] bg-white dark:bg-[#2c2c2f] text-[#1a1a1a] dark:text-[#f2f2f0] px-3 py-1.5 text-sm outline-none focus:border-[#6f8fd8]";

  return (
    <div className="space-y-5">
      <SettingsRow
        label="Display name"
        desc="This name will be displayed in your chats."
      >
        <input
          type="text"
          value={data.displayName}
          onChange={(e) => setField("displayName", e.target.value)}
          className={selectClass}
        />
      </SettingsRow>

      <SettingsRow label="Language" desc="Default language for AI responses.">
        <select
          value={data.language}
          onChange={(e) => setField("language", e.target.value)}
          className={selectClass}
        >
          <option value="en">English</option>
          <option value="id">Indonesian</option>
        </select>
      </SettingsRow>

      <div className="pt-3 border-t border-gray-200 dark:border-[#333336]">
        <p className="text-xs font-semibold text-gray-500 dark:text-[#9a9a9e] mb-1">
          Trading Profile
        </p>

        <p className="text-xs text-gray-400 dark:text-[#6f6f6b] mb-3">
          Axis uses this to personalize how it responds to you in chat.
        </p>

        <div className="space-y-5">
          <SettingsRow label="Trading goal" desc="What you're working toward.">
            <select
              value={data.tradingGoal}
              onChange={(e) => setField("tradingGoal", e.target.value)}
              className={selectClass}
            >
              <option value="">Not set</option>
              {GOAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingsRow>

          <SettingsRow
            label="Trading experience"
            desc="Your current experience level."
          >
            <select
              value={data.tradingBackground}
              onChange={(e) => setField("tradingBackground", e.target.value)}
              className={selectClass}
            >
              <option value="">Not set</option>
              {BACKGROUND_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingsRow>

          <SettingsRow
            label="Communication style"
            desc="How you want your AI coach to talk to you."
          >
            <select
              value={data.communicationStyle}
              onChange={(e) => setField("communicationStyle", e.target.value)}
              className={selectClass}
            >
              <option value="">Not set</option>
              {COMMUNICATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingsRow>

          <SettingsRow label="Main instrument" desc="What you mostly trade.">
            <select
              value={data.tradingInstrument}
              onChange={(e) => setField("tradingInstrument", e.target.value)}
              className={selectClass}
            >
              <option value="">Not set</option>
              {INSTRUMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingsRow>

          <SettingsRow
            label="Biggest struggle"
            desc="What Axis should help you focus on."
          >
            <select
              value={data.tradingStruggle}
              onChange={(e) => setField("tradingStruggle", e.target.value)}
              className={selectClass}
            >
              <option value="">Not set</option>
              {STRUGGLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingsRow>
        </div>
      </div>
    </div>
  );
}

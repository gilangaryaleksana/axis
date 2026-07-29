"use client";

export default function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
        checked ? "justify-end bg-[#6f8fd8]" : "justify-start bg-[#3a3a3d]"
      }`}
    >
      <span className="block h-4 w-4 rounded-full bg-white transition-all" />
    </button>
  );
}

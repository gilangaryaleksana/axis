export default function SettingsRow({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-[#6f6f73]">{desc}</div>
      </div>
      {children}
    </div>
  );
}

import SettingsRow from "../SettingsRow";

export default function GeneralPane() {
  return (
    <div className="space-y-5">
      <SettingsRow label="Display name" desc="Nama yang muncul di chat kamu">
        <input
          type="text"
          defaultValue="Gilang Arya"
          className="w-48 rounded-md border border-[#3a3a3d] bg-[#2c2c2f] px-3 py-1.5 text-sm outline-none focus:border-[#6f8fd8]"
        />
      </SettingsRow>
      <SettingsRow label="Language" desc="Bahasa default untuk respons AI">
        <select className="w-48 rounded-md border border-[#3a3a3d] bg-[#2c2c2f] px-3 py-1.5 text-sm outline-none">
          <option>Bahasa Indonesia</option>
          <option>English</option>
        </select>
      </SettingsRow>
    </div>
  );
}
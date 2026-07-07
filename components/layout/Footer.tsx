import { crimsonText } from "../../lib/font";

export const Footer = () => {
  return (
    <section className="absolute bottom-0 left-0 w-full">
      <footer
        className={`flex items-center justify-between bg-[#B2B2B2] px-8 py-6 text-sm text-[#F3F3F3] ${crimsonText.className}`}
      >
        <span>Axis © 2026</span>
        <div className="flex gap-8">
          <a href="#" className="hover:underline">
            Github
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
          <a href="#" className="hover:underline">
            About
          </a>
        </div>
      </footer>
    </section>
  );
};

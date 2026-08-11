import { dmSans } from "../../lib/font";
import Image from "next/image";
import { GoogleLoginShortcut } from "../auth/GoogleLoginShortcut";

const footerLinks = {
  Product: ["Chat", "Personas", "Pricing", "Download app", "Log in"],
  Personas: ["Police", "Soldier", "Teacher", "Doctor"],
  Resources: ["Docs", "Blog", "FAQ", "Guides", "Changelog"],
  Company: ["About", "Careers", "Contact", "Privacy policy", "Terms"],
};

export const Footer = () => {
  return (
    <footer
      className={`w-full bg-[#090908] px-10 py-16 text-[#B2B2B2] ${dmSans.className}`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[20rem_2fr]">
          <div>
            <Image
              src="/icons/Axis.png"
              alt="Axis Logo"
              width={100}
              height={100}
            />
          </div>
          <div>
            <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
              {Object.entries(footerLinks).map(([section, links]) => (
                <div key={section}>
                  <h4 className="mb-4 text-sm font-semibold text-[#F3F3F3]">
                    {section}
                  </h4>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-sm text-[#B2B2B2] transition-colors hover:text-[#F3F3F3]"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <GoogleLoginShortcut />
        <div className="mt-16 flex items-center justify-between border-t border-[#2A2A2A] pt-6 text-xs text-[#8A8A8A]">
          <span>Axis © 2026</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#F3F3F3] hover:underline">
              Github
            </a>
            <a href="#" className="hover:text-[#F3F3F3] hover:underline">
              Contact
            </a>
            <a href="#" className="hover:text-[#F3F3F3] hover:underline">
              About
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

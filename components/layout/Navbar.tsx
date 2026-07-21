import { crimsonText } from "../../lib/font";
import { ArrowUpRight } from "lucide-react";

export function Navbar() {
  return (
    <nav className={crimsonText.className}>
      <div className="flex items-end justify-between text-black">
        <div className="absolute top-6 left-10">
          <h1 className="text-6xl">
            A<span className="text-4xl">xis</span>
          </h1>
        </div>
        <div className="flex justify-center items-center gap-10 text-2xl fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-white">
          <a className="hover:text-gray-400" href="">
            Features
          </a>
          <a className="hover:text-gray-400" href="">
            Personas
          </a>
          <a className="hover:text-gray-400" href="">
            How It Works
          </a>
        </div>
        <div className="absolute top-12 right-10">
          <button className="text-2xl relative hover:text-gray-400">
            Login
            <ArrowUpRight size={13} className="absolute top-1 -right-1" />
          </button>
        </div>
      </div>
    </nav>
  );
}

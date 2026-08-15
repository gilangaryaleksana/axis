"use client";
import { useState, useEffect } from "react";
import { crimsonText } from "../../lib/font";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { GoogleOneTap } from "../auth/GoogleOneTap";

export function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          { credentials: "include" },
        );
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      }
    }
    checkSession();
  }, []);

  return (
    <nav className={crimsonText.className}>
      <GoogleOneTap />
      <div className="flex items-end justify-between text-black">
        <div className="absolute top-6 left-10">
          <h1 className="text-5xl">
            a<span className="text-4xl">xis</span>
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
          <button
            className="text-2xl relative hover:text-gray-400"
            onClick={() => router.push(isLoggedIn ? "/chat" : "/login")}
          >
            {isLoggedIn ? "Chat" : "Login"}
            <ArrowUpRight size={13} className="absolute top-1 -right-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}

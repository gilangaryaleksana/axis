"use client";

import { useState } from "react";
import { dmSans, crimsonText } from "../../lib/font";
import { Persona, PERSONAS } from "../../components/persona/personas";
import ChatHeader from "../../components/chat/ChatHeader";

export default function LoginPage() {
  const persona = PERSONAS.find((p) => p.name === "Police") ?? PERSONAS[0];
  const Icon = persona.icon;
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to your auth API (NextAuth / custom JWT)
    // example: await signIn("credentials", { email, password })
    console.log({ mode, email, password, remember });
  };

  const handleOAuth = (provider: "google" | "github") => {
    // TODO: connect to NextAuth signIn(provider) or manual OAuth redirect
    // example: signIn(provider)
    console.log("oauth:", provider);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white overflow-hidden">
      <div className="w-full h-full bg-white grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {" "}
        {/* LEFT: form */}
        <div className="p-6 md:p-8 flex flex-col overflow-y-auto">
          <div
            className={`text-2xl mb-6 leading-snug ${crimsonText.className}`}
          >
            <h1 className="text-5xl text-black">
              A<span className="text-3xl">xis</span>
            </h1>
          </div>

          <div className="max-w-[340px] w-full mx-auto flex-1 flex flex-col justify-center">
            <h1
              className={`text-3xl font-extralight text-black ${crimsonText.className}`}
            >
              Welcome back
            </h1>
            <p className={`text-neutral-500 text-sm mb-4 ${dmSans.className}`}>
              Sign in to continue your conversation
            </p>

            {/* toggle */}
            <div className="relative flex bg-neutral-100 rounded-xl p-1 mb-4">
              {/* Sliding background */}
              <div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-black rounded-lg transition-transform duration-100 ease-out"
                style={{
                  transform:
                    mode === "signin"
                      ? "translateX(0%)"
                      : "translateX(calc(100% + 8px))",
                }}
              />

              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-100 ${
                  mode === "signin" ? "text-white" : "text-neutral-500"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-100 ${
                  mode === "signup" ? "text-white" : "text-neutral-500"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <div>
                <label
                  htmlFor="email"
                  className={`text-[13px] block mb-1.5 text-neutral-900 ${dmSans.className}`}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-[14px] text-neutral-900 outline-none focus:border-black transition-colors placeholder:text-neutral-400"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className={`text-[13px] block mb-1.5 text-neutral-900 ${dmSans.className}`}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-[14px]  text-neutral-900 outline-none focus:border-black transition-colors placeholder:text-neutral-400"
                />
              </div>

              <div className="flex items-center justify-between text-[13px]">
                <label className="flex items-center gap-2 text-neutral-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-[15px] h-[15px] accent-black"
                  />
                  Remember me
                </label>
                <a href="#" className="text-neutral-500 hover:text-black">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="mt-1 py-3 rounded-xl bg-black text-white text-[14px] font-semibold hover:opacity-85 transition-opacity"
              >
                Continue
              </button>
            </form>

            <div className="flex items-center gap-3 my-3.5">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-xs text-neutral-500 whitespace-nowrap">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                className="flex-1 flex items-center justify-center gap-2 py-2 border border-neutral-200 rounded-xl text-[13.5px] hover:bg-neutral-50 hover:border-neutral-300 transition-colors duration-200 text-neutral-500"
              >
                <svg width="16" height="16" viewBox="0 0 18 18">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.87 2.7-6.62z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuth("github")}
                className="flex-1 flex items-center justify-center gap-2 py-2 border border-neutral-200 rounded-xl text-[13.5px] hover:bg-neutral-50 hover:border-neutral-300 transition-colors duration-200 text-neutral-500"
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="#111">
                  <path d="M9 0C4.03 0 0 4.03 0 9c0 3.98 2.58 7.35 6.16 8.54.45.08.61-.2.61-.44v-1.7c-2.5.54-3.03-1.2-3.03-1.2-.41-1.04-1-1.31-1-1.31-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.1.98 2.62.75.08-.58.32-.98.57-1.2-2-.23-4.1-1-4.1-4.44 0-.98.35-1.78.92-2.4-.09-.23-.4-1.14.09-2.38 0 0 .76-.24 2.48.92A8.6 8.6 0 0 1 9 4.28c.77 0 1.54.1 2.26.31 1.72-1.16 2.48-.92 2.48-.92.49 1.24.18 2.15.09 2.38.57.62.92 1.42.92 2.4 0 3.45-2.1 4.2-4.11 4.43.33.28.62.85.62 1.7V17.1c0 .24.16.53.62.44C15.42 16.35 18 12.98 18 9c0-4.97-4.03-9-9-9z" />
                </svg>
                GitHub
              </button>
            </div>

            <p className="text-center text-[12.5px] text-neutral-500 mt-4">
              {mode === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="font-semibold text-black hover:underline"
                  >
                    Sign up now
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="font-semibold text-black hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
        {/* RIGHT: chat preview visual */}
        <div className="hidden md:flex relative bg-[#2b2b2b] items-center justify-center p-12 overflow-hidden">
          <div
            className="absolute w-[480px] h-[480px] rounded-full -top-20 -right-28 z-10"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%)",
            }}
          />

          <div
            className="relative w-full max-w-md flex flex-col gap-2.5 font-extralight"
            style={{
              transform: "perspective(1000px) rotateY(-25deg) rotateX(8deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <ChatHeader
              persona={persona}
              sub="Trading discipline, no excuses"
            />
            <div
              className={`px-4 py-3 max-w-[80%] self-start leading-relaxed text-[13.5px] rounded-r-[35px] rounded-bl-[25px] bg-[#e7e5e0] text-[#2a2a28] font-extralight ${dmSans.className}`}
            >
              Did you enter this position with a stop-loss or do you dare again?
            </div>
            <div
              className={`px-4 py-3 max-w-[80%] self-end leading-relaxed text-[13.5px] rounded-l-[35px] rounded-br-[25px] bg-[#4d4d4a] shadow-[0_2px_12px_rgba(0,0,0,0.35)] text-[#f4f3f0] font-extralight ${dmSans.className}`}
            >
              Not yet, I just have a feeling the price will go up.
            </div>
            <div
              className={`px-4 py-3 max-w-[80%] self-start leading-relaxed text-[13.5px] rounded-r-[35px] rounded-bl-[25px] bg-[#e7e5e0] text-[#2a2a28] font-extralight ${dmSans.className}`}
            >
              That's not a strategy, it's gambling. Set a stop-loss first, then
              we can continue talking.
            </div>
          </div>

          <div
            className={`absolute bottom-12 left-12 right-12 text-neutral-400 text-[13px] leading-relaxed ${dmSans.className}`}
          >
            <strong
              className={`block text-white text-[19px] mb-2 font-normal ${crimsonText.className}`}
            >
              Every persona has its own character.
            </strong>
            Not just answering questions — Axis is designed to remember and
            respond like someone, not something.
          </div>
        </div>
      </div>
    </div>
  );
}

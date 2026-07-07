import React from "react";
import Image from "next/image";
import { VenetianMask, Zap, HardDriveDownload, Shield } from "lucide-react";

// Fonts
import { dmSans, crimsonText } from "../lib/font";

// Layout
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

// UI
import ChatWindow from "../components/ui/ChatWindow";
import PersonasGrid from "../components/ui/PersonasGrid";

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />

      <div className="flex flex-col gap-12 pt-24 justify-center items-center min-h-screen">
        <h1
          className={`text-5xl font-bold text-center text-black ${dmSans.className}`}
        >
          Meet AI That Actually Has a Personality
          <div className="w-6xl h-px mx-auto mt-2 bg-linear-to-r from-transparent via-gray-300 to-transparent" />{" "}
        </h1>
        <p className={`text-xl text-center text-[#757575] ${dmSans.className}`}>
          Axis lets you chat with AI personas built to think, respond, and
          connect — not just answer.
        </p>
        <div className="flex justify-center gap-20 items-center w-full">
          <button
            className={`bg-black text-xl font-semibold text-white py-4 px-14 rounded-xl tracking-tighter hover:bg-neutral-800 ${dmSans.className}`}
          >
            Start Chatting
          </button>
          <a href="" className={`text-xl text-[#303030] ${dmSans.className}`}>
            See How It Works
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-12 pt-24 justify-center items-center">
        <div className="flex flex-col gap-4 justify-center items-center w-full relative isolate">
          <Image
            src="/images/banner-hero.jpg"
            alt="Hero Image"
            width={833}
            height={415}
            className="w-2xl h-85 object-top object-cover rounded-tr-[150px] rounded-tl-[65px] relative z-10"
          />

          <div className="w-4xl h-92.5 absolute bottom-0 z-0 bg-[#AEAEB2] rounded-b-[160px]"></div>

          <div className="flex flex-col justify-center items-center gap-4 w-5xl relative z-20 pb-12">
            <h1
              className={`text-4xl font-semibold text-center text-white ${dmSans.className}`}
            >
              Generic chatbots feel... generic.
            </h1>
            <p
              className={`text-xl w-2xl text-center font-extralight text-white ${dmSans.className}`}
            >
              Most AI feels the same no matter who you're talking to. Axis gives
              you personas with distinct personalities, tone, and memory — so
              every conversation feels like talking to someone, not something
            </p>
          </div>
        </div>
      </div>

      <div className="w-full flex mt-20 flex-col gap-12 justify-center items-center">
        <div className="w-7xl mx-auto relative">
          <h1
            className={`absolute left-10 text-black text-xs ${dmSans.className}`}
          >
            Built Different :
          </h1>
          <p
            className={`text-3xl text-center my-20 text-black ${crimsonText.className}`}
          >
            Every part of Axis is built around one idea: AI should feel like
            someone, not something.
          </p>
          <div className="grid grid-cols-4 gap-12 justify-center items-start w-6xl mx-auto">
            <div className="w-55 h-auto gap-4 flex flex-col justify-center items-start">
              <h1
                className={`text-black text-[18px] flex justify-center items-center gap-2 ${dmSans.className}`}
              >
                <VenetianMask size={20} />
                Multiple Personas
              </h1>
              <p className={`text-[15px] text-[#757575] ${dmSans.className}`}>
                Choose from a range of AI characters, each with their own voice
                and vibe.
              </p>
            </div>
            <div className="w-55 h-auto gap-4 flex flex-col justify-center items-start">
              <h1
                className={`text-black text-[18px] flex justify-center items-center gap-2 ${dmSans.className}`}
              >
                <Zap size={20} />
                Lightning Fast
              </h1>
              <p className={`text-[15px] text-[#757575] ${dmSans.className}`}>
                Powered by Groq + LLaMA for near-instant responses.
              </p>
            </div>
            <div className="w-55 h-auto gap-4 flex flex-col justify-center items-start">
              <h1
                className={`text-black text-[18px] flex justify-center items-center gap-2 ${dmSans.className}`}
              >
                <HardDriveDownload size={20} />
                Conversations, Saved
              </h1>
              <p className={`text-[15px] text-[#757575] ${dmSans.className}`}>
                Pick up right where you left off, every time.
              </p>
            </div>
            <div className="w-55 h-auto gap-4 flex flex-col justify-center items-start">
              <h1
                className={`text-black text-[18px] flex justify-center items-center gap-2 ${dmSans.className}`}
              >
                <Shield size={20} />
                Secure Sign-In
              </h1>
              <p className={`text-[15px] text-[#757575] ${dmSans.className}`}>
                Quick and safe login, no hassle.
              </p>
            </div>
            <div className="w-4xl h-px mx-auto mt-2 bg-linear-to-r from-transparent via-gray-300 to-transparent" />{" "}
          </div>
        </div>

        <div className="w-7xl h-auto flex flex-col justify-center items-center gap-20 pt-20 mx-auto relative">
          <h1
            className={`absolute left-10 top-0 text-black text-xs ${dmSans.className}`}
          >
            Built With :
          </h1>

          <div className="flex justify-evenly items-center w-6xl mx-auto">
            <Image
              src="/icons/Prisma-LightSymbol.svg"
              alt="Prisma"
              width={40}
              height={40}
              className="w-10 h-auto"
            />
            <Image
              src="/icons/Nextjs-LightSymbol.svg"
              alt="Next.js"
              width={40}
              height={40}
              className="w-40 h-auto"
            />
            <Image
              src="/icons/Groq-LightSymbol.svg"
              alt="Groq"
              width={40}
              height={40}
              className="w-40 h-auto"
            />
          </div>

          <ChatWindow />
        </div>

        <div className="w-full flex flex-col gap-20 justify-center items-center my-20">
          <div className="flex flex-col gap-8 justify-center items-center w-full relative z-20">
            <h1 className={`text-5xl text-black font-bold ${dmSans.className}`}>
              Find Your Match
            </h1>
            <p className={`text-2xl text-[#757575] ${dmSans.className}`}>
              Every persona is built with its own personality, tone, and way of
              talking
            </p>
          </div>

          <PersonasGrid />
        </div>

        <div className="relative mx-auto flex h-142.75 w-full items-center px-6">
          <div className="relative z-10 flex w-full flex-col items-center gap-10 pr-0 text-center">
            <h1
              className={`text-6xl font-bold leading-tight text-black ${dmSans.className}`}
            >
              Your Next Conversation Is Waiting
            </h1>
            <p
              className={`text-lg text-[#757575] ${dmSans.className} max-w-2xl text-center`}
            >
              No credit card, no commitment — just start talking.
            </p>
            <button
              className={`rounded-xl bg-black px-8 py-3 text-sm font-black text-white transition hover:bg-neutral-800 ${dmSans.className}`}
            >
              Try Axis Now
            </button>
          </div>

          <div className="absolute right-0 top-0 h-125.75 w-35.75 overflow-hidden rounded-tl-[35px] rounded-tr-[250px] rounded-bl-[250px] rounded-br-none md:block hidden">
            <Image
              src="/images/decoration/cta-laptop.jpg"
              alt="Person typing on a laptop"
              fill
              className="object-cover"
            />
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}

"use client";
import Image from "next/image";
import { VenetianMask, Zap, HardDriveDownload, Shield } from "lucide-react";

// Fonts
import { dmSans, crimsonText } from "../lib/font";

// Providers
import SmoothScroll from "../components/providers/SmoothScroll";

// Layout
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

// UI
import PersonasGrid from "../components/ui/PersonasGrid";
import ScrollIndicator from "../components/ui/ScrollIndicator";

// Animations
import { Reveal } from "../components/animations/Reveal";

// Sections
import ChatMorphSection from "../components/sections/ChatMorphSection";

// Navigation
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <SmoothScroll>
      <ScrollIndicator />
      <div className="bg-white">
        <Navbar />
        <div className="w-full flex mt-20 flex-col justify-center items-center">
          <div className="w-full mx-auto relative">

            <Reveal direction="down" delay={300}>
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
                      Most AI feels the same no matter who you&apos;re talking
                      to. Axis gives you personas with distinct personalities,
                      tone, and memory — so every conversation feels like
                      talking to someone, not something
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="w-full flex mt-20 flex-col gap-12 justify-center items-center">
              <div className="w-7xl mx-auto relative">
                <h1
                  className={`absolute left-10 text-black text-xs ${dmSans.className}`}
                >
                  Built Different :
                </h1>
                <Reveal direction="up">
                  <p
                    className={`text-3xl text-center my-20 text-black ${crimsonText.className}`}
                  >
                    Every part of Axis is built around one idea: AI should feel
                    like someone, not something.
                  </p>
                </Reveal>
                <div className="grid grid-cols-4 justify-center items-start w-6xl mx-auto">
                  <Reveal direction="up" delay={0}>
                    <div className="w-55 h-auto gap-4 flex flex-col justify-center items-start">
                      <h1
                        className={`text-black text-[18px] flex justify-center items-center gap-2 ${dmSans.className}`}
                      >
                        <VenetianMask size={20} />
                        Multiple Personas
                      </h1>
                      <p
                        className={`text-[15px] text-[#757575] ${dmSans.className}`}
                      >
                        Choose from a range of AI characters, each with their
                        own voice and vibe.
                      </p>
                    </div>
                  </Reveal>
                  <Reveal direction="up" delay={100}>
                    <div className="w-55 h-auto gap-4 flex flex-col justify-center items-start">
                      <h1
                        className={`text-black text-[18px] flex justify-center items-center gap-2 ${dmSans.className}`}
                      >
                        <Zap size={20} />
                        Lightning Fast
                      </h1>
                      <p
                        className={`text-[15px] text-[#757575] ${dmSans.className}`}
                      >
                        Powered by Groq + LLaMA for near-instant responses.
                      </p>
                    </div>
                  </Reveal>
                  <Reveal direction="up" delay={200}>
                    <div className="w-55 h-auto gap-4 flex flex-col justify-center items-start">
                      <h1
                        className={`text-black text-[18px] flex justify-center items-center gap-2 ${dmSans.className}`}
                      >
                        <HardDriveDownload size={20} />
                        Conversations, Saved
                      </h1>
                      <p
                        className={`text-[15px] text-[#757575] ${dmSans.className}`}
                      >
                        Pick up right where you left off, every time.
                      </p>
                    </div>
                  </Reveal>
                  <Reveal direction="up" delay={300}>
                    <div className="w-55 h-auto gap-4 flex flex-col justify-center items-start">
                      <h1
                        className={`text-black text-[18px] flex justify-center items-center gap-2 ${dmSans.className}`}
                      >
                        <Shield size={20} />
                        Secure Sign-In
                      </h1>
                      <p
                        className={`text-[15px] text-[#757575] ${dmSans.className}`}
                      >
                        Quick and safe login, no hassle.
                      </p>
                    </div>
                  </Reveal>
                  <div className="w-4xl h-px mx-auto mt-2 bg-linear-to-r from-transparent via-gray-300 to-transparent" />{" "}
                </div>
              </div>

              <div className="w-7xl h-auto flex flex-col justify-center items-center gap-20 py-20 mx-auto relative">
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
                  <Image
                    src="/icons/Tailwindcss-LightSymbol.svg"
                    alt="Tailwind CSS"
                    width={40}
                    height={40}
                    className="w-40 h-auto"
                  />
                  <Image
                    src="/icons/Typescript-LightSymbol.svg"
                    alt="TypeScript"
                    width={15}
                    height={15}
                    className="w-15 h-auto"
                  />
                  <Image
                    src="/icons/Nextauth-LightSymbol.svg"
                    alt="Nextauth"
                    width={15}
                    height={15}
                    className="w-15 h-auto"
                  />
                </div>
              </div>

              <ChatMorphSection />

              <div className="w-full flex flex-col gap-20 justify-center items-center mb-10">
                <PersonasGrid />
              </div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
}

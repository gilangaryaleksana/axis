"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { setToken, getToken } from "@/lib/auth";

declare global {
  interface Window {
    google?: any;
  }
}

export function GoogleOneTap() {
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (getToken()) return;
    if (initialized.current) return;
    initialized.current = true;

    const handleCredentialResponse = async (response: {
      credential: string;
    }) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/onetap`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: response.credential }),
          },
        );

        if (!res.ok) throw new Error("Login gagal");

        const data = await res.json();
        setToken(data.token);
        router.push("/chat");
      } catch (err) {
        console.error("One Tap login gagal:", err);
      }
    };

    const initOneTap = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.prompt();
    };

    if (window.google) {
      initOneTap();
    } else {
      window.addEventListener("load", initOneTap);
    }

    return () => {
      window.removeEventListener("load", initOneTap);
      if (window.google) {
        window.google.accounts.id.cancel();
      }
      initialized.current = false; // ← reset biar mount berikutnya bisa init ulang
    };
  }, [router]);

  return null;
}

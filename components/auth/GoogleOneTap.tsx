"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google?: any;
  }
}

export function GoogleOneTap() {
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    async function checkSessionAndInit() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          { credentials: "include" },
        );
        if (res.ok) return; 
      } catch {
      }

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
              credentials: "include",
              body: JSON.stringify({ idToken: response.credential }),
            },
          );

          if (!res.ok) throw new Error("Login failed");

          const data = await res.json();
          window.location.href = data.isNewUser ? "/onboarding/goal" : "/chat";
        } catch (err) {
          console.error("One Tap login failed:", err);
        }
      };

      const initOneTap = () => {
        if (!window.google) return;
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          use_fedcm_for_prompt: false,
        });
        window.google.accounts.id.prompt();
      };

      if (window.google) {
        initOneTap();
      } else {
        window.addEventListener("load", initOneTap);
      }
    }

    checkSessionAndInit();

    return () => {
      window.removeEventListener("load", () => {});
      if (window.google) {
        window.google.accounts.id.cancel();
      }
      initialized.current = false;
    };
  }, [router]);

  return null;
}

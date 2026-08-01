"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const isNewUser = searchParams.get("isNewUser") === "true"; 

    if (!token) {
      setError("Token not found in the URL. Login failed.");
      return;
    }

    setToken(token);

    if (isNewUser) {
      router.replace("/onboarding/goal"); 
    } else {
      router.replace("/chat"); 
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-center px-6">
        <div>
          <p className="text-red-500 mb-2">{error}</p>
          <a href="/" className="underline text-sm">
            Back to homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Logging in...</p>
    </div>
  );
}
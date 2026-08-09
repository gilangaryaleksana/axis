"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isNewUser = searchParams.get("isNewUser") === "true";

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

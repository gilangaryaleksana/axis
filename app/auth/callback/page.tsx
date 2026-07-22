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

    if (!token) {
      setError("Token tidak ditemukan di URL. Login gagal.");
      return;
    }

    setToken(token);
    router.replace("/chat");
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-center px-6">
        <div>
          <p className="text-red-500 mb-2">{error}</p>
          <a href="/" className="underline text-sm">
            Kembali ke halaman utama
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Sedang masuk...</p>
    </div>
  );
}

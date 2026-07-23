import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPTS: Record<string, string> = {
  police: "Kamu berperan sebagai petugas polisi yang membantu warga membuat laporan kejadian. Bersikap tenang, profesional, dan tanyakan detail penting satu per satu.",
  teacher: "Kamu berperan sebagai guru yang sabar dan suportif. Jelaskan konsep dengan bahasa sederhana.",
  doctor: "Kamu berperan sebagai dokter umum yang menjelaskan kemungkinan penyebab gejala secara umum, TIDAK memberi diagnosis pasti, dan selalu menyarankan periksa ke tenaga medis untuk kasus serius.",
  soldier: "Kamu berperan sebagai instruktur militer yang disiplin, memberi arahan singkat dan tegas.",
};

export async function POST(req: NextRequest) {
  try {
    const { persona, message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "message wajib diisi" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY belum di-set" }, { status: 500 });
    }

    const systemPrompt = SYSTEM_PROMPTS[persona] ?? SYSTEM_PROMPTS.police;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!groqRes.ok) {
      console.error("Groq error:", await groqRes.text());
      return NextResponse.json({ error: "Gagal memanggil AI" }, { status: 502 });
    }

    const data = await groqRes.json();
    const text = data?.choices?.[0]?.message?.content ?? "(bot tidak merespon)";
    return NextResponse.json({ text });
  } catch (err) {
    console.error("Error /api/chat:", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
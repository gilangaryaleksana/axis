import { authFetch } from "@/lib/auth";

export async function createConversation(personaType: string) {
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/conversations`,
    {
      method: "POST",
      body: JSON.stringify({ personaType }),
    },
  );
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function sendMessage(conversationId: string, content: string) {
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    },
  );
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}

import { apiFetch } from "@/lib/api";

export async function createConversation(personaType: string) {
  return apiFetch("/api/conversations", {
    method: "POST",
    body: JSON.stringify({ personaType }),
  });
}

export async function sendMessage(conversationId: string, content: string) {
  return apiFetch(`/api/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

import { createFileRoute } from "@tanstack/react-router";
import { chatAthena } from "../../lib/provaxApi";

export const Route = createFileRoute("/api/chat-athena")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => ({}));
        const lastMessage = Array.isArray(body.messages) ? body.messages.at(-1)?.content : "";
        return Response.json(chatAthena(lastMessage, body.aiName || "Athena AI"));
      },
    },
  },
});
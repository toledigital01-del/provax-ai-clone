import { createFileRoute } from "@tanstack/react-router";
import { createQuestion } from "../../lib/provaxApi";

export const Route = createFileRoute("/api/generate-question")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => ({}));
        return Response.json(createQuestion(body.discipline, body.difficulty));
      },
    },
  },
});
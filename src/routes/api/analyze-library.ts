import { createFileRoute } from "@tanstack/react-router";
import { analyzeMaterial } from "../../lib/provaxApi";

export const Route = createFileRoute("/api/analyze-library")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => ({}));
        return Response.json(analyzeMaterial(body.fileName, body.textContent));
      },
    },
  },
});
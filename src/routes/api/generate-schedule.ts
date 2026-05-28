import { createFileRoute } from "@tanstack/react-router";
import { createSchedule } from "../../lib/provaxApi";

export const Route = createFileRoute("/api/generate-schedule")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => ({}));
        return Response.json(createSchedule(body.onboarding));
      },
    },
  },
});
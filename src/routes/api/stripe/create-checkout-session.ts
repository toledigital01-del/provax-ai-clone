import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";

const PLANS: Record<string, { name: string; amount: number }> = {
  essencial: { name: "Essencial PRF", amount: 4990 },
  premium: { name: "Athena Supreme", amount: 9700 },
};

export const Route = createFileRoute("/api/stripe/create-checkout-session")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
          return Response.json(
            { error: "STRIPE_SECRET_KEY não configurada no ambiente." },
            { status: 500 },
          );
        }

        const body = await request.json().catch(() => ({}));
        const planId = body.planId as "essencial" | "premium";
        const userId = body.userId as string | undefined;
        const userEmail = body.userEmail as string | undefined;

        const plan = PLANS[planId];
        if (!plan) {
          return Response.json({ error: "Plano inválido." }, { status: 400 });
        }
        if (!userId || !userEmail) {
          return Response.json(
            { error: "userId e userEmail são obrigatórios." },
            { status: 400 },
          );
        }

        const origin =
          request.headers.get("origin") ||
          `https://${request.headers.get("host") || "provaxai.com.br"}`;

        const stripe = new Stripe(secretKey);

        try {
          const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer_email: userEmail,
            line_items: [
              {
                price_data: {
                  currency: "brl",
                  product_data: { name: plan.name },
                  unit_amount: plan.amount,
                  recurring: { interval: "month" },
                },
                quantity: 1,
              },
            ],
            success_url: `${origin}/planos?success=true`,
            cancel_url: `${origin}/planos?canceled=true`,
            metadata: { userId, planId },
          });

          return Response.json({ url: session.url });
        } catch (err: any) {
          console.error("[stripe] create-checkout-session failed:", err);
          return Response.json(
            { error: err?.message || "Falha ao criar sessão do Stripe." },
            { status: 500 },
          );
        }
      },
    },
  },
});

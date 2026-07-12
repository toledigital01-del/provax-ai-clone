import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        const supabaseUrl =
          process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!secretKey || !webhookSecret) {
          return new Response("Stripe env não configurado.", { status: 500 });
        }
        if (!supabaseUrl || !serviceRoleKey) {
          return new Response("Supabase service role não configurado.", {
            status: 500,
          });
        }

        const signature = request.headers.get("stripe-signature");
        if (!signature) {
          return new Response("Assinatura ausente.", { status: 400 });
        }

        const rawBody = await request.text();
        const stripe = new Stripe(secretKey);

        let event: Stripe.Event;
        try {
          event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            webhookSecret,
          );
        } catch (err: any) {
          console.error("[stripe webhook] invalid signature:", err?.message);
          return new Response(`Webhook Error: ${err?.message}`, { status: 400 });
        }

        const supabase = createClient(supabaseUrl, serviceRoleKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        try {
          switch (event.type) {
            case "checkout.session.completed": {
              const session = event.data.object as Stripe.Checkout.Session;
              const userId = session.metadata?.userId;
              const planId = session.metadata?.planId;
              if (userId && planId) {
                await supabase
                  .from("profiles")
                  .update({
                    plan: planId,
                    stripe_customer_id: session.customer as string | null,
                    stripe_subscription_id: session.subscription as
                      | string
                      | null,
                    subscription_status: "active",
                  })
                  .eq("id", userId);
              }
              break;
            }
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
              const sub = event.data.object as Stripe.Subscription;
              const inactiveStatuses = [
                "canceled",
                "unpaid",
                "past_due",
                "incomplete_expired",
                "paused",
              ];
              if (inactiveStatuses.includes(sub.status)) {
                await supabase
                  .from("profiles")
                  .update({
                    plan: "free",
                    subscription_status: sub.status,
                  })
                  .eq("stripe_customer_id", sub.customer as string);
              } else {
                await supabase
                  .from("profiles")
                  .update({ subscription_status: sub.status })
                  .eq("stripe_customer_id", sub.customer as string);
              }
              break;
            }
            default:
              break;
          }
        } catch (err: any) {
          console.error("[stripe webhook] handler failed:", err);
          return new Response(`Handler error: ${err?.message}`, { status: 500 });
        }

        return Response.json({ received: true });
      },
    },
  },
});

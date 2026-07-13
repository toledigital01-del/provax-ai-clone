import { createFileRoute } from "@tanstack/react-router";

const PLANS = {
  essencial: { name: 'Plano Essencial PRF', amount: 4990 },
  premium:   { name: 'Athena Supreme PRF',  amount: 9700 },
} as const;

export const Route = createFileRoute("/api/stripe/create-checkout-session")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey) {
          return Response.json({ error: 'Stripe não configurado' }, { status: 500 });
        }

        const body = await request.json().catch(() => ({})) as any;
        const { planId, userId, userEmail } = body as {
          planId: string;
          userId: string;
          userEmail: string;
        };

        const plan = PLANS[planId as keyof typeof PLANS];
        if (!plan) {
          return Response.json({ error: 'Plano inválido' }, { status: 400 });
        }

        const origin = request.headers.get('origin') || 'https://provaxai.com.br';

        const params = new URLSearchParams();
        params.set('mode', 'subscription');
        params.set('customer_email', userEmail || '');
        params.set('client_reference_id', userId || '');
        params.set('line_items[0][price_data][currency]', 'brl');
        params.set('line_items[0][price_data][product_data][name]', plan.name);
        params.set('line_items[0][price_data][unit_amount]', plan.amount.toString());
        params.set('line_items[0][price_data][recurring][interval]', 'month');
        params.set('line_items[0][quantity]', '1');
        params.set('metadata[planId]', planId);
        params.set('metadata[userId]', userId || '');
        params.set('subscription_data[metadata][planId]', planId);
        params.set('subscription_data[metadata][userId]', userId || '');
        params.set('success_url', `${origin}/?success=true&plan=${planId}`);
        params.set('cancel_url', `${origin}/?canceled=true`);

        const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        const session = await res.json() as any;
        if (!res.ok) {
          console.error('[stripe/create-checkout-session]', session?.error?.message);
          return Response.json({ error: session?.error?.message || 'Erro Stripe' }, { status: 500 });
        }

        return Response.json({ url: session.url });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = 'https://fkwivsebcbuxvobcpina.supabase.co';

async function verifyStripeSignature(rawBody: string, sigHeader: string, secret: string): Promise<boolean> {
  const pairs = Object.fromEntries(sigHeader.split(',').map(p => { const i = p.indexOf('='); return [p.slice(0, i), p.slice(i + 1)]; }));
  const timestamp = pairs['t'];
  const sig = pairs['v1'];
  if (!timestamp || !sig) return false;

  // Rejeita payloads com mais de 5 minutos
  if (Math.abs(Math.floor(Date.now() / 1000) - parseInt(timestamp)) > 300) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const buf = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${rawBody}`));
  const expected = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');

  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!webhookSecret || !serviceRoleKey) {
          console.error('[stripe/webhook] variáveis de ambiente ausentes');
          return Response.json({ error: 'Webhook não configurado' }, { status: 500 });
        }

        const rawBody = await request.text();
        const sig = request.headers.get('stripe-signature') || '';

        const valid = await verifyStripeSignature(rawBody, sig, webhookSecret);
        if (!valid) {
          console.error('[stripe/webhook] assinatura inválida');
          return Response.json({ error: 'Assinatura inválida' }, { status: 400 });
        }

        const event = JSON.parse(rawBody) as { type: string; data: { object: any } };

        const supabaseAdmin = createClient(SUPABASE_URL, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });

        const customerId = (obj: any): string | null => {
          const c = obj?.customer;
          return typeof c === 'string' ? c : (c?.id ?? null);
        };

        if (event.type === 'checkout.session.completed') {
          const session = event.data.object;
          const userId = session.client_reference_id || session.metadata?.userId;
          const planId  = session.metadata?.planId;
          const custId  = customerId(session);
          const subId   = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

          if (userId && planId) {
            const { error } = await supabaseAdmin.from('profiles').update({
              plan: planId,
              stripe_customer_id: custId,
              stripe_subscription_id: subId,
              subscription_status: 'active',
            }).eq('id', userId);
            if (error) console.error('[stripe/webhook] update profiles:', error.message);
          }
        }

        if (event.type === 'customer.subscription.updated') {
          const sub = event.data.object;
          const cid = customerId(sub);
          const status = sub.status as string;
          if (cid && ['canceled', 'unpaid', 'past_due'].includes(status)) {
            await supabaseAdmin.from('profiles').update({
              plan: 'free',
              subscription_status: status,
            }).eq('stripe_customer_id', cid);
          }
        }

        if (event.type === 'customer.subscription.deleted') {
          const sub = event.data.object;
          const cid = customerId(sub);
          if (cid) {
            await supabaseAdmin.from('profiles').update({
              plan: 'free',
              stripe_subscription_id: null,
              subscription_status: 'canceled',
            }).eq('stripe_customer_id', cid);
          }
        }

        return Response.json({ received: true });
      },
    },
  },
});

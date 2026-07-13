-- Adiciona colunas Stripe na tabela profiles
-- Execute no Supabase → SQL Editor → Run

alter table public.profiles
  add column if not exists stripe_customer_id     text,
  add column if not exists stripe_subscription_id  text,
  add column if not exists subscription_status     text default 'inactive';

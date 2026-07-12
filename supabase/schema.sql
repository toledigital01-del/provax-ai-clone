-- ═══════════════════════════════════════════════════════════
-- ProvaX AI — Schema Supabase
-- Execute este SQL no Supabase → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════

-- ── Extensões ────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Tabela: profiles ─────────────────────────────────────────
-- Dados do aluno vinculados ao auth.users
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  name          text,
  role          text default 'PRF',
  plan          text default 'free' check (plan in ('free', 'essencial', 'premium')),
  hours_per_day integer default 4,
  test_date     date,
  difficulties  text[] default '{}',
  has_done_exam boolean default false,
  language      text default 'Inglês',
  stripe_customer_id     text,
  stripe_subscription_id text,
  subscription_status    text default 'inactive',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── Tabela: progress ─────────────────────────────────────────
create table if not exists public.progress (
  id                          uuid primary key default uuid_generate_v4(),
  user_id                     uuid references public.profiles(id) on delete cascade,
  days_consecutive            integer default 0,
  approval_probability        numeric(5,2) default 40.0,
  accuracy_rate               numeric(5,2) default 0.0,
  total_questions_answered    integer default 0,
  total_correct               integer default 0,
  total_incorrect             integer default 0,
  minutos_hoje                integer default 0,
  minutos_hoje_data           date default current_date,
  syllabus_coverage           numeric(5,2) default 0.0,
  discipline_performance      jsonb default '{}',
  study_streak_history        text[] default '{}',
  approval_history            jsonb default '[]',
  updated_at                  timestamptz default now(),
  unique (user_id)
);

-- ── Tabela: schedules ────────────────────────────────────────
create table if not exists public.schedules (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references public.profiles(id) on delete cascade,
  weekly          jsonb default '[]',
  monthly         jsonb default '[]',
  created_date    text,
  last_calibrated text,
  updated_at      timestamptz default now(),
  unique (user_id)
);

-- ── Tabela: messages ─────────────────────────────────────────
create table if not exists public.messages (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade,
  sender      text check (sender in ('user', 'athena')),
  content     text not null,
  created_at  timestamptz default now()
);

-- ── Tabela: library ──────────────────────────────────────────
create table if not exists public.library (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade,
  title       text not null,
  content     text,
  type        text default 'Anotação',
  file_size   text,
  created_at  timestamptz default now()
);

-- ── Tabela: edital_topics ────────────────────────────────────
create table if not exists public.edital_topics (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade,
  topic_id    text not null,
  studied     boolean default false,
  summary     boolean default false,
  reviewed    boolean default false,
  simulated   boolean default false,
  updated_at  timestamptz default now(),
  unique (user_id, topic_id)
);

-- ── Tabela: completed_tasks ──────────────────────────────────
create table if not exists public.completed_tasks (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade,
  task_id     text not null,
  completed_at timestamptz default now(),
  unique (user_id, task_id)
);

-- ═══════════════════════════════════════════════════════════
-- Row Level Security (RLS) — cada aluno vê só seus dados
-- ═══════════════════════════════════════════════════════════

alter table public.profiles       enable row level security;
alter table public.progress        enable row level security;
alter table public.schedules       enable row level security;
alter table public.messages        enable row level security;
alter table public.library         enable row level security;
alter table public.edital_topics   enable row level security;
alter table public.completed_tasks enable row level security;

-- Policies: usuário só acessa seus próprios dados
create policy "profiles_own"       on public.profiles       for all using (auth.uid() = id);
create policy "progress_own"       on public.progress        for all using (auth.uid() = user_id);
create policy "schedules_own"      on public.schedules       for all using (auth.uid() = user_id);
create policy "messages_own"       on public.messages        for all using (auth.uid() = user_id);
create policy "library_own"        on public.library         for all using (auth.uid() = user_id);
create policy "edital_topics_own"  on public.edital_topics   for all using (auth.uid() = user_id);
create policy "tasks_own"          on public.completed_tasks for all using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
-- Trigger: criar profile automaticamente ao registrar
-- ═══════════════════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');

  insert into public.progress (user_id)
  values (new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── GEOscore Database Schema ────────────────────────────────────────────────
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Audits ───────────────────────────────────────────────────────────────────
create table if not exists audits (
  id              uuid primary key default gen_random_uuid(),
  url             text not null,
  email           text not null,
  keywords        text[],
  score           integer,
  scores          jsonb,                    -- { llm_score, onpage_score, authority_score, total }
  llm_results     jsonb,                    -- LLMResult[]
  onpage_results  jsonb,                    -- OnPageFactor[]
  recommendations jsonb,                    -- Recommendation[]
  tier            text default 'free',      -- free | paid | saas
  status          text default 'pending',   -- pending | running | completed | error
  error_message   text,
  pdf_url         text,
  user_id         uuid references auth.users(id) on delete set null,
  stripe_session_id text,
  created_at      timestamptz default now()
);

-- Index for email rate limiting
create index if not exists audits_email_created_at_idx on audits (email, created_at);
create index if not exists audits_user_id_idx on audits (user_id);

-- ─── Tracked Sites (SaaS) ─────────────────────────────────────────────────────
create table if not exists tracked_sites (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  url             text not null,
  keywords        text[],
  is_competitor   boolean default false,
  created_at      timestamptz default now()
);

create index if not exists tracked_sites_user_id_idx on tracked_sites (user_id);

-- ─── Audit History (SaaS) ────────────────────────────────────────────────────
create table if not exists audit_history (
  id                uuid primary key default gen_random_uuid(),
  tracked_site_id   uuid references tracked_sites(id) on delete cascade not null,
  score             integer not null,
  llm_results       jsonb,
  onpage_results    jsonb,
  recommendations   jsonb,
  created_at        timestamptz default now()
);

create index if not exists audit_history_tracked_site_id_idx on audit_history (tracked_site_id, created_at desc);

-- ─── Subscriptions ────────────────────────────────────────────────────────────
create table if not exists subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid references auth.users(id) on delete cascade not null,
  stripe_customer_id      text,
  stripe_subscription_id  text unique,
  status                  text default 'active',  -- active | cancelled | past_due
  created_at              timestamptz default now()
);

create index if not exists subscriptions_user_id_idx on subscriptions (user_id);
create index if not exists subscriptions_stripe_subscription_id_idx on subscriptions (stripe_subscription_id);

-- ─── Row Level Security ───────────────────────────────────────────────────────

-- Audits: users can read their own audits
alter table audits enable row level security;
create policy "Users can read own audits" on audits
  for select using (auth.uid() = user_id);
create policy "Service role has full access to audits" on audits
  using (true) with check (true);

-- Tracked sites: users can manage their own sites
alter table tracked_sites enable row level security;
create policy "Users can manage own tracked sites" on tracked_sites
  for all using (auth.uid() = user_id);

-- Audit history: users can read their own history
alter table audit_history enable row level security;
create policy "Users can read own audit history" on audit_history
  for select using (
    tracked_site_id in (
      select id from tracked_sites where user_id = auth.uid()
    )
  );

-- Subscriptions: users can read their own subscription
alter table subscriptions enable row level security;
create policy "Users can read own subscription" on subscriptions
  for select using (auth.uid() = user_id);

-- ─── Storage Bucket for PDFs ──────────────────────────────────────────────────
-- Run this in Supabase Dashboard > Storage > New Bucket
-- Bucket name: reports
-- Public: true (for PDF download links)
insert into storage.buckets (id, name, public)
values ('reports', 'reports', true)
on conflict (id) do nothing;

-- Storage policy: anyone can read reports
create policy "Public read access to reports" on storage.objects
  for select using (bucket_id = 'reports');

-- Storage policy: service role can upload reports
create policy "Service role can upload reports" on storage.objects
  for insert with check (bucket_id = 'reports');

-- Whimsiverse Dynamic QR — Supabase schema
-- Run this once in your Supabase project's SQL Editor.

-- 1. Card packs (groups of cards, e.g. "Founders Pack", "Anniversary Drop")
create table if not exists card_packs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- 2. Cards — one row per physical/digital collectible card that gets a QR
create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid references card_packs(id) on delete set null,
  name text not null,                 -- your internal label, e.g. "Aurora — Story 01"
  slug text not null unique,          -- used in the printed URL: /c/<slug>
  redirect_url text not null,         -- where the QR currently sends people — editable anytime
  story_title text,                   -- optional display label
  scan_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Scans — one row per QR scan, for analytics
create table if not exists scans (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  scanned_at timestamptz not null default now(),
  user_agent text,
  referrer text,
  country text
);

create index if not exists idx_scans_card_id on scans(card_id);
create index if not exists idx_cards_pack_id on cards(pack_id);
create index if not exists idx_cards_slug on cards(slug);

-- Auto-update updated_at on cards
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_cards_updated_at on cards;
create trigger trg_cards_updated_at
  before update on cards
  for each row execute function set_updated_at();

-- Row Level Security
alter table card_packs enable row level security;
alter table cards enable row level security;
alter table scans enable row level security;

-- Only authenticated (admin) users can read/write packs & cards.
-- The public redirect route uses the SERVICE ROLE key (bypasses RLS
-- entirely), so anonymous visitors never need direct table access.
create policy "Authenticated can manage packs"
  on card_packs for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated can manage cards"
  on cards for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated can read scans"
  on scans for select
  using (auth.role() = 'authenticated');

-- No insert/update/delete policy on scans for anon or authenticated —
-- scans are only ever written by the server route using the service role key.

-- ── Setup notes ──────────────────────────────────────────────────────
-- 1. After running this, go to Authentication → Users in the Supabase
--    dashboard and manually create your admin account (email + password).
--    Public sign-ups are never exposed in this app, so this is the only
--    account that will ever exist.
-- 2. Optionally, go to Authentication → Providers → Email and disable
--    "Allow new users to sign up" so no one else can ever register.

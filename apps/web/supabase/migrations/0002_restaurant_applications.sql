-- Foodala — Restaurant partner applications (web app)
--
-- Scope: ONLY restaurant partner application submission + admin review.
-- No customer orders, rider applications, or auth are included here.
--
-- This migration is web-app-specific and lives under apps/web/supabase/migrations
-- (the customer app's schema stays in apps/customer-mobile/supabase/migrations).
-- Run it in the Supabase SQL editor, or via `supabase db push` with the CLI.

-- Needed for gen_random_uuid().
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------

create table if not exists restaurant_applications (
  id            uuid primary key default gen_random_uuid(),
  business_name text not null,
  owner_name    text not null,
  phone         text not null,
  email         text not null,
  address       text not null,
  cuisine_type  text not null,
  facebook_page text,
  website       text,
  status        text not null default 'pending'
                  check (status in ('pending', 'approved', 'rejected')),
  admin_notes   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Newest first / pending triage are the common admin queries.
create index if not exists idx_restaurant_applications_status
  on restaurant_applications(status);
create index if not exists idx_restaurant_applications_created_at
  on restaurant_applications(created_at desc);

-- Keep updated_at fresh on every UPDATE (status changes, admin notes).
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_restaurant_applications_updated_at on restaurant_applications;
create trigger trg_restaurant_applications_updated_at
  before update on restaurant_applications
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- The web app talks to Supabase with the public ANON key, so the table needs
-- explicit policies.
--
-- ⚠️  TEMPORARY / NOT PRODUCTION-SAFE ⚠️
-- Real authentication is NOT implemented yet. The public website only needs to
-- INSERT applications; the admin review page needs to SELECT and UPDATE them.
-- Because there is no auth/admin role to gate against, the SELECT and UPDATE
-- policies below are open to the anon role. This means ANYONE with the anon key
-- could read or modify applications (which contain owner contact details).
--
-- MUST be locked down before launch:
--   1. Add Supabase Auth + an admin role/claim (or move reads/updates to a
--      server route using the service_role key, never exposed to the browser).
--   2. Drop the "anon can read/update" policies below and replace them with
--      policies that require the admin role.
--   3. Keep only the public INSERT policy for the application form.
-- ---------------------------------------------------------------------------

alter table restaurant_applications enable row level security;

-- Public application form: anyone may submit an application.
create policy "Public can submit restaurant applications"
  on restaurant_applications for insert
  to anon, authenticated
  with check (true);

-- TEMPORARY: admin review with no auth yet. LOCK DOWN BEFORE LAUNCH (see note).
create policy "TEMP anon can read restaurant applications"
  on restaurant_applications for select
  to anon, authenticated
  using (true);

-- TEMPORARY: admin status/notes updates with no auth yet. LOCK DOWN BEFORE LAUNCH.
create policy "TEMP anon can update restaurant applications"
  on restaurant_applications for update
  to anon, authenticated
  using (true)
  with check (true);

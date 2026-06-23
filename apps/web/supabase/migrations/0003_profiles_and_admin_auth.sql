-- Foodala — Profiles + admin authentication (web app)
--
-- Scope: ADMIN login only. Adds a `profiles` table tied to Supabase Auth users,
-- an `is_admin()` helper, and locks down `restaurant_applications` so that only
-- authenticated admins can read/update them (anon keeps INSERT for the public
-- application form). No public signup, no customer/restaurant/rider accounts.
--
-- Run AFTER 0002_restaurant_applications.sql. Supabase SQL editor or
-- `supabase db push`.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles — one row per auth.users user, carrying their app role.
-- ---------------------------------------------------------------------------

create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  role       text not null default 'user'
               check (role in ('admin', 'restaurant_owner', 'rider', 'customer', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on profiles(role);

-- Keep updated_at fresh on UPDATE. (set_updated_at() is also defined in 0002;
-- redefined here so this migration is safe to run on its own.)
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- is_admin() — true when the current auth user has role 'admin'.
--
-- SECURITY DEFINER + a fixed search_path so it can be called from RLS policies
-- on OTHER tables (e.g. restaurant_applications) without recursing into the
-- profiles RLS policies, and regardless of the caller's row visibility.
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- profiles RLS
--
-- A signed-in user may read their OWN profile (the web app reads it to check
-- the admin role after login). Profiles are created/edited manually for now
-- (Supabase dashboard / SQL editor, which bypasses RLS) — there is no public
-- signup and the app never inserts or updates profiles.
-- ---------------------------------------------------------------------------

alter table profiles enable row level security;

drop policy if exists "Users can read own profile" on profiles;
create policy "Users can read own profile"
  on profiles for select
  to authenticated
  using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Lock down restaurant_applications (replaces the TEMP policies from 0002).
--
--   • anon  → INSERT only (public application form; policy kept from 0002).
--   • admin → SELECT + UPDATE (review queue).
-- ---------------------------------------------------------------------------

drop policy if exists "TEMP anon can read restaurant applications" on restaurant_applications;
drop policy if exists "TEMP anon can update restaurant applications" on restaurant_applications;

drop policy if exists "Admins can read restaurant applications" on restaurant_applications;
create policy "Admins can read restaurant applications"
  on restaurant_applications for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update restaurant applications" on restaurant_applications;
create policy "Admins can update restaurant applications"
  on restaurant_applications for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- The public INSERT policy ("Public can submit restaurant applications") from
-- 0002 is intentionally left in place so the apply form keeps working.

-- ---------------------------------------------------------------------------
-- Manual admin setup (no public signup):
--   1. Supabase dashboard → Authentication → Users → Add user (email + password).
--   2. Copy that user's UID.
--   3. Run, replacing the placeholders:
--        insert into public.profiles (id, email, role)
--        values ('<user-uid>', '<user-email>', 'admin');
--   The user can now log in at /login and reach /admin.
-- ---------------------------------------------------------------------------

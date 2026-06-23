-- Foodala — Phase 1 schema (customer app)
-- Run this in the Supabase SQL editor, or via `supabase db push` with the CLI.

-- Needed for gen_random_uuid().
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists restaurants (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  image_url   text,
  address     text,
  city        text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists menu_categories (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name          text not null,
  sort_order    int not null default 0
);

create table if not exists menu_items (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  category_id   uuid references menu_categories(id) on delete set null,
  name          text not null,
  description   text,
  price         numeric(10, 2) not null check (price >= 0),
  image_url     text,
  is_available  boolean not null default true
);

create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  restaurant_id    uuid not null references restaurants(id),
  customer_name    text not null,
  customer_phone   text not null,
  delivery_address text not null,
  delivery_notes   text,
  subtotal         numeric(10, 2) not null,
  delivery_fee     numeric(10, 2) not null default 50,
  total            numeric(10, 2) not null,
  payment_method   text not null default 'cash_on_delivery',
  status           text not null default 'pending',
  created_at       timestamptz not null default now()
);

create table if not exists order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id),
  item_name    text not null,
  quantity     int not null check (quantity > 0),
  unit_price   numeric(10, 2) not null,
  total_price  numeric(10, 2) not null
);

-- Helpful indexes for the queries the app runs.
create index if not exists idx_menu_categories_restaurant on menu_categories(restaurant_id);
create index if not exists idx_menu_items_restaurant on menu_items(restaurant_id);
create index if not exists idx_menu_items_category on menu_items(category_id);
create index if not exists idx_order_items_order on order_items(order_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- The customer app talks to Supabase with the public ANON key, so every table
-- needs explicit policies. These Phase-1 policies are intentionally permissive
-- (no auth yet): the public may read the catalog and create orders.
--
-- NOTE: orders/order_items are world-readable here so that INSERT ... RETURNING
-- works for the anon role. Before launch, lock these down (e.g. tie orders to an
-- authenticated user and remove the public SELECT policies).
-- ---------------------------------------------------------------------------

alter table restaurants     enable row level security;
alter table menu_categories enable row level security;
alter table menu_items      enable row level security;
alter table orders          enable row level security;
alter table order_items     enable row level security;

-- Catalog: public read-only.
create policy "Public can read restaurants"
  on restaurants for select using (true);

create policy "Public can read menu categories"
  on menu_categories for select using (true);

create policy "Public can read menu items"
  on menu_items for select using (true);

-- Orders: public can create and read back (MVP only — see note above).
create policy "Public can create orders"
  on orders for insert with check (true);

create policy "Public can read orders"
  on orders for select using (true);

create policy "Public can create order items"
  on order_items for insert with check (true);

create policy "Public can read order items"
  on order_items for select using (true);

-- ============================================================
-- MenuLux — Supabase Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- --------------------------------------------------------
-- restaurants
-- --------------------------------------------------------
create table if not exists public.restaurants (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  slug        text not null unique,
  logo_url    text,
  banner_url  text,
  theme       text not null default 'gold',
  created_at  timestamptz not null default now()
);

alter table public.restaurants enable row level security;

create policy "Users manage own restaurant"
  on public.restaurants for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Public read for slug lookup (public menu pages)
create policy "Public can read restaurants by slug"
  on public.restaurants for select
  using (true);

-- --------------------------------------------------------
-- menu_categories
-- --------------------------------------------------------
create table if not exists public.menu_categories (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name          text not null,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.menu_categories enable row level security;

create policy "Owner manages categories"
  on public.menu_categories for all
  using  (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()));

create policy "Public can read categories"
  on public.menu_categories for select
  using (true);

-- --------------------------------------------------------
-- menu_items
-- --------------------------------------------------------
create table if not exists public.menu_items (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references public.menu_categories(id) on delete cascade,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name          text not null,
  description   text,
  price         numeric(10,2) not null default 0,
  image_url     text,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.menu_items enable row level security;

create policy "Owner manages items"
  on public.menu_items for all
  using  (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()));

create policy "Public can read items"
  on public.menu_items for select
  using (true);

-- --------------------------------------------------------
-- videos
-- --------------------------------------------------------
create table if not exists public.videos (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  menu_item_id  uuid references public.menu_items(id) on delete set null,
  title         text not null,
  video_url     text not null,
  thumbnail_url text,
  created_at    timestamptz not null default now()
);

alter table public.videos enable row level security;

create policy "Owner manages videos"
  on public.videos for all
  using  (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()));

create policy "Public can read videos"
  on public.videos for select
  using (true);

-- --------------------------------------------------------
-- Supabase Storage buckets (run separately or via dashboard)
-- --------------------------------------------------------
-- insert into storage.buckets (id, name, public) values ('restaurant-assets', 'restaurant-assets', true);
-- insert into storage.buckets (id, name, public) values ('menu-items', 'menu-items', true);

-- Storage policies for restaurant-assets
-- create policy "Authenticated users upload assets"
--   on storage.objects for insert
--   with check (bucket_id = 'restaurant-assets' and auth.role() = 'authenticated');
-- create policy "Public read restaurant assets"
--   on storage.objects for select using (bucket_id = 'restaurant-assets');

-- Storage policies for menu-items
-- create policy "Authenticated users upload menu images"
--   on storage.objects for insert
--   with check (bucket_id = 'menu-items' and auth.role() = 'authenticated');
-- create policy "Public read menu item images"
--   on storage.objects for select using (bucket_id = 'menu-items');

-- SoftBlog: posts table + RLS
-- Run this in the Supabase SQL editor (or via migrations) for the project
-- that matches your NEXT_PUBLIC_SUPABASE_URL.

create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  content text not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_created_at_idx
  on public.posts (published, created_at desc);

create index if not exists posts_user_created_at_idx
  on public.posts (user_id, created_at desc);

-- Keep updated_at fresh on row updates
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

-- Prevent user_id spoofing and always stamp author from the authenticated user
create or replace function public.posts_set_author()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if new.user_id is null then
    new.user_id = auth.uid();
  end if;

  if new.user_id <> auth.uid() then
    raise exception 'user_id does not match authenticated user';
  end if;

  return new;
end;
$$;

drop trigger if exists posts_set_author on public.posts;
create trigger posts_set_author
before insert on public.posts
for each row execute function public.posts_set_author();

alter table public.posts enable row level security;

-- Public can read published posts; authors can also read their drafts
drop policy if exists "posts_select_public_or_owner" on public.posts;
create policy "posts_select_public_or_owner"
on public.posts
for select
to public
using (published = true or auth.uid() = user_id);

-- Authenticated users can create posts (author is enforced by trigger)
drop policy if exists "posts_insert_authenticated" on public.posts;
create policy "posts_insert_authenticated"
on public.posts
for insert
to authenticated
with check (true);

-- Authors can update/delete their own posts
drop policy if exists "posts_update_owner" on public.posts;
create policy "posts_update_owner"
on public.posts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "posts_delete_owner" on public.posts;
create policy "posts_delete_owner"
on public.posts
for delete
to authenticated
using (auth.uid() = user_id);

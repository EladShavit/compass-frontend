-- Budgets table: one row per user per category per month
-- category_name stores the raw category name from the categories table
create table if not exists budgets (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  category_name text not null,
  monthly_limit numeric(12,2) not null check (monthly_limit > 0),
  created_at    timestamptz not null default now(),
  unique(user_id, category_name)
);

-- RLS: users can only see and modify their own budgets
alter table budgets enable row level security;

create policy "budgets_select_own" on budgets
  for select using (auth.uid() = user_id);

create policy "budgets_insert_own" on budgets
  for insert with check (auth.uid() = user_id);

create policy "budgets_update_own" on budgets
  for update using (auth.uid() = user_id);

create policy "budgets_delete_own" on budgets
  for delete using (auth.uid() = user_id);

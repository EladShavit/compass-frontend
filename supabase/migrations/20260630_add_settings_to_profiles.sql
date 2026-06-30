-- Add notification preferences and language preference to profiles
alter table profiles
  add column if not exists notify_critical boolean not null default true,
  add column if not exists notify_warning  boolean not null default true,
  add column if not exists preferred_language text not null default 'en';

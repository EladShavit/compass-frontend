-- Add onboarding_complete flag to profiles.
-- Default true so existing users are NOT redirected to onboarding.
-- New users get onboarding_complete = false set explicitly by the RegisterPage after signup.
alter table profiles add column if not exists onboarding_complete boolean not null default true;

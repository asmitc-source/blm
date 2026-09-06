-- Align lead + workspace columns with the app, and add a 7-day trial clock.
alter table leads add column if not exists role text;
alter table leads add column if not exists source text;
alter table leads add column if not exists payload text;

alter table workspaces add column if not exists name text;
alter table workspaces add column if not exists email text;
alter table workspaces add column if not exists company text;
alter table workspaces add column if not exists role text;
alter table workspaces add column if not exists locations_count text;
alter table workspaces add column if not exists plan text;
alter table workspaces add column if not exists trial_started_at timestamptz;
alter table workspaces add column if not exists trial_ends_at timestamptz;

update workspaces
set
  plan = coalesce(plan, 'trial'),
  trial_started_at = coalesce(trial_started_at, now()),
  trial_ends_at = coalesce(trial_ends_at, now() + interval '7 days');

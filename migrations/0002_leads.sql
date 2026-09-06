-- Public lead capture (signup, contact, demo, audit) plus signed-in workspaces.
create table if not exists leads (
  id text primary key,
  kind text not null,
  email text not null,
  name text,
  company text,
  locations text,
  message text,
  created_at timestamptz not null default now()
);
create index if not exists leads_email_idx on leads (email);
create index if not exists leads_kind_idx on leads (kind);

create table if not exists workspaces (
  user_id text primary key,
  brand text,
  locations integer not null default 1,
  notes text,
  updated_at timestamptz not null default now()
);

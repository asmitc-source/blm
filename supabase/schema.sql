-- Run this once in the Supabase SQL editor (SQL → New query).
-- It creates the CMS tables the BLM desk writes to.

create table if not exists cms_admins (
  id text primary key,
  username text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists cms_sessions (
  id text primary key,
  admin_id text not null references cms_admins(id) on delete cascade,
  token text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists cms_sessions_token_idx on cms_sessions (token);

create table if not exists cms_articles (
  id text primary key,
  slug text unique not null,
  title text not null,
  answer text not null default '',
  description text not null default '',
  body_html text not null default '',
  author text not null default 'BLM Editorial',
  tags text not null default '',
  kind text not null default 'article',
  status text not null default 'draft',
  date text not null,
  minutes integer not null default 6,
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists cms_articles_status_idx on cms_articles (status);
create index if not exists cms_articles_kind_idx on cms_articles (kind);

create table if not exists cms_faqs (
  id text primary key,
  question text not null,
  answer text not null,
  page text not null default 'home',
  sort integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists cms_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table cms_admins enable row level security;
alter table cms_sessions enable row level security;
alter table cms_articles enable row level security;
alter table cms_faqs enable row level security;
alter table cms_settings enable row level security;

drop policy if exists "public read published articles" on cms_articles;
create policy "public read published articles"
  on cms_articles for select
  using (status = 'published');

drop policy if exists "public read faqs" on cms_faqs;
create policy "public read faqs"
  on cms_faqs for select
  using (true);

drop policy if exists "public read settings" on cms_settings;
create policy "public read settings"
  on cms_settings for select
  using (true);

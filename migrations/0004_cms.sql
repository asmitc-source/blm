-- CMS: admin desk, articles, FAQs, and site copy. Works in PGLite and Postgres.
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
create index if not exists cms_sessions_admin_idx on cms_sessions (admin_id);

create table if not exists cms_articles (
  id text primary key,
  slug text unique not null,
  title text not null,
  answer text not null default '',
  description text not null default '',
  meta_title text not null default '',
  canonical_url text not null default '',
  published_at text not null default '',
  category text not null default '',
  cover_alt text not null default '',
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
create index if not exists cms_articles_date_idx on cms_articles (date);

create table if not exists cms_faqs (
  id text primary key,
  question text not null,
  answer text not null,
  page text not null default 'home',
  sort integer not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists cms_faqs_page_idx on cms_faqs (page);

create table if not exists cms_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table cms_articles add column if not exists meta_title text not null default '';
alter table cms_articles add column if not exists canonical_url text not null default '';
alter table cms_articles add column if not exists published_at text not null default '';
alter table cms_articles add column if not exists category text not null default '';
alter table cms_articles add column if not exists cover_alt text not null default '';

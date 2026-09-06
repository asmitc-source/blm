-- Contact form submissions + newsletter subscribers.
-- Applied on deploy via db:migrate when DATABASE_URL is set (and by PGLite locally).
-- For Supabase RLS policies, also run supabase/contact_newsletter.sql in the SQL editor.

create table if not exists contact_submissions (
  id text primary key,
  name text not null,
  email text not null,
  company text,
  message text not null,
  user_agent text,
  source text not null default 'homepage',
  created_at timestamptz not null default now()
);
create index if not exists contact_submissions_email_idx on contact_submissions (email);
create index if not exists contact_submissions_created_idx on contact_submissions (created_at desc);

create table if not exists newsletter_subscribers (
  id text primary key,
  email text not null unique,
  name text,
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  source text not null default 'homepage',
  unsubscribe_token text not null unique,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);
create index if not exists newsletter_subscribers_status_idx on newsletter_subscribers (status);

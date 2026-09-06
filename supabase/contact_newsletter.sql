-- Optional: run in Supabase SQL editor after migrations/0005_contact_newsletter.sql.
-- Enables RLS so anon can insert/subscribe but cannot read rows publicly.
-- Service role / DATABASE_URL owner bypasses RLS for admin reads.

alter table contact_submissions enable row level security;
alter table newsletter_subscribers enable row level security;

drop policy if exists "anon insert contact" on contact_submissions;
create policy "anon insert contact"
  on contact_submissions for insert to anon, authenticated with check (true);

drop policy if exists "anon insert newsletter" on newsletter_subscribers;
create policy "anon insert newsletter"
  on newsletter_subscribers for insert to anon, authenticated with check (true);

drop policy if exists "anon update newsletter status" on newsletter_subscribers;
create policy "anon update newsletter status"
  on newsletter_subscribers for update to anon, authenticated
  using (true)
  with check (status in ('active', 'unsubscribed'));

-- Inbox columns (also in migrations/0006_inbox_status.sql). Safe to re-run.
alter table contact_submissions
  add column if not exists status text not null default 'new';
alter table contact_submissions
  add column if not exists replied_at timestamptz;
alter table contact_submissions
  add column if not exists reply_note text;

do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'contact_submissions_status_check'
  ) then
    alter table contact_submissions
      add constraint contact_submissions_status_check
      check (status in ('new', 'read', 'closed'));
  end if;
end $$;

create index if not exists contact_submissions_status_idx on contact_submissions (status);

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

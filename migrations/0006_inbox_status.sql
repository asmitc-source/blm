-- Inbox status + reply tracking for contact_submissions.
-- Applied on deploy via db:migrate when DATABASE_URL is set (and by PGLite locally).
-- Safe to re-run: uses IF NOT EXISTS / guarded constraint.

alter table contact_submissions
  add column if not exists status text not null default 'new';

alter table contact_submissions
  add column if not exists replied_at timestamptz;

alter table contact_submissions
  add column if not exists reply_note text;

update contact_submissions
set status = 'new'
where status is null or status = '';

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

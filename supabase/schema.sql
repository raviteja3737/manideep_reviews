-- ============================================================
-- A Reader's First Review — feedback table
-- Run once in the Supabase Dashboard → SQL Editor, then you're done.
-- ============================================================

create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),

  -- A: rating of the review (1–5 stars)
  review_rating smallint not null
    check (review_rating between 1 and 5),

  -- B: reactions (multiple allowed); stored as a JSON array of strings
  reactions jsonb not null default '[]'::jsonb
    check (jsonb_typeof(reactions) = 'array'),

  -- C: rating of the writing (1–10 slider)
  writing_rating smallint not null
    check (writing_rating between 1 and 10),

  -- D: honest feedback
  feedback text not null
    check (char_length(btrim(feedback)) between 1 and 2000),

  -- E: reading status
  has_read_zidd text not null
    check (has_read_zidd in ('read', 'curious', 'writing')),

  -- F: optional name (null → shown as "Anonymous")
  name text
    check (name is null or char_length(btrim(name)) between 1 and 80)
);

-- The table is reachable with the public anon key, so RLS is mandatory.
alter table public.feedback enable row level security;

-- Anyone may read submitted feedback (the community list shows it).
create policy "anyone can read feedback"
  on public.feedback
  for select
  to anon, authenticated
  using (true);

-- Anyone may submit new feedback.
create policy "anyone can submit feedback"
  on public.feedback
  for insert
  to anon, authenticated
  with check (true);

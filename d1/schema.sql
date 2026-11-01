-- ============================================================
-- A Reader's First Review — feedback table (Cloudflare D1 / SQLite)
-- Run once against the database named in wrangler.jsonc:
--   npx wrangler d1 execute manideep-reviews --remote --file=d1/schema.sql
-- (locally: same command with --local)
-- ============================================================

create table if not exists feedback (
  id integer primary key autoincrement,

  -- set by the API worker (ISO 8601 UTC) so any client can parse it
  created_at text not null,

  -- A: rating of the review (1–5 stars)
  review_rating integer not null
    check (review_rating between 1 and 5),

  -- B: reactions (multiple allowed); JSON array of emoji strings
  reactions text not null default '[]'
    check (json_valid(reactions)),

  -- C: rating of the writing (1–10 slider)
  writing_rating integer not null
    check (writing_rating between 1 and 10),

  -- D: honest feedback
  feedback text not null
    check (length(feedback) between 1 and 2000),

  -- E: reading status
  has_read_zidd text not null
    check (has_read_zidd in ('read', 'curious', 'writing')),

  -- F: optional name (null → shown as "Anonymous")
  name text
    check (name is null or length(name) between 1 and 80)
);

create index if not exists idx_feedback_created_at
  on feedback (created_at);

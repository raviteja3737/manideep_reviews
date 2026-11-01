# A Reader's First Review — Zidd

A one-page, editorial reading journal for Manideep Polepalli's first-ever book
review (book: **Zidd**). The review is the hero; readers can leave honest
feedback at the bottom, stored in Supabase, with a live community list and a
real average rating. No fake data, anywhere.

Built with Next.js (App Router, static export), Tailwind CSS 4 and TypeScript.
Deployed on Cloudflare Workers (static assets).

---

## 1. Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

The page renders without Supabase keys — you'll see a quiet notice where the
form is. Add keys to make the form + community list live.

## 2. Supabase setup (one-time, free)

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine).
2. Open **SQL Editor** in the dashboard, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the
   `feedback` table with validation checks and row-level security (anyone can
   read + insert; nothing else).
3. Open **Settings → API** and copy the **Project URL** and the **anon public
   key** (never the `service_role` key — RLS is what makes the anon key safe).
4. Create `.env.local` in the project root (or copy `.env.example`):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```

Note: `NEXT_PUBLIC_*` variables are read **at build time**. If you build on
Cloudflare (repo-connected deploys), set these as build environment variables
in the Cloudflare dashboard too.

## 3. Deploying to Cloudflare

You have two options; both serve `./out` (the static build) from Workers.

### Option A — connect this GitHub repo (recommended, auto-deploys on push)

1. In the Cloudflare dashboard → **Workers & Pages → Create → Import an
   existing Git repository**.
2. Connect GitHub and pick `raviteja3737/manideep_reviews`.
3. Build settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Root directory: `/`
4. **Settings → Variables** (build): add the two `NEXT_PUBLIC_SUPABASE_*`
   variables.
5. Deploy. Every push to the repo now deploys automatically.

### Option B — deploy straight from your machine

```powershell
# credentials live in .env.cloudflare (gitignored, never committed)
Get-Content .env.cloudflare | ForEach-Object { $_ } # or use autoenv/direnv
$env:CLOUDFLARE_API_TOKEN = "<your token>"
$env:CLOUDFLARE_ACCOUNT_ID = "a2f35894537252e4a1a0adcb6de8a8d2"

npm run build
npx wrangler deploy
```

## 4. Notes & security

- The Supabase **anon key is public by design** — the table is protected by
  RLS (read + insert only, with column checks). Never put the `service_role`
  key in frontend code or env files.
- `wrangler.jsonc` is preconfigured: `npm run build` then `npx wrangler
  deploy` ships `./out` as a static-asset Worker.
- The R2 credentials in your Cloudflare account are **not needed** for this
  site — feedback lives in Supabase.
- The Cloudflare token is an **account-scoped API token** (`cfat_…`): it
  verifies at `/accounts/{account_id}/tokens/verify` (this project's token was
  verified **active** on 2026-11-01), and it must be used together with
  `CLOUDFLARE_ACCOUNT_ID`. It was shared over chat; rotate it when convenient.

## 5. Repo layout

```
app/
  layout.tsx            fonts (Playfair Display + Inter), metadata
  page.tsx              hero + verbatim review + personal note
  globals.css           paper/ink tokens, journal styling
  components/
    FeedbackSection.tsx the form: states, validation, submit
    StarRatingInput.tsx 1–5 accessible star radios
    ReactionChips.tsx   multi-select reaction checkboxes
    WritingScale.tsx    1–10 slider with live value
    CommunityFeedback.tsx  community list + real average + count
    StarIcon.tsx        the one drawn icon on the site
  lib/feedback.ts       Supabase client, types, constants, validation consts
supabase/schema.sql     the database, one SQL script
docs/verbatim-copy.md   every string of copy, verbatim — the drift guard
wrangler.jsonc          Cloudflare Workers static-asset config
```

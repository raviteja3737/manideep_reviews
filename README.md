# A Reader's First Review — Zidd

A one-page, editorial reading journal for Manideep Polepalli's first-ever book
review (book: **Zidd**). The review is the hero; readers can leave honest
feedback at the bottom, with a live community list and a real average rating.
No fake data, anywhere.

Built with Next.js (App Router, static export), Tailwind CSS 4 and TypeScript.
Everything runs on **Cloudflare**: the page is served as Workers static assets,
and feedback is stored in **Cloudflare D1** behind a tiny Worker API at
`/api/feedback` — no database keys in the browser at all.

---

## 1. Local development (full stack)

```bash
npm install

# create the local D1 database and apply the schema (one-time per machine)
npx wrangler d1 execute manideep-reviews --local --file=d1/schema.sql

# build the static page, then run the whole thing (page + API + local D1)
npm run build
npx wrangler dev
```

Open http://localhost:8787. The form and the community list are fully live
against a local database — nothing leaves your machine.

(`npm run dev` renders the page too, but `/api/feedback` only exists under
`wrangler dev`, so use that for testing the form.)

## 2. Cloudflare setup (one-time)

1. Create the database:

   ```bash
   npx wrangler d1 create manideep-reviews
   ```

   …or in the dashboard: **Workers & Pages → D1 SQL Database → Create**.
   Copy its `database_id` into [`wrangler.jsonc`](wrangler.jsonc) (replace the
   placeholder `00000000-…`).

2. Apply the schema to the real database:

   ```bash
   npx wrangler d1 execute manideep-reviews --remote --file=d1/schema.sql
   ```

   (needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` — see
   `.env.cloudflare`; or paste `d1/schema.sql` into the D1 dashboard console.)

## 3. Deploying

### Option A — connect this GitHub repo (recommended, auto-deploys on push)

1. Cloudflare dashboard → **Workers & Pages → Create → Import an existing
   Git repository**.
2. Connect GitHub and pick `raviteja3737/manideep_reviews`.
3. Build settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Root directory: `/`
4. Deploy. Every push to the repo now deploys automatically.

No environment variables are needed — there are no keys to configure.

### Option B — deploy straight from your machine

```powershell
# credentials live in .env.cloudflare (gitignored, never committed)
$env:CLOUDFLARE_API_TOKEN = (Get-Content .env.cloudflare | Select-String '^CLOUDFLARE_API_TOKEN=').ToString().Split('=')[1]
$env:CLOUDFLARE_ACCOUNT_ID = (Get-Content .env.cloudflare | Select-String '^CLOUDFLARE_ACCOUNT_ID=').ToString().Split('=')[1]

npm run build
npx wrangler deploy
```

## 4. Notes & security

- The browser never sees a database credential. The form posts to the
  same-origin `/api/feedback` Worker, which validates every field (mirroring
  the D1 table's own `CHECK` constraints) before inserting.
- Get- and set-side checks agree: server validation, SQL checks, and the
  form's own validation all enforce the same limits (stars 1–5, writing 1–10,
  ≤ 2000 chars of feedback, ≤ 80 chars of name, one of 6 reactions).
- The R2 credentials in your Cloudflare account are **not needed** for this
  site — feedback lives in D1.
- The Cloudflare token is an **account-scoped API token** (`cfat_…`): it
  verifies at `/accounts/{account_id}/tokens/verify` (verified **active** on
  2026-11-01) and must be used together with `CLOUDFLARE_ACCOUNT_ID`. It was
  shared over chat; rotate it when convenient.
- If spam ever shows up, Cloudflare **Turnstile** can be added to the form
  with a few lines — not wired up for now.

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
  lib/feedback.ts       same-origin API client, types, constants
worker/index.js         /api/feedback: GET list+stats, POST validated insert
d1/schema.sql           the database, one SQL script
docs/verbatim-copy.md   every string of copy, verbatim — the drift guard
wrangler.jsonc          Worker config: static assets + D1 binding
```

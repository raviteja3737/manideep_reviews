// A Reader's First Review — feedback API, running on Cloudflare Workers.
// Same-origin as the static page: GET  /api/feedback → list + real average + count
//                             POST /api/feedback → validated insert into D1
// Everything else falls through to the static assets (the exported Next.js page).

const VALID_READ_STATUS = new Set(["read", "curious", "writing"]);
const VALID_REACTIONS = new Set([
  "😂", "❤️", "👀", "🤯", "📖", "✍️",
]);

const json = (data, status = 200) =>
  Response.json(data, { status, headers: { "cache-control": "no-store" } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/feedback") {
      if (request.method === "POST") return handleInsert(request, env);
      if (request.method === "GET") return handleList(env);
      return json({ error: "Method not allowed" }, 405);
    }

    return env.ASSETS.fetch(request).then((response) => {
      if (response.status !== 404) return response;
      // Unknown path → the exported 404 page, with a real 404 status.
      return env.ASSETS
        .fetch(new URL("/404.html", "https://assets.invalid"))
        .then((notFound) =>
          new Response(notFound.body, {
            status: 404,
            headers: { "content-type": "text/html; charset=utf-8" },
          })
        );
    });
  },
};

async function handleList(env) {
  const { results } = await env.DB.prepare(
    `SELECT id, created_at, review_rating, reactions, writing_rating,
            feedback, has_read_zidd, name
       FROM feedback
      ORDER BY created_at ASC, id ASC
      LIMIT 200`
  ).all();

  // The average and total count are computed over the WHOLE table — not just
  // the fetched window — so the numbers stay exact as entries accumulate.
  const stats = await env.DB.prepare(
    "SELECT COUNT(*) AS n, AVG(review_rating) AS avg_rating FROM feedback"
  ).first();

  const rows = (results ?? []).map((row) => ({
    ...row,
    reactions: safeParseReactions(row.reactions),
  }));

  return json({
    rows,
    count: stats?.n ?? 0,
    average: typeof stats?.avg_rating === "number" ? stats.avg_rating : null,
  });
}

async function handleInsert(request, env) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return json({ error: "Send the feedback as application/json." }, 415);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "The request body isn't valid JSON." }, 400);
  }

  // ── validate, mirroring the database's own checks ──
  const issues = [];

  const reviewRating = Number(body.review_rating);
  if (!Number.isInteger(reviewRating) || reviewRating < 1 || reviewRating > 5) {
    issues.push("Pick a star rating for the review — how did it land?");
  }

  const rawReactions = Array.isArray(body.reactions) ? body.reactions : [];
  const reactions = [...new Set(rawReactions.filter((r) => typeof r === "string"))];
  if (rawReactions.length !== reactions.length || reactions.some((r) => !VALID_REACTIONS.has(r))) {
    issues.push("That reaction combination isn't available — try again.");
  }

  const writingRating = Number(body.writing_rating);
  if (!Number.isInteger(writingRating) || writingRating < 1 || writingRating > 10) {
    issues.push("Set the writing rating between 1 and 10.");
  }

  const feedback =
    typeof body.feedback === "string" ? body.feedback.trim() : "";
  if (feedback.length < 1) {
    issues.push("Write a line or two of honest feedback — even one sentence helps.");
  } else if (feedback.length > 2000) {
    issues.push("That's a lot of heart — trim it under 2000 characters.");
  }

  const readStatus = body.has_read_zidd;
  if (!VALID_READ_STATUS.has(readStatus)) {
    issues.push("Choose one answer for “Have you read Zidd?”.");
  }

  const rawName = typeof body.name === "string" ? body.name.trim() : "";
  if (rawName.length > 80) {
    issues.push("The name field can hold up to 80 characters.");
  }
  const name = rawName.length > 0 ? rawName : null;

  if (issues.length > 0) {
    return json({ error: "The feedback didn't pass validation.", issues }, 400);
  }

  // ── insert ──
  await env.DB.prepare(
    `INSERT INTO feedback
         (created_at, review_rating, reactions, writing_rating, feedback, has_read_zidd, name)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      new Date().toISOString(),
      reviewRating,
      JSON.stringify(reactions),
      writingRating,
      feedback,
      readStatus,
      name
    )
    .run();

  return json({ ok: true }, 201);
}

function safeParseReactions(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Feedback storage client. All persistence goes through the same-origin
// Worker API (/api/feedback, see worker/index.js) which writes to Cloudflare
// D1 — no database credentials ever reach the browser.

export type ReadStatus = "read" | "curious" | "writing";

export interface FeedbackRow {
  id: number;
  created_at: string;
  review_rating: number;
  reactions: string[];
  writing_rating: number;
  feedback: string;
  has_read_zidd: string;
  name: string | null;
}

export interface FeedbackDraft {
  review_rating: number;
  reactions: string[];
  writing_rating: number;
  feedback: string;
  has_read_zidd: ReadStatus;
  name: string | null;
}

export const REACTIONS = [
  { emoji: "😂", label: "Made me laugh" },
  { emoji: "❤️", label: "Felt relatable" },
  { emoji: "👀", label: "Made me curious about the book" },
  { emoji: "🤯", label: "Loved the chaos" },
  { emoji: "📖", label: "Made me want to read Zidd" },
  { emoji: "✍️", label: "Enjoyed the writing style" },
] as const;

export const READ_STATUS_OPTIONS: ReadonlyArray<{
  value: ReadStatus;
  label: string;
}> = [
  { value: "read", label: "Yes, I've read it." },
  { value: "curious", label: "Not yet, but your review made me curious." },
  { value: "writing", label: "No, I'm just here to review your writing." },
];

export interface FeedbackList {
  rows: FeedbackRow[];
  count: number;
  /** Exact average over the whole table, computed by the API. */
  average: number | null;
}

export async function fetchFeedback(): Promise<FeedbackList> {
  const res = await fetch("/api/feedback");
  if (!res.ok) {
    throw new Error(`Feedback request failed (${res.status}).`);
  }
  return (await res.json()) as FeedbackList;
}

export async function submitFeedback(draft: FeedbackDraft): Promise<void> {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      review_rating: draft.review_rating,
      reactions: draft.reactions,
      writing_rating: draft.writing_rating,
      feedback: draft.feedback.trim(),
      has_read_zidd: draft.has_read_zidd,
      name: draft.name != null && draft.name.trim().length > 0 ? draft.name.trim() : null,
    }),
  });
  if (res.ok) return;

  let detail = "";
  try {
    const data = (await res.json()) as { error?: unknown; issues?: unknown };
    if (Array.isArray(data.issues) && data.issues.length > 0) {
      detail = data.issues.filter((i) => typeof i === "string").join(" ");
    } else if (typeof data.error === "string") {
      detail = data.error;
    }
  } catch {}

  throw new Error(detail || "That didn't go through — give it another try in a moment.");
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

import { createClient } from "@supabase/supabase-js";

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabaseConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR-PROJECT-REF") &&
  SUPABASE_ANON_KEY.length >= 40 &&
  !SUPABASE_ANON_KEY.startsWith("YOUR-");

export const supabase = supabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

export async function fetchFeedback(limit = 200): Promise<FeedbackRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("feedback")
    .select("id, created_at, review_rating, reactions, writing_rating, feedback, has_read_zidd, name")
    // Chronological: the list reads as one thread in time (spec's wording).
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as FeedbackRow[];
}

export async function submitFeedback(draft: FeedbackDraft): Promise<void> {
  if (!supabase) throw new Error("Feedback storage is not configured.");
  const name = draft.name?.trim() ?? "";
  const { error } = await supabase.from("feedback").insert({
    review_rating: draft.review_rating,
    reactions: draft.reactions,
    writing_rating: draft.writing_rating,
    feedback: draft.feedback.trim(),
    has_read_zidd: draft.has_read_zidd,
    name: name.length > 0 ? name : null,
  });
  if (error) throw error;
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

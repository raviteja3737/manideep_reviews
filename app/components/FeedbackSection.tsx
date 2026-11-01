"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  READ_STATUS_OPTIONS,
  fetchFeedback,
  submitFeedback,
  type FeedbackRow,
  type ReadStatus,
} from "@/app/lib/feedback";
import StarRatingInput from "./StarRatingInput";
import ReactionChips from "./ReactionChips";
import WritingScale from "./WritingScale";
import CommunityFeedback from "./CommunityFeedback";

type ListStatus = "loading" | "ready" | "error";
type SubmitState = "idle" | "submitting" | "success" | "error";

const questionClass =
  "block font-display text-xl font-medium tracking-[-0.01em] text-ink sm:text-[1.35rem]";

export default function FeedbackSection() {
  // ── form state ─────────────────────────────────────────────
  const [reviewRating, setReviewRating] = useState(0);
  const [reactions, setReactions] = useState<string[]>([]);
  const [writingRating, setWritingRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [hasReadZidd, setHasReadZidd] = useState<ReadStatus | null>(null);
  const [name, setName] = useState("");
  const [issues, setIssues] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState("");
  const [invalid, setInvalid] = useState({
    rating: false,
    status: false,
    text: false,
  });
  const alertRef = useRef<HTMLDivElement>(null);

  // ── community list state ───────────────────────────────────
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [listStatus, setListStatus] = useState<ListStatus>("loading");
  const [average, setAverage] = useState<number | null>(null);
  const [count, setCount] = useState(0);

  const loadRows = useCallback(() => {
    setListStatus("loading");
    fetchFeedback()
      .then((data) => {
        setRows(data.rows);
        setAverage(data.average);
        setCount(data.count);
        setListStatus("ready");
      })
      .catch(() => {
        setListStatus("error");
      });
  }, []);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  function toggleReaction(emoji: string) {
    setReactions((current) =>
      current.includes(emoji)
        ? current.filter((r) => r !== emoji)
        : [...current, emoji]
    );
  }

  function resetFeedbackPartially() {
    setIssues([]);
    setSubmitError("");
    setInvalid({ rating: false, status: false, text: false });
  }

  // When validation fails, move keyboard focus to the summary so the
  // announcement isn't lost between the fields and the message.
  useEffect(() => {
    if (issues.length > 0 || submitError) {
      alertRef.current?.focus();
    }
  }, [issues, submitError]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = feedbackText.trim();
    const ratingMissing = reviewRating === 0;
    const statusMissing = hasReadZidd === null;
    const textMissing = trimmed.length === 0;
    const textTooLong = trimmed.length > 2000;
    const nameTooLong = name.trim().length > 80;

    const found: string[] = [];
    if (ratingMissing) {
      found.push("Pick a star rating for the review — how did it land?");
    }
    if (statusMissing) {
      found.push("Choose one answer for “Have you read Zidd?”.");
    }
    if (textMissing) {
      found.push(
        "Write a line or two of honest feedback — even one sentence helps."
      );
    } else if (textTooLong) {
      found.push("That's a lot of heart — trim it under 2000 characters.");
    }
    if (nameTooLong) {
      found.push("The name field can hold up to 80 characters.");
    }

    setInvalid({ rating: ratingMissing, status: statusMissing, text: textMissing || textTooLong });

    if (found.length > 0) {
      setIssues(found);
      return;
    }
    setIssues([]);
    setSubmitError("");
    setSubmitState("submitting");
    try {
      await submitFeedback({
        review_rating: reviewRating,
        reactions,
        writing_rating: writingRating,
        feedback: feedbackText,
        has_read_zidd: hasReadZidd as ReadStatus,
        name,
      });
      setSubmitState("success");
      loadRows();
    } catch (error) {
      setSubmitState("error");
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "That didn't go through — give it another try in a moment."
      );
    }
  }

  return (
    <>
      <h2
        id="your-turn"
        className="mt-16 text-center font-display text-3xl font-medium tracking-[-0.01em] sm:text-4xl"
      >
        Okay, your turn. Tell me what you think!
      </h2>
      <p className="mx-auto mt-5 max-w-[32rem] text-center text-[1.0625rem] leading-relaxed text-ink/85">
        Since this is my first book review, I'd genuinely love some feedback.
        Don't hold back!
      </p>

      {submitState === "success" ? (
        <div
          role="status"
          className="mt-14 border border-ink/20 px-6 py-12 text-center"
        >
          <p className="mx-auto max-w-[32rem] font-display text-xl leading-relaxed text-ink sm:text-[1.35rem]">
            Thank you for taking the time to read my first review and share
            your thoughts. Every bit of feedback means a lot. ❤️
          </p>
          <p className="mt-4 text-sm text-ink/70">
            Your response is in the list below.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-12">
          {/* A — stars */}
          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend id="q-rating" className={questionClass}>
              How would you rate my review?
            </legend>
            <StarRatingInput
              value={reviewRating}
              onChange={setReviewRating}
              invalid={invalid.rating}
            />
            <p
              className="mt-3 text-sm text-ink/75"
              aria-live="polite"
              aria-describedby="q-rating"
            >
              {reviewRating > 0
                ? `You rated my review: ${reviewRating} out of 5 stars`
                : "Tap a star — 1 is low, 5 is wonderful."}
            </p>
          </fieldset>

          {/* B — reactions */}
          <fieldset className="m-0 mt-14 min-w-0 border-0 p-0">
            <legend className={questionClass}>
              How did you feel while reading my review?
            </legend>
            <ReactionChips selected={reactions} onToggle={toggleReaction} />
          </fieldset>

          {/* C — writing scale */}
          <div className="mt-14">
            <label htmlFor="writing-scale" className={questionClass}>
              What did you think about my writing?
            </label>
            <WritingScale value={writingRating} onChange={setWritingRating} />
          </div>

          {/* D — honest feedback */}
          <div className="mt-14">
            <label htmlFor="feedback-text" className={questionClass}>
              Your honest feedback
            </label>
            <textarea
              id="feedback-text"
              value={feedbackText}
              onChange={(event) => {
                setFeedbackText(event.target.value);
                resetFeedbackPartially();
              }}
              rows={5}
              maxLength={2000}
              placeholder="Tell me what you liked, what I could improve, or anything that crossed your mind..."
              aria-describedby={
                issues.length > 0 || submitError
                  ? "feedback-text-hint form-issues"
                  : "feedback-text-hint"
              }
              aria-invalid={invalid.text || undefined}
              className="field mt-4 w-full border px-4 py-3 text-[1.0625rem] leading-relaxed"
            />
            <p id="feedback-text-hint" className="mt-2 text-xs text-ink/70">
              A sentence or two is plenty.
            </p>
          </div>

          {/* E — have you read Zidd? */}
          <fieldset className="m-0 mt-14 min-w-0 border-0 p-0">
            <legend className={questionClass}>Have you read Zidd?</legend>
            <div className="mt-4 flex flex-col items-start gap-2.5">
              {READ_STATUS_OPTIONS.map(({ value, label }) => {
                const active = hasReadZidd === value;
                return (
                  <label
                    key={value}
                    className={`inline-flex min-h-[44px] cursor-pointer select-none items-center rounded-full border px-5 py-2 text-[0.9375rem] transition-colors duration-150 ${
                      active
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/25 bg-transparent text-ink hover:border-ink/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="has-read-zidd"
                      value={value}
                      checked={active}
                      onChange={() => {
                        setHasReadZidd(value);
                        resetFeedbackPartially();
                      }}
                      aria-invalid={invalid.status || undefined}
                      className="sr-only"
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* F — name */}
          <div className="mt-14">
            <label htmlFor="reviewer-name" className={questionClass}>
              Name <span className="text-ink/70">(optional)</span>
            </label>
            <input
              id="reviewer-name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                resetFeedbackPartially();
              }}
              maxLength={80}
              placeholder="What should I call you?"
              className="field mt-4 w-full max-w-[22rem] border-x-0 border-t-0 border-b px-0 py-2 text-[1.0625rem]"
              style={{ borderLeftWidth: 0, borderRightWidth: 0, borderTopWidth: 0 }}
            />
            <p className="mt-2 text-xs text-ink/70">
              Skip it and you'll show up as Anonymous.
            </p>
          </div>

          {/* validation + submit errors */}
          {(issues.length > 0 || submitError) && (
            <div
              id="form-issues"
              ref={alertRef}
              tabIndex={-1}
              role="alert"
              className="mt-10 border border-ink/25 px-5 py-4 focus:outline-none"
            >
              {issues.length > 0 && (
                <>
                  <p className="text-sm font-medium">
                    A couple of things before it can go through:
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/85">
                    {issues.map((message) => (
                      <li key={message}>{message}</li>
                    ))}
                  </ul>
                </>
              )}
              {submitError && (
                <p className="text-sm text-ink/85">{submitError}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={submitState === "submitting"}
            className="mt-12 inline-flex min-h-[48px] items-center justify-center gap-3 rounded-none bg-ink px-8 py-3.5 text-sm font-medium tracking-[0.02em] text-paper transition-opacity duration-150 hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
          >
            {submitState === "submitting" ? "Sharing…" : "Share my thoughts →"}
          </button>
        </form>
      )}

      {/* ── community responses ─────────────────────────────────── */}
      <CommunityFeedback
        rows={rows}
        status={listStatus}
        average={average}
        count={count}
        onRetry={loadRows}
      />
    </>
  );
}

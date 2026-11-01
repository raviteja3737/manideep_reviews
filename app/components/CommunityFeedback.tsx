"use client";

import { formatDate, type FeedbackRow } from "@/app/lib/feedback";
import StarIcon from "./StarIcon";
import { REACTIONS } from "@/app/lib/feedback";

const READ_STATUS_TAGS: Record<string, string> = {
  read: "Read Zidd",
  curious: "Curious about it",
  writing: "Here for the writing",
};

function Stars({
  value,
  className = "h-4 w-4",
}: {
  value: number;
  className?: string;
}) {
  return (
    <span className="inline-flex items-center gap-0.5 text-ink" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} filled={n <= value} className={className} />
      ))}
    </span>
  );
}

export default function CommunityFeedback({
  rows,
  status,
  average,
  count,
  onRetry,
}: {
  rows: FeedbackRow[];
  status: "loading" | "ready" | "error";
  /** Exact average over the whole table, computed by the API. */
  average: number | null;
  count: number;
  onRetry: () => void;
}) {

  return (
    <div className="mt-16 border-t border-ink/15 pt-16">
      <h2 className="text-center font-display text-3xl font-medium tracking-[-0.01em] sm:text-4xl">
        What readers think
      </h2>

      {average !== null && (
        <p className="mt-5 text-center text-sm text-ink/75">
          <span className="font-display text-xl font-medium tabular-nums text-ink">
            {average.toFixed(1)}
          </span>
          {" /5 average review rating · "}
          <span className="tabular-nums">{count}</span> {count === 1 ? "response" : "responses"}
        </p>
      )}

      {status === "loading" && count === 0 && (
        <p className="mt-8 text-center text-sm text-ink/70">
          Reading the responses…
        </p>
      )}

      {status === "error" && count === 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-ink/85">
            The responses aren't loading right now.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 text-sm font-medium underline underline-offset-4 transition-colors duration-150 hover:text-ink/60"
          >
            Try again
          </button>
        </div>
      )}

      {status === "ready" && count === 0 && (
        <p className="mx-auto mt-8 max-w-[30rem] text-center text-[1.0625rem] leading-relaxed text-ink/80">
          No responses yet — you could be the very first. It takes two minutes,
          right above.
        </p>
      )}

      {count > 0 && (
        <ul className="mt-12 divide-y divide-ink/10">
          {rows.map((row) => (
            <li key={row.id} className="py-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-display text-lg font-medium text-ink">
                    {row.name && row.name.trim().length > 0
                      ? row.name.trim()
                      : "Anonymous"}
                  </span>
                  {READ_STATUS_TAGS[row.has_read_zidd] && (
                    <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink/70">
                      {READ_STATUS_TAGS[row.has_read_zidd]}
                    </span>
                  )}
                </div>
                <span className="text-xs text-ink/70 tabular-nums">
                  {formatDate(row.created_at)}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-2">
                  <Stars value={row.review_rating} />
                  <span className="text-xs tabular-nums text-ink/75">
                    {row.review_rating}/5
                  </span>
                </span>
                <span className="text-xs text-ink/75">
                  writing{" "}
                  <span className="font-medium tabular-nums text-ink">
                    {row.writing_rating}/10
                  </span>
                </span>
              </div>

              {Array.isArray(row.reactions) && row.reactions.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {row.reactions.map((reaction) => {
                    const meta = REACTIONS.find((r) => r.emoji === reaction);
                    return (
                      <li
                        key={reaction}
                        className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/85"
                      >
                        <span aria-hidden="true">{meta?.emoji ?? reaction}</span>
                        {meta ? <span>{meta.label}</span> : <span>{reaction}</span>}
                      </li>
                    );
                  })}
                </ul>
              )}

              <p className="mt-4 text-[1.0625rem] leading-[1.8] text-ink/90">
                {row.feedback}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { REACTIONS } from "@/app/lib/feedback";

export default function ReactionChips({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (emoji: string) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2.5">
      {REACTIONS.map(({ emoji, label }) => {
        const active = selected.includes(emoji);
        return (
          <label
            key={emoji}
            className={`inline-flex min-h-[44px] cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2 text-sm leading-tight transition-colors duration-150 ${
              active
                ? "border-ink bg-ink text-paper"
                : "border-ink/25 bg-transparent text-ink hover:border-ink/60"
            }`}
          >
            <input
              type="checkbox"
              checked={active}
              onChange={() => onToggle(emoji)}
              className="sr-only"
            />
            <span aria-hidden="true" className="text-base leading-none">
              {emoji}
            </span>
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  );
}

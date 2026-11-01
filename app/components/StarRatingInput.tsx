"use client";

import { useState } from "react";
import StarIcon from "./StarIcon";

export default function StarRatingInput({
  value,
  onChange,
  invalid = false,
}: {
  value: number;
  onChange: (value: number) => void;
  /** Marked when validation fails so screen readers announce the state. */
  invalid?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <div className="mt-4 flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <label
          key={n}
          className="relative block h-11 w-11 cursor-pointer"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
        >
          <input
            type="radio"
            name="review-rating"
            value={n}
            checked={value === n}
            onChange={() => onChange(n)}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            aria-invalid={invalid || undefined}
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
          />
          <StarIcon
            filled={n <= shown}
            className="pointer-events-none absolute inset-0 m-auto h-7 w-7 text-ink"
          />
        </label>
      ))}
    </div>
  );
}

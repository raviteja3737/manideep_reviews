export default function StarIcon({
  className,
  filled,
}: {
  className?: string;
  filled: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.6}
      strokeLinejoin="round"
    >
      <path d="M12 2.75l2.9 5.88a.4.4 0 0 0 .3.22l6.49.94-4.7 4.58a.4.4 0 0 0-.11.35l1.11 6.46L12 17.9l-5.99 3.28 1.11-6.46a.4.4 0 0 0-.11-.35l-4.7-4.58 6.49-.94a.4.4 0 0 0 .3-.22l2.9-5.88z" />
    </svg>
  );
}

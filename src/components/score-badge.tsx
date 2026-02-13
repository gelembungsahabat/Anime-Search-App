export function ScoreBadge({ score }: { score: number | null }) {
  if (!score) return null;

  const color =
    score >= 7.5
      ? "var(--score-green)"
      : score >= 5.5
        ? "var(--score-yellow)"
        : "var(--score-red)";

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-white text-xs font-bold"
      style={{ backgroundColor: color }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {score.toFixed(1)}
    </span>
  );
}

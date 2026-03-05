// ── Size map ──────────────────────────────────────────────────────────────────
const sizeMap = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
} as const;

// ── Props ─────────────────────────────────────────────────────────────────────
interface LoadingSpinnerProps {
  /** Controls rendered width/height via Tailwind */
  size?: keyof typeof sizeMap;
  /** Tailwind text-color class — stroke color inherits from currentColor */
  colorClass?: string;
  className?: string;
}

/**
 * LoadingSpinner — accessible SVG spinner used inside Button and page-level
 * loading states.
 *
 * @param size       - xs | sm | md | lg | xl  (default: "md")
 * @param colorClass - Tailwind text-* class    (default: "text-primary-500")
 */
export default function LoadingSpinner({
  size = "md",
  colorClass = "text-primary-500",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClass = sizeMap[size] ?? sizeMap.md;

  return (
    <svg
      className={`animate-spin ${sizeClass} ${colorClass} ${className}`.trim()}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="presentation"
    >
      {/* Track */}
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      {/* Spinning arc */}
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
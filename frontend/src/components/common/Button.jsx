"use client";

import LoadingSpinner from "./LoadingSpinner";

// ── Style maps ────────────────────────────────────────────────────────────────

/**
 * Variant classes aligned with MASTER.md:
 *  - primary  → amber CTA (#F59E0B) — matches .btn-primary spec
 *  - solid    → brand primary blue (#1E40AF)
 *  - outline  → transparent + blue border — matches .btn-secondary spec
 *  - ghost    → no border, subtle hover
 *  - danger   → destructive red
 */
const variantClasses = {
  primary: [
    "bg-amber-500 text-white",
    "hover:bg-amber-600 hover:opacity-90 hover:-translate-y-px",
    "focus-visible:ring-amber-400",
    "active:bg-amber-700",
    "border border-transparent",
  ].join(" "),

  solid: [
    "bg-blue-800 text-white",               // #1E40AF
    "hover:bg-blue-900 hover:-translate-y-px",
    "focus-visible:ring-blue-700",
    "active:bg-blue-950",
    "border border-transparent",
  ].join(" "),

  outline: [
    "bg-transparent text-blue-800",         // #1E40AF
    "border-2 border-blue-800",
    "hover:bg-blue-50 hover:-translate-y-px",
    "focus-visible:ring-blue-700",
    "active:bg-blue-100",
  ].join(" "),

  ghost: [
    "bg-transparent text-blue-800",
    "border border-transparent",
    "hover:bg-blue-50",
    "focus-visible:ring-blue-400",
    "active:bg-blue-100",
  ].join(" "),

  danger: [
    "bg-red-600 text-white",
    "border border-transparent",
    "hover:bg-red-700 hover:-translate-y-px",
    "focus-visible:ring-red-500",
    "active:bg-red-800",
  ].join(" "),
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm gap-1.5 rounded-md",
  md: "px-6 py-3 text-sm gap-2 rounded-lg",   // matches spec: 12px 24px
  lg: "px-8 py-3.5 text-base gap-2.5 rounded-lg",
};

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Button
 *
 * @param {"primary"|"solid"|"outline"|"ghost"|"danger"} variant
 * @param {"sm"|"md"|"lg"}                               size
 * @param {boolean}                                      isLoading
 * @param {React.ComponentType}                          icon       - Lucide icon component
 * @param {"left"|"right"}                               iconPosition
 * @param {React.ReactNode}                              children
 * @param {React.ButtonHTMLAttributes}                   ...props
 */
export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon: Icon,
  iconPosition = "left",
  children,
  className = "",
  disabled,
  type = "button",
  ...props
}) {
  const isDisabled = disabled || isLoading;

  const iconSize = size === "lg" ? 20 : size === "sm" ? 14 : 16;

  const baseClasses = [
    // Layout
    "inline-flex items-center justify-center",
    "font-semibold",
    // Transition — MASTER.md: 200ms ease, no layout-shifting transforms
    "transition-all duration-200 ease-in-out",
    // cursor
    "cursor-pointer",
    // Focus ring — MASTER.md: focus states must be visible
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    // Disabled state
    isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
    // No translate on disabled (MASTER.md: avoid layout-shifting hovers)
    !isDisabled ? "" : "transform-none",
  ]
    .filter(Boolean)
    .join(" ");

  const classes = [
    baseClasses,
    variantClasses[variant] ?? variantClasses.primary,
    sizeClasses[size] ?? sizeClasses.md,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      className={classes}
      {...props}
    >
      {/* Left icon / loading spinner */}
      {isLoading ? (
        <LoadingSpinner
          size={size === "lg" ? "sm" : "xs"}
          colorClass="text-current"
        />
      ) : (
        Icon &&
        iconPosition === "left" && (
          <Icon size={iconSize} aria-hidden="true" strokeWidth={2} />
        )
      )}

      {/* Label */}
      {children && <span>{children}</span>}

      {/* Right icon (only when not loading) */}
      {!isLoading && Icon && iconPosition === "right" && (
        <Icon size={iconSize} aria-hidden="true" strokeWidth={2} />
      )}
    </button>
  );
}
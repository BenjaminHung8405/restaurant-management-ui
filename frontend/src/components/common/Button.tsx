"use client";

import type { LucideIcon } from "lucide-react";
import type React from "react";
import LoadingSpinner from "./LoadingSpinner";

// ── Variant & size type unions ────────────────────────────────────────────────
type ButtonVariant = "primary" | "solid" | "outline" | "ghost" | "danger";
type ButtonSize    = "sm" | "md" | "lg";

// ── Props ─────────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:      ButtonVariant;
  size?:         ButtonSize;
  isLoading?:    boolean;
  /** Lucide icon component rendered left or right of the label */
  icon?:         LucideIcon;
  iconPosition?: "left" | "right";
}

// ── Style maps ────────────────────────────────────────────────────────────────
const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-primary-500 text-white",
    "hover:bg-primary-600 hover:-translate-y-px",
    "focus-visible:ring-primary-400",
    "active:bg-primary-700",
    "border border-transparent",
  ].join(" "),

  solid: [
    "bg-blue-800 text-white",
    "hover:bg-blue-900 hover:-translate-y-px",
    "focus-visible:ring-blue-700",
    "active:bg-blue-950",
    "border border-transparent",
  ].join(" "),

  outline: [
    "bg-transparent text-primary-600",
    "border-2 border-primary-500",
    "hover:bg-primary-50 hover:-translate-y-px",
    "focus-visible:ring-primary-400",
    "active:bg-primary-100",
  ].join(" "),

  ghost: [
    "bg-transparent text-primary-600",
    "border border-transparent",
    "hover:bg-primary-50",
    "focus-visible:ring-primary-300",
    "active:bg-primary-100",
  ].join(" "),

  danger: [
    "bg-red-600 text-white",
    "border border-transparent",
    "hover:bg-red-700 hover:-translate-y-px",
    "focus-visible:ring-red-500",
    "active:bg-red-800",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5 rounded-md",
  md: "px-6 py-3 text-sm gap-2 rounded-lg",
  lg: "px-8 py-3.5 text-base gap-2.5 rounded-lg",
};

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Button — polymorphic, accessible button following MASTER.md spec.
 *
 * @param variant      - Visual style  (default: "primary")
 * @param size         - Padding scale (default: "md")
 * @param isLoading    - Replaces left icon with spinner and disables interaction
 * @param icon         - Lucide icon component
 * @param iconPosition - "left" | "right" (default: "left")
 */
export default function Button({
  variant      = "primary",
  size         = "md",
  isLoading    = false,
  icon: Icon,
  iconPosition = "left",
  children,
  className    = "",
  disabled,
  type         = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const iconSize   = size === "lg" ? 20 : size === "sm" ? 14 : 16;

  const baseClasses = [
    "inline-flex items-center justify-center",
    "font-semibold",
    // MASTER.md: 200ms ease, no layout-shifting transforms on disabled
    "transition-all duration-200 ease-in-out",
    "cursor-pointer",
    // MASTER.md: focus rings must always be visible
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
    isDisabled ? "transform-none" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const classes = [
    baseClasses,
    variantClasses[variant] ?? variantClasses.primary,
    sizeClasses[size]       ?? sizeClasses.md,
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
        Icon && iconPosition === "left" && (
          <Icon size={iconSize} aria-hidden="true" strokeWidth={2} />
        )
      )}

      {/* Label */}
      {children && <span>{children}</span>}

      {/* Right icon — only when not loading */}
      {!isLoading && Icon && iconPosition === "right" && (
        <Icon size={iconSize} aria-hidden="true" strokeWidth={2} />
      )}
    </button>
  );
}
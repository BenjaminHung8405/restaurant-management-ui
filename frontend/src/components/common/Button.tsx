"use client";

import type { LucideIcon } from "lucide-react";
import type React from "react";
import LoadingSpinner from "./LoadingSpinner";

// ── Types ─────────────────────────────────────────────────────────────────────
type ButtonVariant = "primary" | "solid" | "outline" | "ghost" | "danger";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:      ButtonVariant;
  size?:         ButtonSize;
  isLoading?:    boolean;
  icon?:         LucideIcon;
  iconPosition?: "left" | "right";
}

// ── Inline style maps — immune to Tailwind v4 purge ───────────────────────────
// All color-bearing properties use inline styles; Tailwind only handles
// layout, spacing, radius and transitions (safe utility names).

type VariantStyle = {
  base:    React.CSSProperties;
  hover:   React.CSSProperties;
  active:  React.CSSProperties;
  classes: string;           // non-color Tailwind classes only
};

const VARIANT_STYLES: Record<ButtonVariant, VariantStyle> = {
  primary: {
    base:    { backgroundColor: "#f97316", color: "#ffffff", border: "1px solid transparent" },
    hover:   { backgroundColor: "#ea580c" },
    active:  { backgroundColor: "#c2410c" },
    classes: "shadow-sm hover:shadow-md hover:-translate-y-px",
  },
  solid: {
    base:    { backgroundColor: "#1e40af", color: "#ffffff", border: "1px solid transparent" },
    hover:   { backgroundColor: "#1e3a8a" },
    active:  { backgroundColor: "#1e3a8a" },
    classes: "shadow-sm hover:shadow-md hover:-translate-y-px",
  },
  outline: {
    base:    { backgroundColor: "transparent", color: "#ea580c", border: "2px solid #f97316" },
    hover:   { backgroundColor: "#fff7ed" },
    active:  { backgroundColor: "#ffedd5" },
    classes: "hover:-translate-y-px",
  },
  ghost: {
    base:    { backgroundColor: "transparent", color: "#ea580c", border: "1px solid transparent" },
    hover:   { backgroundColor: "#fff7ed" },
    active:  { backgroundColor: "#ffedd5" },
    classes: "",
  },
  danger: {
    base:    { backgroundColor: "#dc2626", color: "#ffffff", border: "1px solid transparent" },
    hover:   { backgroundColor: "#b91c1c" },
    active:  { backgroundColor: "#991b1b" },
    classes: "shadow-sm hover:shadow-md hover:-translate-y-px",
  },
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5 rounded-md",
  md: "px-6 py-3   text-sm gap-2   rounded-lg",
  lg: "px-8 py-3.5 text-base gap-2.5 rounded-lg",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function Button({
  variant      = "primary",
  size         = "md",
  isLoading    = false,
  icon: Icon,
  iconPosition = "left",
  children,
  className    = "",
  style,
  disabled,
  type         = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const iconSize   = size === "lg" ? 20 : size === "sm" ? 14 : 16;
  const vs         = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;

  const layoutClasses = [
    "inline-flex items-center justify-center",
    "font-semibold",
    "transition-all duration-200 ease-in-out",
    "cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    SIZE_CLASSES[size],
    vs.classes,
    isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
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
      className={layoutClasses}
      style={{ ...vs.base, ...style }}
      onMouseEnter={(e) => {
        if (!isDisabled) Object.assign((e.currentTarget as HTMLButtonElement).style, vs.hover);
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) Object.assign((e.currentTarget as HTMLButtonElement).style, vs.base, style);
        props.onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        if (!isDisabled) Object.assign((e.currentTarget as HTMLButtonElement).style, vs.active);
        props.onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        if (!isDisabled) Object.assign((e.currentTarget as HTMLButtonElement).style, vs.hover);
        props.onMouseUp?.(e);
      }}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner size={size === "lg" ? "sm" : "xs"} colorClass="text-current" />
      ) : (
        Icon && iconPosition === "left" && (
          <Icon size={iconSize} aria-hidden="true" strokeWidth={2} />
        )
      )}

      {children && <span>{children}</span>}

      {!isLoading && Icon && iconPosition === "right" && (
        <Icon size={iconSize} aria-hidden="true" strokeWidth={2} />
      )}
    </button>
  );
}
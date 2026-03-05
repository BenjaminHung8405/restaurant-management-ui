"use client";

import { forwardRef, useId } from "react";

// ── Props ─────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visible label rendered above the input */
  label?:           string;
  /** Validation error — shown in red below the input, takes priority over helperText */
  error?:           string;
  /** Hint text shown below the input when there is no error */
  helperText?:      string;
  /** Extra Tailwind classes applied to the outer wrapper div */
  wrapperClassName?: string;
}

/**
 * Input — forwardRef-compatible for full react-hook-form / Zod integration.
 *
 * @param label           - Accessible visible label
 * @param error           - Validation error string
 * @param helperText      - Non-error hint beneath the input
 * @param wrapperClassName - Classes on the container div
 *
 * All standard <input> HTML attributes are forwarded via rest spread.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    helperText,
    className        = "",
    wrapperClassName = "",
    id:   externalId,
    required,
    disabled,
    ...props
  },
  ref
) {
  // Stable generated id — links <label> ↔ <input> ↔ error/helper text
  const generatedId = useId();
  const inputId     = externalId ?? generatedId;
  const errorId     = `${inputId}-error`;
  const helperId    = `${inputId}-helper`;

  // ── Class composition ──────────────────────────────────────────────────────
  const baseInput = [
    "w-full",
    "px-4 py-3",
    "text-base text-neutral-900",
    "bg-white",
    "border rounded-lg",
    "transition-all duration-200 ease-in-out",
    "placeholder:text-neutral-400",
    "cursor-text",
  ].join(" ");

  const normalBorder = "border-neutral-200 hover:border-primary-300";
  const focusRing    = "focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500";
  const errorBorder  = "border-red-400 hover:border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 focus:outline-none";
  const disabledCls  = disabled ? "opacity-50 cursor-not-allowed bg-neutral-50" : "";

  const inputClasses = [
    baseInput,
    error ? errorBorder : normalBorder,
    !error ? focusRing : "",
    disabledCls,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`.trim()}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-neutral-800 cursor-pointer select-none"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {/* Input */}
      <input
        ref={ref}
        id={inputId}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        className={inputClasses}
        {...props}
      />

      {/* Error message — takes priority over helperText */}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1 text-sm text-red-600 font-medium"
        >
          {/* Inline SVG — MASTER.md: no emoji, use SVG icons */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 flex-shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-sm text-neutral-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
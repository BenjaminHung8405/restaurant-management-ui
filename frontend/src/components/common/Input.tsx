"use client";

import { forwardRef, useId } from "react";

/**
 * Input — forwardRef-compatible for react-hook-form integration.
 *
 * @param {string}                   label
 * @param {string}                   error        - Validation error message
 * @param {string}                   helperText   - Hint shown below input when no error
 * @param {string}                   className    - Extra classes for the <input> element
 * @param {string}                   wrapperClassName
 * @param {React.InputHTMLAttributes} ...props    - Spread onto <input>
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    className = "",
    wrapperClassName = "",
    id: externalId,
    required,
    disabled,
    ...props
  },
  ref
) {
  // Stable generated id so label and input are always linked
  const generatedId = useId();
  const inputId = externalId ?? generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  // ── Class composition ──────────────────────────────────────────────────────
  const baseInput = [
    "w-full",
    "px-4 py-3",                              // spec: 12px 16px
    "text-base text-blue-950",
    "bg-white",
    "border rounded-lg",
    // Transition — MASTER.md: 200ms ease
    "transition-all duration-200 ease-in-out",
    // Placeholder
    "placeholder:text-slate-400",
    // Cursor
    "cursor-text",
  ].join(" ");

  const normalBorder =
    "border-slate-200 hover:border-blue-300";

  // Focus: MASTER.md primary #1E40AF — focus states must be visible
  const focusRing =
    "focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800";

  // Error state — red border + ring
  const errorBorder =
    "border-red-400 hover:border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400";

  // Disabled
  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed bg-slate-50"
    : "";

  const inputClasses = [
    baseInput,
    error ? errorBorder : normalBorder,
    !error ? focusRing : "",
    disabledClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-blue-950 cursor-pointer select-none"
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
          {/* Inline SVG exclamation — MASTER.md: no emojis, use SVG icons */}
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
        <p id={helperId} className="text-sm text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
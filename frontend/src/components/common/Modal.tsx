"use client";

import { X } from "lucide-react";
import { useCallback, useEffect } from "react";

// ── Max-width map ─────────────────────────────────────────────────────────────
const maxWidthMap = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",   // MASTER.md spec: max-width 500px ≈ max-w-lg
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

/**
 * Modal
 *
 * @param {boolean}          isOpen
 * @param {() => void}       onClose
 * @param {string}           title
 * @param {React.ReactNode}  children
 * @param {"xs"|"sm"|"md"|"lg"|"xl"|"2xl"} maxWidth
 * @param {boolean}          closeOnBackdrop  - default true
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
  closeOnBackdrop = true,
  className = "",
}) {
  // ── Keyboard: Escape to close ──────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  // ── Render nothing when closed ─────────────────────────────────────────────
  if (!isOpen) return null;

  const widthClass = maxWidthMap[maxWidth] ?? maxWidthMap.md;

  // ── Backdrop click ─────────────────────────────────────────────────────────
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    /* Portal-like overlay — fixed, full-screen */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      // MASTER.md: backdrop blur(4px) + rgba(0,0,0,0.5)
      className={[
        "fixed inset-0 z-[1050]",
        "flex items-center justify-center",
        "bg-black/50 backdrop-blur-[4px]",
        // Transition — MASTER.md: 200ms, no instant state changes
        "transition-opacity duration-200 ease-in-out",
        "p-4",                                // prevent card touching screen edges on mobile
      ].join(" ")}
      onClick={handleBackdropClick}
    >
      {/* ── Card ── */}
      <div
        className={[
          "relative w-full",
          widthClass,
          // MASTER.md .modal spec: bg white, rounded-16px, p-32px, shadow-xl
          "bg-white rounded-2xl p-8",
          // MASTER.md shadow-xl: 0 20px 25px rgba(0,0,0,0.15)
          "shadow-[0_20px_25px_rgba(0,0,0,0.15)]",
          // Slide-in feel without layout shift
          "transition-all duration-200 ease-in-out",
          className,
        ].join(" ")}
        // Stop click from reaching backdrop
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 mb-6">
          {title && (
            <h2
              id="modal-title"
              className="text-xl font-semibold text-blue-950 leading-snug font-[Fira_Code,monospace]"
            >
              {title}
            </h2>
          )}

          {/* Close button — MASTER.md: cursor-pointer, visible focus, SVG icon */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className={[
              "flex-shrink-0 ml-auto",
              "p-1.5 rounded-lg",
              "text-slate-400 hover:text-slate-700",
              "hover:bg-slate-100",
              "transition-colors duration-200 ease-in-out",
              "cursor-pointer",
              // Focus ring — MASTER.md: must be visible
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-blue-800 focus-visible:ring-offset-2",
            ].join(" ")}
          >
            <X size={20} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="text-slate-700 text-base leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
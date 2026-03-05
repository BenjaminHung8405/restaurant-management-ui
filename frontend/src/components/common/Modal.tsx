"use client";

import { X } from "lucide-react";
import { useCallback, useEffect } from "react";

// ── Max-width map ─────────────────────────────────────────────────────────────
const maxWidthMap = {
  xs:  "max-w-xs",
  sm:  "max-w-sm",
  md:  "max-w-md",
  lg:  "max-w-lg",
  xl:  "max-w-xl",
  "2xl": "max-w-2xl",
} as const;

type ModalMaxWidth = keyof typeof maxWidthMap;

// ── Props ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  isOpen:           boolean;
  onClose:          () => void;
  title?:           string;
  children:         React.ReactNode;
  maxWidth?:        ModalMaxWidth;
  /** Allow clicking the backdrop to close (default: true) */
  closeOnBackdrop?: boolean;
  className?:       string;
}

/**
 * Modal — accessible dialog with backdrop blur, keyboard (Escape) dismissal,
 * body-scroll lock, and a visible focus-ring close button.
 *
 * @param isOpen           - Controlled open state
 * @param onClose          - Called when the user dismisses the modal
 * @param title            - Optional heading (sets aria-labelledby)
 * @param maxWidth         - xs | sm | md | lg | xl | 2xl  (default: "md")
 * @param closeOnBackdrop  - Click-outside to close  (default: true)
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth        = "md",
  closeOnBackdrop = true,
  className       = "",
}: ModalProps) {
  // ── Keyboard: Escape to close ──────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) onClose();
  };

  return (
    /* Portal-like overlay — fixed, full-screen */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      className={[
        "fixed inset-0 z-[1050]",
        "flex items-center justify-center",
        // MASTER.md: backdrop blur(4px) + rgba(0,0,0,0.5)
        "bg-black/50 backdrop-blur-[4px]",
        "transition-opacity duration-200 ease-in-out",
        // Prevent card touching screen edges on mobile
        "p-4",
      ].join(" ")}
      onClick={handleBackdropClick}
    >
      {/* ── Card ── */}
      <div
        className={[
          "relative w-full",
          widthClass,
          // MASTER.md: bg white, rounded-16px, p-32px, shadow-xl
          "bg-white rounded-2xl p-8",
          "shadow-[0_20px_25px_rgba(0,0,0,0.15)]",
          "transition-all duration-200 ease-in-out",
          className,
        ].join(" ")}
        // Stop click reaching backdrop
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 mb-6">
          {title && (
            <h2
              id="modal-title"
              className="text-xl font-semibold text-neutral-900 leading-snug font-display"
            >
              {title}
            </h2>
          )}

          {/* Close button — MASTER.md: cursor-pointer, visible focus, SVG icon */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className={[
              "flex-shrink-0 ml-auto",
              "p-1.5 rounded-lg",
              "text-neutral-400 hover:text-neutral-700",
              "hover:bg-neutral-100",
              "transition-colors duration-200 ease-in-out",
              "cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
            ].join(" ")}
          >
            <X size={20} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="text-neutral-700 text-base leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
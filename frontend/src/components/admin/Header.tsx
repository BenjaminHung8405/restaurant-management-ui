"use client";

import { Bell, Menu, User } from "lucide-react";

// ── Mock admin profile — replace with auth store in Sprint 2 ─────────────────
const ADMIN_PROFILE = {
  name:   "Nguyễn Văn A",
  role:   "Quản trị viên",
  avatar: null,          // null → fallback to User icon
};

// ── Notification badge ────────────────────────────────────────────────────────
function NotificationBell({ count = 0 }) {
  return (
    <button
      type="button"
      aria-label={
        count > 0
          ? `Thông báo — ${count} chưa đọc`
          : "Thông báo"
      }
      className={[
        "relative p-2 rounded-lg",
        "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
        "cursor-pointer",
      ].join(" ")}
    >
      <Bell size={20} strokeWidth={2} aria-hidden="true" />

      {count > 0 && (
        <span
          aria-hidden="true"
          className={[
            "absolute -top-0.5 -right-0.5",
            "min-w-[16px] h-4 px-0.5",
            "flex items-center justify-center",
            "rounded-full",
            "bg-red-500 text-white",
            "text-[9px] font-bold leading-none",
            "pointer-events-none ring-2 ring-white",
          ].join(" ")}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

// ── Admin avatar ──────────────────────────────────────────────────────────────
function AdminAvatar({ src, name }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
      />
    );
  }

  // Fallback: initials block
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  return (
    <div
      aria-hidden="true"
      className={[
        "w-8 h-8 rounded-full flex-shrink-0",
        "flex items-center justify-center",
        "bg-primary-100 text-primary-700",
        "text-xs font-bold select-none",
        "ring-2 ring-primary-200",
      ].join(" ")}
    >
      {initials || <User size={14} strokeWidth={2} />}
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

/**
 * Header — Admin top navigation bar.
 *
 * Left (mobile only): hamburger to open Sidebar drawer.
 * Right: notification bell + admin profile chip.
 *
 * @param {{ onMenuClick: () => void }} props
 */
export default function Header({ onMenuClick }) {
  return (
    <header
      className={[
        "sticky top-0 z-[1030]",
        "h-16 flex-shrink-0",
        "flex items-center justify-between",
        "px-4 md:px-6",
        "bg-white border-b border-slate-200",
        "transition-shadow duration-200",
      ].join(" ")}
      aria-label="Thanh tiêu đề quản trị"
    >
      {/* ── Left: Hamburger (mobile only) + Page context ── */}
      <div className="flex items-center gap-3">
        {/* Hamburger — visible on mobile only */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Mở menu điều hướng"
          className={[
            "md:hidden",
            "p-2 rounded-lg -ml-1",
            "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
            "cursor-pointer",
          ].join(" ")}
        >
          <Menu size={22} strokeWidth={2} aria-hidden="true" />
        </button>

        {/* Breadcrumb placeholder — populated per-page via layout title if needed */}
        <span className="hidden md:block text-sm font-semibold text-slate-700 select-none">
          Quản trị hệ thống
        </span>
      </div>

      {/* ── Right: Actions + Profile ── */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <NotificationBell count={3} />

        {/* Divider */}
        <div
          className="h-6 w-px bg-slate-200 mx-1"
          aria-hidden="true"
        />

        {/* Admin profile chip */}
        <button
          type="button"
          aria-label={`Hồ sơ: ${ADMIN_PROFILE.name} — ${ADMIN_PROFILE.role}`}
          className={[
            "flex items-center gap-2.5",
            "pl-1 pr-3 py-1 rounded-lg",
            "hover:bg-slate-100",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
            "cursor-pointer",
          ].join(" ")}
        >
          <AdminAvatar
            src={ADMIN_PROFILE.avatar}
            name={ADMIN_PROFILE.name}
          />

          {/* Name + role — hidden on very small screens */}
          <div className="hidden sm:flex flex-col items-start min-w-0">
            <span className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
              {ADMIN_PROFILE.name}
            </span>
            <span className="text-[11px] text-slate-400 leading-tight truncate max-w-[120px]">
              {ADMIN_PROFILE.role}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}
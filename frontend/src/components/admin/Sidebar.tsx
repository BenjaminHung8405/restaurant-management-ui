"use client";

import {
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Table2,
  UtensilsCrossed,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Bảng điều khiển", href: "/dashboard", icon: LayoutDashboard },
  { label: "Đơn hàng",        href: "/orders",    icon: ShoppingCart },
  { label: "Thực đơn",        href: "/menu",      icon: UtensilsCrossed },
  { label: "Bàn ăn",          href: "/tables",    icon: Table2 },
  { label: "Người dùng",      href: "/users",     icon: Users },
  { label: "Cài đặt",         href: "/settings",  icon: Settings },
];

// ── Logo ──────────────────────────────────────────────────────────────────────
function SidebarLogo() {
  return (
    <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-200 flex-shrink-0">
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500"
        aria-hidden="true"
      >
        <UtensilsCrossed size={16} strokeWidth={2.5} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-800 leading-tight truncate">
          RestoMS
        </p>
        <p className="text-[11px] text-slate-400 leading-tight truncate">
          Quản trị hệ thống
        </p>
      </div>
    </div>
  );
}

// ── Nav link ──────────────────────────────────────────────────────────────────
function NavItem({ item, isActive, onClick }) {
  const { label, href, icon: Icon } = item;

  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
        className={[
          "group relative flex items-center gap-3",
          "px-4 py-2.5 rounded-lg mx-2",
          "text-sm font-medium",
          "transition-all duration-150 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
          isActive
            ? [
                "bg-primary-50 text-primary-600",
                // Bold left accent border
                "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
                "before:w-1 before:h-6 before:rounded-r-full before:bg-primary-500",
                "before:-ml-2",           // align with mx-2 offset
              ].join(" ")
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
        ].join(" ")}
      >
        <Icon
          size={18}
          strokeWidth={isActive ? 2.5 : 2}
          className={[
            "flex-shrink-0 transition-colors duration-150",
            isActive ? "text-primary-500" : "text-slate-400 group-hover:text-slate-600",
          ].join(" ")}
          aria-hidden="true"
        />
        <span className="truncate">{label}</span>
      </Link>
    </li>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

/**
 * Sidebar — Admin fixed vertical navigation.
 *
 * Desktop: always visible, fixed left (w-64).
 * Mobile:  slide-in overlay drawer, controlled by `isOpen` / `onClose`.
 *
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  // Close drawer on route change (mobile navigation)
  useEffect(() => {
    onClose?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const sidebarContent = (
    <aside
      className="flex flex-col w-64 h-full bg-white border-r border-slate-200"
      aria-label="Điều hướng quản trị"
    >
      {/* ── Logo ── */}
      <SidebarLogo />

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
        <ul className="flex flex-col gap-0.5" role="list">
          {NAV_ITEMS.map((item) => {
            // Match exact path or prefix (e.g. /orders/123 → /orders active)
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <NavItem
                key={item.href}
                item={item}
                isActive={isActive}
                onClick={onClose}
              />
            );
          })}
        </ul>
      </nav>

      {/* ── Footer label ── */}
      <div className="px-5 py-4 border-t border-slate-100 flex-shrink-0">
        <p className="text-[11px] text-slate-300 text-center select-none">
          © {new Date().getFullYear()} RestoMS v1.0
        </p>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── Desktop: always-visible fixed sidebar ── */}
      <div className="hidden md:flex h-screen flex-shrink-0 sticky top-0">
        {sidebarContent}
      </div>

      {/* ── Mobile: overlay backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[1040] bg-black/40 md:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* ── Mobile: slide-in drawer ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
        className={[
          "fixed inset-y-0 left-0 z-[1050] md:hidden",
          "flex h-full",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {sidebarContent}

        {/* Close button — top-right of drawer */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng menu điều hướng"
          className={[
            "absolute top-3.5 -right-10",
            "p-2 rounded-lg",
            "bg-white/90 text-slate-600",
            "hover:bg-white hover:text-slate-900",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
            "cursor-pointer",
          ].join(" ")}
        >
          <X size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
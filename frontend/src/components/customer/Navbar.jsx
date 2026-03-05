"use client";

import Button from "@/components/common/Button";
import useCartStore from "@/store/useCartStore";
import { Menu, ShoppingCart, UtensilsCrossed, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// ── Nav links ─────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "Menu",     href: "/menu" },
  { label: "About Us", href: "/about" },
];

/**
 * Navbar — Customer-facing sticky navigation bar.
 *
 * Features:
 *  - Glassmorphism effect (bg-white/80 backdrop-blur-md) per customer.md
 *  - Subtle bottom border
 *  - Cart icon with live item-count badge from useCartStore
 *  - Responsive: hamburger menu on mobile, horizontal links on desktop
 *  - Accessible: skip-to-content, aria-labels, visible focus rings
 */
export default function Navbar() {
  const pathname     = usePathname();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [scrolled,   setScrolled]     = useState(false);

  // ── Cart badge ─────────────────────────────────────────────────────────────
  const totalItems = useCartStore((s) => s.totalItems);

  // ── Scroll shadow ──────────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 8);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Skip to content — accessibility ──────────────────────────────── */}
      <a
        href="#main-content"
        className={[
          "sr-only focus:not-sr-only",
          "focus:fixed focus:top-4 focus:left-4 focus:z-[9999]",
          "focus:px-4 focus:py-2 focus:rounded-lg",
          "focus:bg-primary-500 focus:text-white focus:font-semibold",
          "focus:shadow-lg focus:outline-none",
        ].join(" ")}
      >
        Skip to content
      </a>

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header
        className={[
          // Positioning & stacking
          "sticky top-0 z-50",
          // Glassmorphism — customer.md: bg-white/80 backdrop-blur-md
          "bg-white/80 backdrop-blur-md",
          // Height — MASTER.md: 64px
          "h-16",
          // Horizontal padding — MASTER.md: 0 32px
          "px-4 sm:px-8",
          // Bottom border — always subtle; deepen on scroll
          scrolled
            ? "border-b border-neutral-200 shadow-sm"
            : "border-b border-neutral-100",
          "transition-all duration-200 ease-in-out",
        ].join(" ")}
      >
        <nav
          className="max-w-[1280px] mx-auto h-full flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* ── Logo ─────────────────────────────────────────────────── */}
          <Link
            href="/"
            className={[
              "flex items-center gap-2",
              "font-display font-bold text-xl text-primary-500",
              "hover:text-primary-600 transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-primary-400 focus-visible:ring-offset-2 rounded-sm",
            ].join(" ")}
            aria-label="Restaurant Management System — Home"
          >
            <UtensilsCrossed
              size={24}
              strokeWidth={2}
              aria-hidden="true"
              className="text-primary-500"
            />
            <span className="hidden xs:block">
              <span className="text-primary-500">Resto</span>
              <span className="text-neutral-800">MS</span>
            </span>
          </Link>

          {/* ── Desktop nav links ─────────────────────────────────────── */}
          <ul
            className="hidden md:flex items-center gap-1"
            role="list"
          >
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={[
                      // Base — MASTER.md: Inter Medium 500, 0.875rem
                      "relative px-4 py-2 rounded-lg",
                      "text-sm font-medium",
                      "transition-colors duration-200 ease-in-out",
                      // Focus ring — MASTER.md: visible, on-brand
                      "focus-visible:outline-none focus-visible:ring-2",
                      "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                      // Active vs idle
                      isActive
                        ? "text-primary-500 bg-primary-50"
                        : "text-neutral-600 hover:text-primary-500 hover:bg-primary-50/60",
                    ].join(" ")}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                    {/* Active underline accent */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary-500"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Right actions ─────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* Cart button with badge */}
            <Link href="/cart" aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}>
              <span className="relative inline-flex">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ShoppingCart}
                  aria-hidden="true"
                  tabIndex={-1}
                  className="text-neutral-700 hover:text-primary-500"
                >
                  <span className="hidden sm:inline">Cart</span>
                </Button>

                {/* Badge — red, absolute positioned */}
                {totalItems > 0 && (
                  <span
                    className={[
                      "absolute -top-1 -right-1",
                      "min-w-[18px] h-[18px] px-1",
                      "flex items-center justify-center",
                      "rounded-full",
                      "bg-red-500 text-white",
                      "text-[10px] font-bold leading-none",
                      "pointer-events-none select-none",
                      "ring-2 ring-white",
                      "transition-transform duration-200",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </span>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              className={[
                "md:hidden",
                "p-2 rounded-lg",
                "text-neutral-600 hover:text-primary-500 hover:bg-primary-50",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                "cursor-pointer",
              ].join(" ")}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen
                ? <X      size={22} strokeWidth={2} aria-hidden="true" />
                : <Menu   size={22} strokeWidth={2} aria-hidden="true" />
              }
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile menu overlay ───────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile menu panel ─────────────────────────────────────────────── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={[
          "fixed top-16 inset-x-0 z-40 md:hidden",
          "bg-white/95 backdrop-blur-md",
          "border-b border-neutral-200 shadow-lg",
          "transition-all duration-200 ease-in-out",
          mobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <nav
          className="max-w-[1280px] mx-auto px-4 py-4 flex flex-col gap-1"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "flex items-center px-4 py-3 rounded-xl",
                  "text-base font-medium",
                  "transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                  isActive
                    ? "bg-primary-50 text-primary-600 font-semibold"
                    : "text-neutral-700 hover:bg-primary-50 hover:text-primary-500",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
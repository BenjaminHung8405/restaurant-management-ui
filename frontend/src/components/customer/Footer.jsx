import {
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Twitter,
    UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";

// ── Data ──────────────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: "Menu",        href: "/menu" },
  { label: "Reservation", href: "/reservation" },
  { label: "About Us",    href: "/about" },
  { label: "Privacy Policy", href: "/privacy" },
];

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Address",
    value: "123 Flavor Street, Food City, FC 10001",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 012-3456",
    href: "tel:+15550123456",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@restoms.com",
    href: "mailto:hello@restoms.com",
  },
];

const SOCIAL_LINKS = [
  { icon: Facebook,  label: "Facebook",  href: "https://facebook.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Twitter,   label: "Twitter",   href: "https://twitter.com" },
];

/**
 * Footer — Customer-facing multi-column footer.
 *
 * Columns: Brand/About | Quick Links | Contact Info
 * Bottom:  Social icons + copyright
 *
 * Follows customer.md: bg-slate-900, text-white/80
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white/80" aria-label="Site footer">
      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* ── Column 1: Brand / About ──────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Logo */}
            <Link
              href="/"
              className={[
                "inline-flex items-center gap-2.5",
                "font-display font-bold text-xl",
                "text-white hover:text-primary-400",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                "focus-visible:ring-offset-slate-900 rounded-sm",
                "w-fit",
              ].join(" ")}
              aria-label="Restaurant Management System — Home"
            >
              <UtensilsCrossed
                size={22}
                strokeWidth={2}
                className="text-primary-400"
                aria-hidden="true"
              />
              <span>
                <span className="text-primary-400">Resto</span>
                <span className="text-white">MS</span>
              </span>
            </Link>

            {/* Description */}
            <p className="text-sm leading-[1.7] text-white/60 max-w-xs">
              Bringing great food and seamless dining experiences to your table.
              Order online, reserve a seat, and enjoy every bite.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3" aria-label="Social media links">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${label} page`}
                  className={[
                    "p-2 rounded-lg",
                    "text-white/50 hover:text-primary-400",
                    "hover:bg-white/10",
                    "transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                    "focus-visible:ring-offset-slate-900",
                  ].join(" ")}
                >
                  <Icon size={18} strokeWidth={2} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Column 2: Quick Links ─────────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={[
                      "inline-flex items-center gap-1.5",
                      "text-sm text-white/60",
                      "hover:text-primary-400",
                      "transition-colors duration-200",
                      "focus-visible:outline-none focus-visible:ring-2",
                      "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                      "focus-visible:ring-offset-slate-900 rounded-sm",
                      // Subtle animated arrow on hover
                      "group",
                    ].join(" ")}
                  >
                    <span
                      className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    >
                      ›
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Contact Info ────────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-4" role="list">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-3">
                  <Icon
                    size={16}
                    strokeWidth={2}
                    className="mt-0.5 flex-shrink-0 text-primary-400"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{label}:</span>
                  {href ? (
                    <a
                      href={href}
                      className={[
                        "text-sm text-white/60",
                        "hover:text-primary-400",
                        "transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2",
                        "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                        "focus-visible:ring-offset-slate-900 rounded-sm",
                      ].join(" ")}
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="text-sm text-white/60">{value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div className="border-t border-white/10" />

      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-6">
        <p className="text-center text-xs text-white/40">
          © {currentYear}{" "}
          <span className="text-white/60 font-medium">RestoMS</span>. All rights
          reserved. Built with ❤️ for great dining experiences.
        </p>
      </div>
    </footer>
  );
}
"use client";

import Button from "@/components/common/Button";
import ReservationModal from "@/components/customer/ReservationModal";
import {
    CTA_BANNER,
    DISHES_SECTION,
    FEATURES,
    FEATURES_SECTION,
    HERO,
    type DishPreview,
    type FeatureItem,
} from "@/lib/staticData";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// ── Sub-components (Server-safe, no hooks) ────────────────────────────────────

function FeatureCard({ item }: { item: FeatureItem }) {
  const { icon: Icon, title, description } = item;

  return (
    <div
      className={[
        "group flex flex-col items-center text-center",
        "p-8 rounded-2xl",
        "bg-white border border-neutral-100",
        "shadow-card hover:shadow-card-hover",
        "transition-all duration-[250ms] ease-smooth",
        "hover:-translate-y-1",
      ].join(" ")}
    >
      {/* Icon ring */}
      <div
        className="mb-5 flex items-center justify-center w-14 h-14 rounded-2xl transition-colors duration-[250ms] group-hover:[background-color:#fed7aa]"
        style={{ backgroundColor: "#ffedd5", color: "#c2410c" }}
        aria-hidden="true"
      >
        <Icon size={26} strokeWidth={1.75} />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-neutral-900 font-display">
        {title}
      </h3>

      <p className="text-sm leading-[1.6] text-neutral-600">{description}</p>
    </div>
  );
}

function DishCard({ dish }: { dish: DishPreview }) {
  const { name, description, price, imageUrl, imageAlt, badge } = dish;

  return (
    <article
      className={[
        "group relative flex flex-col",
        "bg-white rounded-3xl overflow-hidden",
        "border border-neutral-100",
        "shadow-sm",
        "hover:-translate-y-2 hover:shadow-2xl",
        "transition-all duration-300 ease-in-out",
      ].join(" ")}
    >
      {/* Image */}
      <div className="relative h-64 w-full overflow-hidden bg-neutral-100">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />

        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Badge */}
        {badge && (
          <span
            className={[
              "absolute top-4 left-4",
              "px-3 py-1.5 rounded-full",
              "bg-amber-500 text-white",
              "text-xs font-bold tracking-wide",
              "shadow-md z-10",
            ].join(" ")}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6 gap-3 z-10 bg-white">
        <h3 className="text-xl font-bold text-neutral-900 font-display line-clamp-1 group-hover:text-amber-600 transition-colors duration-200">
          {name}
        </h3>

        {description && (
          <p className="text-sm leading-[1.6] text-neutral-600 line-clamp-2 flex-grow">
            {description}
          </p>
        )}

        {/* Price + CTA row */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-neutral-100">
          <span className="text-lg font-bold text-amber-600">
            {price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </span>
          <Link href="/menu" aria-label={`Xem chi tiết ${name}`}>
            <button
              className={[
                "px-4 py-2 rounded-lg",
                "bg-amber-500 text-white font-semibold text-sm",
                "hover:bg-amber-600 hover:-translate-y-px",
                "shadow-sm hover:shadow-md",
                "transition-all duration-200",
                "cursor-pointer",
              ].join(" ")}
            >
              Xem
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

/**
 * CustomerHomePage — Landing page for the customer-facing site.
 *
 * Client Component: manages modal state with hooks.
 * Sections: Hero → Features → Featured Dishes → CTA Banner
 *
 * customer.md: mobile-first, max-width 1280px, low density, large CTA
 */
export default function CustomerHomePage() {
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [featuredDishes, setFeaturedDishes] = useState<DishPreview[]>([]);

  const handleOpenReservation = (): void => {
    setIsReservationOpen(true);
  };

  const handleCloseReservation = (): void => {
    setIsReservationOpen(false);
  };

  return (
    <div className="bg-white">
      {/* ══ 1. HERO ═══════════════════════════════════════════════════════════ */}
      <section
        suppressHydrationWarning
        className={[
          "relative flex items-center justify-center",
          "min-h-[90dvh]",
          "px-4 sm:px-8",
          "py-24",
          "overflow-hidden",
          // Warm gradient — customer.md: brand + white, appetizing
          "bg-gradient-to-br from-orange-50 via-white to-amber-50",
        ].join(" ")}
        aria-label="Giới thiệu nhà hàng"
      >
        {/* Background decorative blobs */}
        <div
          className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-primary-100/40 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -left-24 w-[360px] h-[360px] rounded-full bg-secondary-100/50 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Content — customer.md: single column, centered, max-w 800px */}
        <div className="relative z-10 max-w-[900px] mx-auto text-center flex flex-col items-center gap-8">
          {/* Eyebrow label */}
          <span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold shadow-sm"
            style={{
              backgroundColor: "#fff7ed",
              color: "#c2410c",
              border: "1px solid #fed7aa",
            }}
          >
            <Star size={16} strokeWidth={2.5} aria-hidden="true" className="text-amber-500 fill-amber-500" />
            {HERO.badge}
          </span>

          {/* Restaurant Name */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-amber-600 font-extrabold tracking-widest uppercase text-sm sm:text-base">
              Chào mừng đến với
            </span>
            <h1 className="font-display font-black text-6xl sm:text-7xl lg:text-8xl text-neutral-900 tracking-tight drop-shadow-sm">
              Resto<span className="text-amber-500">MS</span>
            </h1>
          </div>

          {/* Headline — MASTER.md: display font, 5xl, bold */}
          <h2
            className={[
              "font-display font-bold",
              "text-3xl sm:text-4xl lg:text-5xl",
              "text-neutral-800 leading-[1.25]",
              "text-balance",
            ].join(" ")}
          >
            {HERO.headline.part1}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              {HERO.headline.highlight}
            </span>
            {HERO.headline.part2}{" "}
            <span className="text-amber-700">{HERO.headline.emphasis}</span>
          </h2>

          {/* Sub-description — customer.md: short, focused */}
          <p
            className={[
              "max-w-[600px]",
              "text-lg sm:text-xl leading-[1.8]",
              "text-neutral-600 font-medium",
              "text-pretty",
            ].join(" ")}
          >
            {HERO.description}
          </p>

          {/* CTA row — customer.md: center, large CTA button */}
          <div className="flex flex-col xs:flex-row items-center gap-4 mt-2">
            <Link href="/menu" aria-label="Xem thực đơn nhà hàng">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all rounded-xl">
                {HERO.cta.primary}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={handleOpenReservation}
              className="w-full sm:w-auto text-lg px-8 py-4 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
              aria-label="Đặt bàn tại nhà hàng"
            >
              {HERO.cta.secondary}
            </Button>
          </div>

          {/* Social proof — customer.md: low density, trust signals */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pt-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="text-neutral-700">
                <span className="font-bold text-neutral-900">{HERO.socialProof.rating}</span>/5.0 từ{" "}
                <span className="font-bold text-neutral-900">{HERO.socialProof.reviewCount}+</span> đánh giá
              </span>
            </div>
            <div className="h-1 w-1 rounded-full bg-neutral-300 hidden sm:block" />
            <span className="text-neutral-700">
              <span className="font-bold text-neutral-900">{HERO.socialProof.dishCount}+</span> món ăn
            </span>
            <div className="h-1 w-1 rounded-full bg-neutral-300 hidden sm:block" />
            <span className="text-neutral-700">
              <span className="font-bold text-neutral-800">{HERO.socialProof.yearsExperience}+</span> năm kinh nghiệm
            </span>
          </div>
        </div>
      </section>

      {/* ══ 2. FEATURES / HIGHLIGHTS ═══════════════════════════════════════ */}
      <section
        className="py-20 px-4 sm:px-8 bg-neutral-50"
        aria-labelledby="features-heading"
      >
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-12">
          {/* Section header */}
          <div className="text-center max-w-[520px]">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#b45309" }}>
              {FEATURES_SECTION.label}
            </p>
            <h2
              id="features-heading"
              className="font-display font-bold text-3xl sm:text-4xl text-neutral-900"
            >
              {FEATURES_SECTION.heading}
            </h2>
          </div>

          {/* 3-column grid — customer.md: mobile-first → breakpoints */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((item) => (
              <FeatureCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. FEATURED DISHES ════════════════════════════════════════════ */}
      <section
        className="py-24 px-4 sm:px-8 bg-neutral-50/50"
        aria-labelledby="dishes-heading"
      >
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-14">
          {/* Section header */}
          <div className="text-center max-w-[600px]">
            <p className="text-sm font-bold uppercase tracking-widest mb-3 text-amber-600">
              {DISHES_SECTION.label}
            </p>
            <h2
              id="dishes-heading"
              className="font-display font-black text-4xl sm:text-5xl text-neutral-900 mb-4"
            >
              {DISHES_SECTION.heading}
            </h2>
            <p className="text-lg text-neutral-500 leading-relaxed">
              {DISHES_SECTION.description}
            </p>
          </div>

          {/* Dish cards grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>

          {/* Secondary CTA — view all menu */}
          <Link href="/menu" aria-label="Xem toàn bộ thực đơn" className="mt-4">
            <Button variant="outline" size="lg" className="border-2 border-amber-500 text-amber-600 hover:bg-amber-50">
              {DISHES_SECTION.cta}
            </Button>
          </Link>
        </div>
      </section>

      {/* ══ 4. CTA BANNER ═════════════════════════════════════════════════ */}
      <section
        suppressHydrationWarning
        className={[
          "relative flex items-center justify-center",
          "min-h-[60dvh]",
          "px-4 sm:px-8",
          "py-20 sm:py-24",
          "overflow-hidden",
          "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
        ].join(" ")}
        id="reservation"
        aria-labelledby="cta-heading"
      >
        {/* Background blobs */}
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-[800px] mx-auto text-center flex flex-col items-center gap-6">
          <h2
            id="cta-heading"
            className={[
              "font-display font-bold",
              "text-3xl sm:text-4xl",
              "text-white leading-[1.2]",
              "text-balance",
            ].join(" ")}
          >
            {CTA_BANNER.headline.part1}{" "}
            <span className="text-amber-300 drop-shadow-sm">{CTA_BANNER.headline.highlight}</span>
          </h2>

          <p className="max-w-[480px] text-base sm:text-lg text-white/90 leading-[1.7]">
            {CTA_BANNER.description}
          </p>

          {/* customer.md: center, large CTA, high contrast 7:1+ */}
          <div className="flex flex-col xs:flex-row items-center gap-3 pt-2">
            <Link href="/menu" aria-label="Khám phá menu nhà hàng">
              <Button
                variant="primary"
                size="lg"
                style={{ backgroundColor: "#ffffff", color: "#c2410c", border: "1px solid transparent" }}
              >
                {CTA_BANNER.cta.primary}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleOpenReservation}
              style={{ color: "#ffffff", border: "1px solid rgba(255,255,255,0.4)" }}
              aria-label="Đặt bàn nhà hàng"
            >
              {CTA_BANNER.cta.secondary}
            </Button>
          </div>

          {/* Trust note */}
          <p className="text-sm text-white/70">{CTA_BANNER.trust}</p>
        </div>
      </section>

      {/* ══ RESERVATION MODAL ═════════════════════════════════════════════ */}
      <ReservationModal isOpen={isReservationOpen} onClose={handleCloseReservation} />
    </div>
  );
}
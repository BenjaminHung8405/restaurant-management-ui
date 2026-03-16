import Button from "@/components/common/Button";
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
      <p className="text-sm leading-[1.7] text-neutral-500">{description}</p>
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
        <p className="text-sm leading-relaxed text-neutral-500 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Price + CTA row */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-neutral-50">
          <span className="text-xl font-extrabold text-amber-600">
            {price}
          </span>
          <Link
            href="/menu"
            className={[
              "flex items-center gap-1.5 text-sm font-bold",
              "text-neutral-500 hover:text-amber-600",
              "transition-colors duration-200",
            ].join(" ")}
            aria-label={`Xem chi tiết ${name}`}
          >
            Xem <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
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
 * Server Component: no hooks, no "use client".
 * Sections: Hero → Features → Featured Dishes → CTA Banner
 *
 * customer.md: mobile-first, max-width 1280px, low density, large CTA
 */
export default async function CustomerHomePage() {
  let featuredDishes: DishPreview[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/menu-items?isFeatured=true`, {
      next: { revalidate: 60 },
    });
    const json = await res.json();
    
    if (json?.data && Array.isArray(json.data)) {
      featuredDishes = json.data.slice(0, 3).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(item.price),
        imageUrl: item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
        imageAlt: item.name,
        badge: "Đặc biệt",
      }));
    }
  } catch (error) {
    console.error("Failed to fetch featured dishes:", error);
    // Ignore fallback to empty array
  }

  return (
    <div className="flex flex-col">

      {/* ══ 1. HERO ════════════════════════════════════════════════════════ */}
      <section
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
        <div className="relative z-10 max-w-[800px] mx-auto text-center flex flex-col items-center gap-6">

          {/* Eyebrow label */}
          <span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: "#fff7ed",
              color: "#c2410c",
              border: "1.5px solid #fed7aa",
            }}
          >
            <Star size={13} strokeWidth={2.5} aria-hidden="true" style={{ fill: "#f97316", color: "#f97316" }} />
            {HERO.badge}
          </span>

          {/* Headline — MASTER.md: display font, 5xl, bold */}
          <h1
            className={[
              "font-display font-bold",
              "text-4xl sm:text-5xl lg:text-6xl",
              "text-neutral-900 leading-[1.15]",
              "text-balance",
            ].join(" ")}
          >
            {HERO.headline.part1}{" "}
            <span className="gradient-text">{HERO.headline.highlight}</span>
            {HERO.headline.part2}{" "}
            <span style={{ color: "#7c2d12" }}>{HERO.headline.emphasis}</span>
          </h1>

          {/* Sub-description — customer.md: short, focused */}
          <p
            className={[
              "max-w-[560px]",
              "text-base sm:text-lg leading-[1.75]",
              "text-neutral-600",
              "text-pretty",
            ].join(" ")}
          >
            {HERO.description}
          </p>

          {/* CTA row — customer.md: center, large CTA button */}
          <div className="flex flex-col xs:flex-row items-center gap-3 pt-2">
            <Link href="/menu" aria-label="Xem thực đơn nhà hàng">
              <Button variant="primary" size="lg">
                {HERO.cta.primary}
              </Button>
            </Link>
            <Link href="#reservation" aria-label="Đặt bàn tại nhà hàng">
              <Button variant="outline" size="lg">
                {HERO.cta.secondary}
              </Button>
            </Link>
          </div>

          {/* Social proof micro-strip */}
          <div className="flex items-center gap-6 pt-4 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-neutral-800">{HERO.socialProof.rating}</span>
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className="fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </span>
              <span>({(HERO.socialProof.reviewCount / 1000).toFixed(1)}k đánh giá)</span>
            </span>
            <span className="w-px h-4 bg-neutral-200" aria-hidden="true" />
            <span>
              <span className="font-bold text-neutral-800">{HERO.socialProof.dishCount}+</span> món ăn
            </span>
            <span className="w-px h-4 bg-neutral-200" aria-hidden="true" />
            <span>
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
        className="relative overflow-hidden py-20 px-4 sm:px-8"
        style={{
          background: "linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #7c2d12 100%)",
        }}
        aria-labelledby="cta-heading"
        id="reservation"
      >
        {/* Decorative rings */}
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
            <Link href={CTA_BANNER.cta.phone} aria-label="Gọi điện đặt bàn">
              <Button
                variant="ghost"
                size="lg"
                style={{ color: "#ffffff", border: "1px solid rgba(255,255,255,0.4)" }}
              >
                {CTA_BANNER.cta.secondary}
              </Button>
            </Link>
          </div>

          {/* Trust note */}
          <p className="text-sm text-white/70">
            {CTA_BANNER.trust}
          </p>
        </div>
      </section>

    </div>
  );
}
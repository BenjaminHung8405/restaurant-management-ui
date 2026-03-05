import Button from "@/components/common/Button";
import { ChefHat, Leaf, Star, Utensils } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ── Local interfaces ──────────────────────────────────────────────────────────

interface FeatureItem {
  id:          number;
  icon:        LucideIcon;
  title:       string;
  description: string;
}

interface DishPreview {
  id:          number;
  name:        string;
  description: string;
  price:       string;
  imageUrl:    string;
  imageAlt:    string;
  badge?:      string;
}

// ── Static data ───────────────────────────────────────────────────────────────

const FEATURES: FeatureItem[] = [
  {
    id:          1,
    icon:        Leaf,
    title:       "Nguyên liệu tươi sạch",
    description:
      "100% nguyên liệu được tuyển chọn từ các nông trại hữu cơ, đảm bảo tươi mới mỗi ngày.",
  },
  {
    id:          2,
    icon:        ChefHat,
    title:       "Đầu bếp chuẩn sao",
    description:
      "Đội ngũ đầu bếp 5 sao với hơn 15 năm kinh nghiệm, mang đến hương vị đỉnh cao.",
  },
  {
    id:          3,
    icon:        Utensils,
    title:       "Không gian sang trọng",
    description:
      "Thiết kế nội thất hiện đại, ấm cúng — lý tưởng cho mọi dịp đặc biệt của bạn.",
  },
];

const DISHES: DishPreview[] = [
  {
    id:          1,
    name:        "Bò Lúc Lắc Truffle",
    description: "Thăn bò Wagyu xào cùng nấm truffle đen, ăn kèm khoai tây chiên giòn.",
    price:       "185.000đ",
    imageUrl:    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    imageAlt:    "Bò lúc lắc truffle trình bày đẹp",
    badge:       "Bán chạy",
  },
  {
    id:          2,
    name:        "Cơm Tấm Sườn Nướng",
    description: "Sườn heo nướng than hoa, ăn kèm cơm tấm, bì chả và nước mắm pha đặc trưng.",
    price:       "75.000đ",
    imageUrl:    "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    imageAlt:    "Cơm tấm sườn nướng truyền thống",
    badge:       "Đặc biệt",
  },
  {
    id:          3,
    name:        "Tôm Hùm Sốt Bơ Tỏi",
    description: "Tôm hùm Alaska tươi sống, sốt bơ tỏi thơm phức, phục vụ ngay tại bàn.",
    price:       "450.000đ",
    imageUrl:    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    imageAlt:    "Tôm hùm sốt bơ tỏi hấp dẫn",
    badge:       "Cao cấp",
  },
];

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
        className={[
          "mb-5 flex items-center justify-center",
          "w-14 h-14 rounded-2xl",
          "bg-primary-50 text-primary-500",
          "group-hover:bg-primary-100",
          "transition-colors duration-[250ms]",
        ].join(" ")}
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
        "bg-white rounded-2xl overflow-hidden",
        "border border-neutral-100",
        "shadow-card",
        // admin.md / customer.md: smooth hover lift
        "hover:-translate-y-1 hover:shadow-lg",
        "transition-all duration-[250ms] ease-smooth",
      ].join(" ")}
    >
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-smooth"
          // customer.md: performance — lazy below fold; hero images use priority
        />

        {/* Badge */}
        {badge && (
          <span
            className={[
              "absolute top-3 left-3",
              "px-2.5 py-1 rounded-full",
              "bg-primary-500 text-white",
              "text-[11px] font-semibold leading-none",
              "shadow-sm",
            ].join(" ")}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-2">
        <h3 className="text-base font-semibold text-neutral-900 font-display leading-snug">
          {name}
        </h3>
        <p className="text-sm leading-[1.6] text-neutral-500 flex-1">
          {description}
        </p>

        {/* Price + CTA row */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-neutral-100">
          <span className="text-base font-bold text-primary-500">{price}</span>
          <Link
            href="/menu"
            className={[
              "text-sm font-medium text-primary-600",
              "hover:text-primary-700",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-primary-400 focus-visible:ring-offset-2 rounded-sm",
            ].join(" ")}
            aria-label={`Xem chi tiết ${name}`}
          >
            Xem thêm →
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
export default function CustomerHomePage() {
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
            className={[
              "inline-flex items-center gap-1.5",
              "px-4 py-1.5 rounded-full",
              "bg-primary-50 text-primary-600",
              "text-sm font-semibold border border-primary-100",
            ].join(" ")}
          >
            <Star size={13} strokeWidth={2.5} aria-hidden="true" className="fill-primary-400 text-primary-400" />
            Nhà hàng số 1 Long Xuyên
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
            Hương Vị{" "}
            <span className="gradient-text">Đích Thực</span>
            {", "}
            Trải Nghiệm{" "}
            <span className="text-primary-500">Tuyệt Vời</span>
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
            Khám phá không gian ẩm thực đỉnh cao và những món ăn đậm đà bản
            sắc ngay giữa lòng{" "}
            <span className="font-medium text-neutral-800">Long Xuyên</span>.
          </p>

          {/* CTA row — customer.md: center, large CTA button */}
          <div className="flex flex-col xs:flex-row items-center gap-3 pt-2">
            <Link href="/menu" aria-label="Xem thực đơn nhà hàng">
              <Button variant="primary" size="lg">
                Xem Thực Đơn
              </Button>
            </Link>
            <Link href="#reservation" aria-label="Đặt bàn tại nhà hàng">
              <Button variant="outline" size="lg">
                Đặt Bàn
              </Button>
            </Link>
          </div>

          {/* Social proof micro-strip */}
          <div className="flex items-center gap-6 pt-4 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-neutral-800">4.9</span>
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
              <span>(2.4k đánh giá)</span>
            </span>
            <span className="w-px h-4 bg-neutral-200" aria-hidden="true" />
            <span>
              <span className="font-bold text-neutral-800">500+</span> món ăn
            </span>
            <span className="w-px h-4 bg-neutral-200" aria-hidden="true" />
            <span>
              <span className="font-bold text-neutral-800">10+</span> năm kinh nghiệm
            </span>
          </div>
        </div>
      </section>

      {/* ══ 2. FEATURES / HIGHLIGHTS ═══════════════════════════════════════ */}
      <section
        className="py-20 px-4 sm:px-8 bg-surface-muted"
        aria-labelledby="features-heading"
      >
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-12">

          {/* Section header */}
          <div className="text-center max-w-[520px]">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-500 mb-2">
              Tại sao chọn chúng tôi?
            </p>
            <h2
              id="features-heading"
              className="font-display font-bold text-3xl sm:text-4xl text-neutral-900"
            >
              Cam kết chất lượng mỗi ngày
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
        className="py-20 px-4 sm:px-8 bg-white"
        aria-labelledby="dishes-heading"
      >
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-12">

          {/* Section header */}
          <div className="text-center max-w-[520px]">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-500 mb-2">
              Thực đơn nổi bật
            </p>
            <h2
              id="dishes-heading"
              className="font-display font-bold text-3xl sm:text-4xl text-neutral-900"
            >
              Món Ngon Nổi Bật
            </h2>
            <p className="mt-3 text-base text-neutral-500 leading-[1.7]">
              Những món ăn được thực khách yêu thích nhất, chế biến từ nguyên
              liệu tươi ngon mỗi ngày.
            </p>
          </div>

          {/* Dish cards grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DISHES.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>

          {/* Secondary CTA — view all menu */}
          <Link href="/menu" aria-label="Xem toàn bộ thực đơn">
            <Button variant="outline" size="md">
              Xem Toàn Bộ Thực Đơn
            </Button>
          </Link>
        </div>
      </section>

      {/* ══ 4. CTA BANNER ═════════════════════════════════════════════════ */}
      <section
        className={[
          "relative overflow-hidden",
          "py-20 px-4 sm:px-8",
          // Warm on-brand gradient
          "bg-gradient-to-r from-primary-500 to-primary-600",
        ].join(" ")}
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
            Sẵn sàng cho một bữa tối{" "}
            <span className="text-secondary-200">khó quên?</span>
          </h2>

          <p className="max-w-[480px] text-base sm:text-lg text-white/80 leading-[1.7]">
            Đặt bàn ngay hôm nay và nhận ưu đãi{" "}
            <span className="font-semibold text-white">
              giảm 15% cho lần đầu tiên
            </span>{" "}
            — chỉ có tại RestoMS Long Xuyên.
          </p>

          {/* customer.md: center, large CTA, high contrast 7:1+ */}
          <div className="flex flex-col xs:flex-row items-center gap-3 pt-2">
            <Link href="/menu" aria-label="Khám phá menu nhà hàng">
              <Button
                variant="solid"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50 border-transparent focus-visible:ring-white"
              >
                Khám Phá Menu
              </Button>
            </Link>
            <Link href="tel:+842801234567" aria-label="Gọi điện đặt bàn">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10 border border-white/30 focus-visible:ring-white"
              >
                Gọi Đặt Bàn
              </Button>
            </Link>
          </div>

          {/* Trust note */}
          <p className="text-sm text-white/60">
            Không cần thẻ tín dụng · Đặt bàn miễn phí · Huỷ bất cứ lúc nào
          </p>
        </div>
      </section>

    </div>
  );
}
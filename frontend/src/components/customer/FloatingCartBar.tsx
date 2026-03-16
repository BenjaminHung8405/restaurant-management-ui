"use client";

import useCartStore from "@/store/useCartStore";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function FloatingCartBar() {
  const totalItems = useCartStore((s) => s.totalItems);
  const totalPrice = useCartStore((s) => s.totalPrice);

  // Only render if cart has items
  if (totalItems === 0) {
    return null;
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div
      className={[
        "fixed bottom-4 inset-x-4 md:inset-x-auto md:w-[420px] md:right-8",
        "z-50",
        "flex items-center justify-between gap-4",
        "px-5 py-4 rounded-xl",
        "bg-primary-500 hover:bg-primary-600",
        "text-white font-medium",
        "shadow-xl",
        "transition-all duration-200 ease-in-out",
        "animate-in slide-in-from-bottom-4",
      ].join(" ")}
    >
      {/* Left: Cart icon + Items count + Total price */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 p-2 bg-white/20 rounded-lg">
          <ShoppingCart size={20} strokeWidth={2} aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-white/90">
            {totalItems} {totalItems === 1 ? "món" : "món"}
          </span>
          <span className="text-lg font-bold text-white">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      {/* Right: Checkout link */}
      <Link
        href="/cart"
        className={[
          "flex-shrink-0",
          "px-4 py-2 rounded-lg",
          "bg-white text-primary-600 font-semibold",
          "hover:bg-primary-50",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-500",
          "cursor-pointer",
          "whitespace-nowrap text-sm md:text-base",
        ].join(" ")}
        aria-label="Xem giỏ hàng"
      >
        Xem giỏ ➔
      </Link>
    </div>
  );
}
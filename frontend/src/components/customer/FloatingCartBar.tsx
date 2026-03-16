"use client";

import useCartStore from "@/store/useCartStore";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FloatingCartBar() {
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render if cart has items and after hydration
  if (!mounted || totalItems === 0) {
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
        "bg-amber-500 hover:bg-amber-600",
        "text-white font-medium",
        "shadow-2xl",
        "transition-all duration-300 ease-in-out",
        "animate-in slide-in-from-bottom-4",
      ].join(" ")}
    >
      {/* Left: Cart icon + Items count + Total price */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 p-2.5 bg-white/20 rounded-lg">
          <ShoppingCart size={22} strokeWidth={2.5} aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-white/90">
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
          "px-5 py-2.5 rounded-lg",
          "bg-white text-amber-600 font-bold",
          "hover:bg-amber-50 hover:scale-105",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
          "cursor-pointer",
          "whitespace-nowrap text-sm md:text-base shadow-sm",
        ].join(" ")}
        aria-label="Xem giỏ hàng"
      >
        Xem giỏ ➔
      </Link>
    </div>
  );
}
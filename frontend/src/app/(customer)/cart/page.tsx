"use client";

import useCartStore from "@/store/useCartStore";
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handle hydration mismatch from persisting store
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/images/placeholder-dish.svg";
  };

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) {
    return <div className="min-h-screen bg-neutral-50" />;
  }

  // ── Empty State ─────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
        <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <ShoppingCart size={56} className="text-amber-500" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-3">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-slate-500 mb-8 text-center max-w-md text-lg">
          Chưa có món ăn nào trong giỏ hàng. Hãy khám phá thực đơn và chọn những món ăn tuyệt vời nhất nhé!
        </p>
        <Link
          href="/menu"
          aria-label="Quay lại Thực đơn"
          className={[
            "inline-flex items-center gap-2",
            "px-8 py-3.5 rounded-xl",
            "bg-amber-500 text-white font-bold text-lg",
            "hover:bg-amber-600 hover:-translate-y-1",
            "shadow-md hover:shadow-xl",
            "transition-all duration-300 ease-in-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500",
          ].join(" ")}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
          Quay lại Thực đơn
        </Link>
      </div>
    );
  }

  // ── Cart Content ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
            Giỏ hàng của bạn
          </h1>
          <button
            onClick={clearCart}
            className="text-sm font-medium text-slate-500 hover:text-red-600 hover:underline underline-offset-4 transition-colors p-2"
            aria-label="Xóa tất cả các món trong giỏ hàng"
          >
            Xóa tất cả
          </button>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 flex flex-col gap-8 relative">
          
          {/* ── Left Column: Cart Items List ── */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.cartItemId}
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Product Image */}
                <div className="relative w-full sm:w-24 h-32 sm:h-24 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-50">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      onError={onImageError}
                      sizes="(max-width: 640px) 100vw, 96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <UtensilsCrossed size={28} />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="text-xl sm:text-lg font-bold text-slate-900 line-clamp-2">
                    {item.name}
                  </h3>
                  
                  {/* F&B Critical Feature: Custom Notes */}
                  {item.notes && (
                    <div className="mt-1.5 p-2 bg-amber-50/50 rounded-lg border border-amber-100/50">
                      <p className="text-sm text-slate-500 italic flex items-start gap-1.5">
                        <span className="font-semibold text-amber-700/70 not-italic">Ghi chú:</span>
                        <span className="line-clamp-2">{item.notes}</span>
                      </p>
                    </div>
                  )}
                  
                  <div className="text-amber-600 font-extrabold mt-3 sm:mt-2 text-lg">
                    {formatPrice(item.price)}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-100 sm:border-none">
                  
                  {/* Quantity Adjuster */}
                  <div className="flex items-center bg-slate-50 rounded-full border border-slate-200 shadow-sm overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="p-2 sm:p-2.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 transition-colors"
                      aria-label={`Giảm số lượng của ${item.name}`}
                    >
                      <Minus size={16} strokeWidth={2.5} />
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900 select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="p-2 sm:p-2.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 transition-colors"
                      aria-label={`Tăng số lượng của ${item.name}`}
                    >
                      <Plus size={16} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                    aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Tiếp tục mua hàng
              </Link>
            </div>
          </div>

          {/* ── Right Column: Order Summary (Sticky) ── */}
          <div className="lg:col-span-4 h-full">
            <div className="bg-white rounded-2xl p-6 sm:p-8 sticky top-[104px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                Tóm tắt đơn hàng
              </h2>
              
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Tổng số món</span>
                  <span className="font-bold text-slate-900">{totalItems} món</span>
                </div>
              </div>

              <div className="border-t border-slate-200 border-dashed pt-5 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-slate-900 font-bold text-lg">Tổng cộng</span>
                  <span className="text-3xl font-display font-black text-amber-600 tracking-tight">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 text-right mt-1">Đã bao gồm thuế (nếu có)</p>
              </div>

              <Link
                href="/checkout"
                className={[
                  "flex items-center justify-center w-full py-4 rounded-xl",
                  "bg-green-600 hover:bg-green-700 text-white font-bold text-lg",
                  "shadow-lg hover:shadow-xl",
                  "transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500",
                ].join(" ")}
              >
                Thanh toán ngay
              </Link>

              {/* Trust Badge */}
              <div className="mt-6 flex flex-col gap-2 items-center text-center text-xs text-slate-400">
                <p>Thanh toán an toàn • Bữa ăn chất lượng</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

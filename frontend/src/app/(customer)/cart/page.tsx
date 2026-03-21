"use client";

import axiosClient from "@/lib/axiosClient";
import useCartStore from "@/store/useCartStore";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface OrderItem {
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  notes?: string;
}

// ────────────────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const tableId = useCartStore((s) => s.tableId);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();

  // Local state
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Computed values
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Hydration safety
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

  const handlePlaceOrder = async () => {
    // Validate table ID
    if (!tableId) {
      setSubmitError("Vui lòng quét mã QR tại bàn để hệ thống nhận diện vị trí");
      return;
    }

    if (items.length === 0) {
      setSubmitError("Giỏ hàng trống, vui lòng thêm món ăn");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Map cart items to API format
      const orderItems: OrderItem[] = items.map((item) => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: item.price,
        notes: item.notes || undefined,
      }));

      console.log("Submitting order with payload:", {
        table_id: tableId,
        items: orderItems,
      });

      // Submit order to backend
      const response = await axiosClient.post("/orders", {
        table_id: tableId,
        items: orderItems,
      });

      console.log("Order submission response:", response.data);

      // If Axios resolves without throwing, the request succeeded (2xx status code)
      // Trust the resolution, not strict response.data structure checks
      try {
        // Clear cart after successful order
        clearCart();
        console.log("Cart cleared successfully");
      } catch (clearError) {
        console.error("Error clearing cart (non-blocking):", clearError);
        // Don't fail the order submission if cart clear errors
      }

      setSubmitSuccess(true);

      // Show success feedback and redirect
      setTimeout(() => {
        router.push("/menu");
      }, 1500);
    } catch (error: unknown) {
      console.log("Submit Error Details:", error);
      console.error("Order submission error:", error);

      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string; error?: unknown } };
          message?: string;
        };
        // Log full error response for debugging
        console.error("Full Error Response:", axiosError.response?.data || axiosError.message);
        const errorMsg =
          axiosError.response?.data?.message || "Lỗi khi gửi đơn hàng";
        setSubmitError(errorMsg);
      } else {
        console.error("Network or unknown error:", error);
        setSubmitError("Lỗi kết nối, vui lòng kiểm tra kết nối mạng");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent hydration errors
  if (!mounted) {
    return <div className="min-h-screen bg-neutral-50" />;
  }

  // ── Empty State ─────────────────────────────────────────────────────────────
  if (items.length === 0 && !submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
        <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <ShoppingCart
            size={56}
            className="text-amber-500"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
        {/* h2 automatically uses font-display from globals.css */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-slate-500 mb-8 text-center max-w-md text-lg">
          Chưa có món ăn nào trong giỏ hàng. Hãy khám phá thực đơn và chọn những
          món ăn tuyệt vời nhất nhé!
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

  // ── Success State ────────────────────────────────────────────────────────────
  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {/* h2 automatically uses font-display from globals.css */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
          Đã gửi đơn hàng thành công!
        </h2>
        <p className="text-slate-600 mb-2 text-center max-w-md text-lg">
          Bếp đã nhận được đơn hàng của bạn. Vui lòng chờ đợi món ăn.
        </p>
        <p className="text-sm text-slate-500 text-center mb-8">
          Bạn sẽ được chuyển về thực đơn trong giây lát...
        </p>
      </div>
    );
  }

  // ── Cart Content ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* h1 automatically uses font-display from globals.css */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Giỏ hàng của bạn
          </h1>
          <Link
            href="/menu"
            className="text-sm font-medium text-slate-500 hover:text-amber-600 hover:underline underline-offset-4 transition-colors p-2"
            aria-label="Quay lại Thực đơn"
          >
            Quay lại
          </Link>
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
                  {/* h3 automatically uses font-display from globals.css */}
                  <h3 className="text-xl sm:text-lg font-bold text-slate-900 line-clamp-2">
                    {item.name}
                  </h3>

                  {/* Custom Notes */}
                  {item.notes && (
                    <div className="mt-1.5 p-2 bg-amber-50/50 rounded-lg border border-amber-100/50">
                      <p className="text-sm text-slate-500 italic flex items-start gap-1.5">
                        <span className="font-semibold text-amber-700/70 not-italic">
                          Ghi chú:
                        </span>
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
                      onClick={() =>
                        updateQuantity(item.cartItemId, item.quantity - 1)
                      }
                      className="p-2 sm:p-2.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 transition-colors"
                      aria-label={`Giảm số lượng của ${item.name}`}
                    >
                      <Minus size={16} strokeWidth={2.5} />
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900 select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.cartItemId, item.quantity + 1)
                      }
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
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Tiếp tục chọn món
              </Link>
            </div>
          </div>

          {/* ── Right Column: Order Summary (Sticky) ── */}
          <div className="lg:col-span-4 h-full">
            <div className="bg-white rounded-2xl p-6 sm:p-8 sticky top-[104px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              {/* h2 automatically uses font-display from globals.css */}
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                Tóm tắt đơn hàng
              </h2>

              {/* QR Code Table Validation Banner */}
              {!tableId && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex gap-3">
                  <div className="flex-shrink-0 pt-0.5">
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      Vui lòng quét mã QR tại bàn
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      Hệ thống cần bàn của bạn để xác nhận đơn hàng
                    </p>
                  </div>
                </div>
              )}

              {/* Table Confirmation Badge (Optional) */}
              {tableId && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-xs text-green-700 font-medium">
                    Bàn của bạn đã được xác nhận
                  </p>
                </div>
              )}

              {/* Error message */}
              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">{submitError}</p>
                </div>
              )}

              {/* Order items count */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Tổng số món</span>
                  <span className="font-bold text-slate-900">{totalItems} món</span>
                </div>
              </div>

              {/* Subtotal */}
              <div className="border-t border-slate-200 border-dashed pt-5 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-slate-900 font-bold text-lg">
                    Tổng cộng
                  </span>
                  <span className="text-3xl font-black text-amber-600 tracking-tight">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 text-right mt-1">
                  Đã bao gồm thuế (nếu có)
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || !tableId || items.length === 0}
                className={[
                  "flex items-center justify-center w-full py-4 rounded-xl",
                  "font-bold text-lg",
                  "shadow-lg hover:shadow-xl",
                  "transition-all duration-200 transform",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  "cursor-pointer",
                  isSubmitting || !tableId || items.length === 0
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 active:scale-95 focus-visible:ring-green-500",
                ].join(" ")}
                aria-label="Gửi đơn hàng xuống bếp"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi Bếp"}
              </button>

              {/* Info note */}
              <div className="mt-6 flex flex-col gap-2 items-center text-center text-xs text-slate-400">
                <p>Bếp sẽ nhận và chuẩn bị món ăn của bạn</p>
                <p>Vui lòng chờ phục vụ viên mang món ăn đến bàn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

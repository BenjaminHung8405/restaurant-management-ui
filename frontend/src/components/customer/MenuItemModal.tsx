"use client";

import useCartStore from "@/store/useCartStore";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url?: string;
  area?: string;
  is_featured?: boolean;
}

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem;
}

export default function MenuItemModal({ isOpen, onClose, item }: MenuItemModalProps) {
  const addItem = useCartStore((s) => s.addItem);

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setNotes("");
      setIsSubmitting(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = async () => {
    setIsSubmitting(true);
    try {
      addItem({
        menu_item_id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        quantity,
        notes,
      });

      // Brief success feedback before closing
      await new Promise((resolve) => setTimeout(resolve, 300));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const totalPrice = item.price * quantity;

  const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/images/placeholder-dish.svg";
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1040] bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="fixed inset-0 z-[1050] flex items-end sm:items-center justify-center p-4 sm:p-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Card — Responsive width with max-height constraint */}
        <div
          className={[
            "w-full md:max-w-4xl bg-white",
            "rounded-t-2xl sm:rounded-2xl",
            "shadow-2xl",
            "flex flex-col md:grid md:grid-cols-2",
            "max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh]",
            "animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300",
            "overflow-hidden",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ═══ LEFT COLUMN: IMAGE (Desktop) / Header (Mobile) ═══ */}
          <div className="relative flex-shrink-0 md:flex md:flex-col">
            {/* Close button — positioned absolutely, top-right */}
            <button
              onClick={onClose}
              className={[
                "absolute top-4 right-4 z-20",
                "p-2 rounded-full",
                "bg-white/95 text-slate-600 hover:text-slate-900",
                "hover:bg-white transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                "cursor-pointer shadow-sm",
              ].join(" ")}
              aria-label="Đóng"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            {/* Product Image */}
            <div className="relative h-48 w-full md:h-full bg-slate-100 overflow-hidden rounded-t-2xl md:rounded-t-none md:rounded-l-2xl">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover"
                  onError={onImageError}
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-200" />
              )}

              {/* Price Badge — Only on mobile; on desktop it moves to right column */}
              <div className="absolute bottom-4 left-4 md:hidden bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg">
                <span className="font-bold text-lg">{formatPrice(item.price)}</span>
                <span className="text-xs text-white/80 block">Giá/1 món</span>
              </div>
            </div>
          </div>

          {/* ═══ RIGHT COLUMN: CONTENT (Desktop) / Scrollable Body (Mobile) ═══ */}
          <div className="flex flex-col h-full max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] overflow-hidden">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 md:py-8 space-y-6 pr-4">
              {/* Product Info */}
              <div>
                <h2
                  id="modal-title"
                  className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 leading-tight"
                >
                  {item.name}
                </h2>
                {item.description && (
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Desktop: Price badge in right column */}
              <div className="hidden md:block">
                <div className="inline-flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-600">
                    {formatPrice(item.price)}
                  </span>
                  <span className="text-xs text-slate-400">/1 món</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Số lượng
                </label>
                <div className="flex items-center bg-slate-100 rounded-xl w-fit">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className={[
                      "p-3 rounded-lg transition-colors",
                      quantity <= 1
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-700 hover:text-amber-600",
                    ].join(" ")}
                    aria-label="Giảm số lượng"
                  >
                    <Minus size={18} strokeWidth={2.5} />
                  </button>

                  <span className="px-6 py-2 font-bold text-lg text-slate-900 min-w-[60px] text-center select-none">
                    {quantity}
                  </span>

                  <button
                    onClick={handleIncrement}
                    className="p-3 text-slate-700 hover:text-amber-600 transition-colors rounded-lg"
                    aria-label="Tăng số lượng"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Notes Input — Compact on desktop */}
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-slate-900 mb-3">
                  Ghi chú đặc biệt <span className="text-slate-400">(Tùy chọn)</span>
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ví dụ: Không hành, ít cay..."
                  maxLength={200}
                  rows={2}
                  className={[
                    "w-full px-4 py-3 rounded-xl",
                    "border-2 border-slate-200",
                    "text-slate-900 placeholder:text-slate-400",
                    "focus:border-amber-500 focus:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
                    "resize-none",
                    "transition-colors duration-200",
                    "font-medium text-sm",
                  ].join(" ")}
                />
                <p className="text-xs text-slate-400 mt-1 text-right">
                  {notes.length}/200 ký tự
                </p>
              </div>
            </div>

            {/* Fixed Footer with CTA — Stays at bottom, does not scroll */}
            <div className="flex-shrink-0 border-t border-slate-100 bg-white px-6 py-4 md:py-6 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={isSubmitting}
                className={[
                  "w-full py-4 px-6 rounded-xl",
                  "font-bold text-lg text-white",
                  "shadow-lg hover:shadow-xl",
                  "transition-all duration-200 transform",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500",
                  "cursor-pointer",
                  isSubmitting
                    ? "bg-slate-400 scale-95 opacity-75"
                    : "bg-green-600 hover:bg-green-700 active:scale-95",
                ].join(" ")}
                aria-label={`Thêm ${quantity} ${item.name} vào giỏ hàng`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>Thêm vào giỏ</span>
                  <span className="text-base font-extrabold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

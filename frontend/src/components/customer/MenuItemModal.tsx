"use client";

import { Check, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useCartStore from "@/store/useCartStore";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem;
}

export default function MenuItemModal({
  isOpen,
  onClose,
  item,
}: MenuItemModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
      document.body.style.overflow = "hidden";
    } else if (dialogRef.current) {
      dialogRef.current.close();
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    onClose();
  }, [onClose]);

  const handleAddToCart = async () => {
    setIsSubmitting(true);

    try {
      addItem({
        menu_item_id: item.id,
        name: item.name,
        price: item.price,
        quantity,
        notes: notes.trim() || undefined,
        image_url: item.image_url,
      });

      setQuantity(1);
      setNotes("");
      handleClose();
    } catch (error) {
      console.error("Failed to add item to cart:", error);
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

  const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/images/placeholder-dish.svg";
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 w-full md:max-w-4xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] animate-in slide-in-from-bottom-5 zoom-in-95 duration-300 open:animate-in"
    >
      <div className="flex flex-col h-full max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4 md:py-6">
          {/* h2 automatically uses font-display from globals.css */}
          <h2 className="text-2xl font-bold text-slate-900">
            {item.name}
          </h2>
          <button
            onClick={handleClose}
            className="ml-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto px-6 py-6 md:py-8 space-y-6 pr-4">
          {/* Image */}
          {item.image_url && (
            <div className="relative h-64 w-full bg-slate-100 rounded-xl overflow-hidden">
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover"
                onError={onImageError}
              />
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div>
              <p className="text-slate-600 text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900">
              Số lượng
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                aria-label="Giảm số lượng"
              >
                <Trash2 size={20} />
              </button>
              <span className="w-12 text-center font-bold text-lg text-slate-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                aria-label="Tăng số lượng"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <label
              htmlFor="notes"
              className="text-sm font-semibold text-slate-900"
            >
              Ghi chú thêm (tùy chọn)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 200))}
              placeholder="Ví dụ: Không hành, thêm tương ớt..."
              maxLength={200}
              className={[
                "w-full px-4 py-3 border rounded-lg",
                "font-medium text-sm text-slate-900 placeholder-slate-400",
                "border-slate-200 focus:border-amber-500",
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

        {/* Fixed Footer with CTA */}
        <div className="flex-shrink-0 border-t border-slate-100 bg-white px-6 py-4 md:py-6 mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={isSubmitting}
            className={[
              "w-full py-4 px-6 rounded-xl",
              "font-bold text-lg text-white",
              "shadow-lg hover:shadow-xl",
              "transition-all duration-200 transform",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              isSubmitting
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 active:scale-95 focus-visible:ring-amber-500",
            ].join(" ")}
            aria-label={`Thêm ${item.name} (${quantity} x ${formatPrice(item.price)}) vào giỏ hàng`}
          >
            <div className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <Check size={20} />
                  <span>
                    Thêm vào giỏ — {formatPrice(item.price * quantity)}
                  </span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </dialog>
  );
}

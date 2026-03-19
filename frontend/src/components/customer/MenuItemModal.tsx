"use client";

import useCartStore from "@/store/useCartStore";
import { Check, X } from "lucide-react";
import Image from "next/image";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

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
  onItemAdded: () => void;
  item: MenuItem;
}

export default function MenuItemModal({
  isOpen,
  onClose,
  onItemAdded,
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
      onItemAdded();
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
      className="m-auto p-0 z-50 w-[95vw] sm:w-[90vw] md:w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-in zoom-in-95 duration-200"
      style={{ maxHeight: '90vh' }}
    >
      <div className="flex flex-col md:flex-row w-full h-full max-h-[90vh] bg-white">
        
        {/* Left: Image Section */}
        {item.image_url && (
          <div className="relative w-full h-56 md:min-h-[400px] md:h-auto md:w-1/2 bg-slate-100 flex-shrink-0">
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
              onError={onImageError}
              priority
            />
          </div>
        )}

        {/* Right: Content Section */}
        <div 
          className={`flex flex-col min-h-0 flex-grow bg-white relative ${
            item.image_url ? "w-full md:w-1/2" : "w-full"
          }`}
        >
          
          {/* Fixed Header */}
          <div className="flex-shrink-0 flex items-start justify-between border-b border-slate-100 px-6 py-4 md:py-5">
            <div className="flex-grow">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                {item.name}
              </h2>
              <p className="text-2xl font-bold text-amber-500 mt-2">
                {formatPrice(item.price)}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="ml-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 flex-shrink-0"
              aria-label="Đóng"
            >
              <X size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-grow overflow-y-auto px-6 py-6 space-y-5 pr-4">
            
            {/* Description */}
            {item.description && (
              <div>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl">
              <label className="text-sm font-semibold text-slate-900 block">
                Số lượng
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 rounded-lg bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label="Giảm số lượng"
                >
                  −
                </button>
                <div className="flex-grow">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, val));
                    }}
                    className="w-full text-center px-3 py-2 font-bold text-lg text-slate-900 bg-white border-2 border-slate-200 rounded-lg focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500"
                    min="1"
                  />
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label="Tăng số lượng"
                >
                  +
                </button>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <label
                htmlFor="notes"
                className="text-sm font-semibold text-slate-900 block"
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
                  "w-full px-4 py-3 border-2 border-slate-200 rounded-lg",
                  "text-sm text-slate-900 placeholder-slate-400",
                  "focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-0",
                  "resize-none",
                  "transition-colors duration-200",
                  "bg-white",
                ].join(" ")}
                rows={3}
              />
              <p className="text-xs text-slate-400 text-right">
                {notes.length}/200 ký tự
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Đơn giá:</span>
                <span className="font-semibold text-slate-900">{formatPrice(item.price)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Số lượng:</span>
                <span className="font-semibold text-slate-900">{quantity}x</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                <span className="font-bold text-slate-900">Tổng cộng:</span>
                <span className="text-xl font-bold text-amber-500">{formatPrice(item.price * quantity)}</span>
              </div>
            </div>
          </div>

          {/* Fixed Footer with CTA */}
          <div className="flex-shrink-0 border-t border-slate-100 bg-white px-6 py-4">
            <button
              onClick={handleAddToCart}
              disabled={isSubmitting}
              className={[
                "w-full py-3 px-6 rounded-xl",
                "font-bold text-base text-white",
                "shadow-lg hover:shadow-xl",
                "transition-all duration-200 transform",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                isSubmitting
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-600 active:scale-95 focus-visible:ring-amber-500",
              ].join(" ")}
              aria-label={`Thêm ${item.name} vào giỏ hàng`}
            >
              <div className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    <span>Thêm vào giỏ</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

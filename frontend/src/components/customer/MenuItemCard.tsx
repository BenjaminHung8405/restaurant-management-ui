"use client";

import MenuItemModal from "@/components/customer/MenuItemModal";
import { Plus, ShoppingCart, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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

interface MenuItemCardProps {
  item: MenuItem;
  isFeatured?: boolean;
}

export default function MenuItemCard({
  item,
  isFeatured = false,
}: MenuItemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasRecentlyAdded, setHasRecentlyAdded] = useState(false);

  const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/images/placeholder-dish.svg";
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleItemAdded = () => {
    setIsModalOpen(false);
    setHasRecentlyAdded(true);
    setTimeout(() => setHasRecentlyAdded(false), 2000);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <>
      <div className="group relative bg-white flex flex-col h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100">
        {/* Image Container */}
        <div className="relative h-56 bg-slate-200 overflow-hidden">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={onImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <UtensilsCrossed
                size={32}
                className="text-slate-300"
                aria-hidden="true"
              />
            </div>
          )}

          {/* Featured Badge */}
          {isFeatured && (
            <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              ⭐ Đặc biệt
            </div>
          )}

          {/* Dark Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

          {/* Floating Add Button */}
          <button
            onClick={handleOpenModal}
            aria-label={`Tùy chỉnh và thêm ${item.name} vào giỏ hàng`}
            className={[
              "absolute inset-0 m-auto",
              "w-14 h-14 rounded-full",
              "flex items-center justify-center",
              "transition-all duration-200 transform",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-amber-500",
              "cursor-pointer",
              hasRecentlyAdded
                ? "bg-green-500 hover:bg-green-600 shadow-2xl scale-110"
                : "bg-amber-500 hover:bg-amber-600 shadow-xl group-hover:scale-125",
              "opacity-0 group-hover:opacity-100",
            ].join(" ")}
          >
            {hasRecentlyAdded ? (
              <ShoppingCart
                size={24}
                className="text-white"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            ) : (
              <Plus
                size={28}
                className="text-white"
                strokeWidth={3}
                aria-hidden="true"
              />
            )}
          </button>
        </div>

        {/* Content Container */}
        <div className="p-5 flex flex-col flex-grow">
          {/* h3 automatically uses font-display from globals.css */}
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
            {item.name}
          </h3>

          {item.description && (
            <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">
              {item.description}
            </p>
          )}

          {/* Price + Area Badge Row */}
          <div className="flex items-center justify-between gap-2 py-4 mb-4 border-t border-slate-100 mt-auto">
            <span className="text-2xl font-extrabold text-amber-600">
              {item.price ? formatPrice(item.price) : "Liên hệ"}
            </span>
            {item.area && (
              <span className="inline-block px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg whitespace-nowrap">
                {item.area}
              </span>
            )}
          </div>

          {/* Bottom CTA Button */}
          <button
            onClick={handleOpenModal}
            className={[
              "w-full py-3 rounded-xl font-bold text-base shadow-md",
              "flex items-center justify-center gap-2 mt-auto",
              "transition-all duration-300 ease-in-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              hasRecentlyAdded
                ? "bg-green-600 hover:bg-green-700 text-white focus-visible:ring-green-500 scale-100"
                : "bg-amber-500 hover:bg-amber-600 text-white focus-visible:ring-amber-500 group-hover:-translate-y-1 group-hover:shadow-xl active:scale-95",
            ].join(" ")}
            aria-label={`Tùy chỉnh và thêm ${item.name} vào giỏ hàng`}
          >
            {hasRecentlyAdded ? (
              <>
                <ShoppingCart
                  size={20}
                  className="animate-bounce"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span>Đã thêm vào giỏ</span>
              </>
            ) : (
              <>
                <Plus size={20} strokeWidth={3} aria-hidden="true" />
                <span>Tùy chỉnh & Thêm</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Item Customization Modal */}
      <MenuItemModal isOpen={isModalOpen} onClose={handleCloseModal} onItemAdded={handleItemAdded} item={item} />
    </>
  );
}
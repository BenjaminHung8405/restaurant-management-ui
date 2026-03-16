"use client";

import axiosClient from "@/lib/axiosClient";
import { AlertCircle, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id: string;
  area?: string;
  is_available: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: unknown | null;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const CATEGORY_ALL = "ALL";

// ── Utility Functions ──────────────────────────────────────────────────────────

/**
 * Format price as Vietnamese Dong (VND)
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

function SearchBar({ value, onChange, isLoading }: SearchBarProps) {
  return (
    <div className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading}
            className={[
              "w-full pl-10 pr-4 py-3 rounded-lg",
              "border border-neutral-200",
              "text-neutral-900 placeholder-neutral-400",
              "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
              "transition-all duration-[200ms]",
              isLoading && "opacity-50 cursor-not-allowed",
            ].join(" ")}
          />
        </div>
      </div>
    </div>
  );
}

interface CategoryPillProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
  isLoading: boolean;
}

function CategoryPill({ name, isActive, onClick, isLoading }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={[
        "px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap",
        "transition-all duration-[200ms] ease-smooth",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isActive
          ? "bg-orange-500 text-white shadow-md hover:shadow-lg hover:bg-orange-600"
          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
      ].join(" ")}
    >
      {name}
    </button>
  );
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  isLoading: boolean;
}

function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading,
}: CategoryFilterProps) {
  return (
    <div className="bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <CategoryPill
            name="Tất cả"
            isActive={selectedCategory === CATEGORY_ALL}
            onClick={() => onSelectCategory(CATEGORY_ALL)}
            isLoading={isLoading}
          />
          {categories.map((category) => (
            <CategoryPill
              key={category.id}
              name={category.name}
              isActive={selectedCategory === category.id}
              onClick={() => onSelectCategory(category.id)}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface MenuItemCardProps {
  item: MenuItem;
}

function MenuItemCard({ item }: MenuItemCardProps) {
  const imageSrc = item.image_url || "/images/placeholder-dish.svg";

  return (
    <div
      className={[
        "group flex flex-col h-full rounded-2xl overflow-hidden",
        "bg-white border border-neutral-100",
        "shadow-card hover:shadow-card-hover",
        "transition-all duration-[250ms] ease-smooth",
        "hover:-translate-y-1",
        !item.is_available && "opacity-60",
      ].join(" ")}
    >
      {/* Image Container */}
      <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-neutral-100">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-[350ms]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {!item.is_available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-neutral-900 text-white px-3 py-1 rounded-full text-sm font-medium">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Name */}
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-[200ms]">
          {item.name}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-neutral-600 mb-4 line-clamp-2 flex-1">
            {item.description}
          </p>
        )}

        {/* Area Badge (optional) */}
        {item.area && (
          <div className="mb-3">
            <span className="inline-block px-2.5 py-1 text-xs font-medium bg-orange-50 text-orange-700 rounded-lg">
              {item.area}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="pt-3 border-t border-neutral-100">
          <p className="text-xl sm:text-2xl font-bold text-orange-600">
            {formatPrice(item.price)}
          </p>
        </div>
      </div>
    </div>
  );
}

interface MenuGridProps {
  items: MenuItem[];
  isLoading: boolean;
}

function MenuGrid({ items, isLoading }: MenuGridProps) {
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden bg-neutral-200 animate-pulse h-96"
            />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 p-3 bg-neutral-100 rounded-full">
            <AlertCircle size={32} className="text-neutral-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            Không tìm thấy món ăn
          </h3>
          <p className="text-neutral-500 max-w-sm">
            Xin lỗi, không có sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────────

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORY_ALL);

  // ── Fetch categories on mount ──────────────────────────────────────────────

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get<unknown, ApiResponse<Category[]>>(
          "/categories"
        );
        setCategories(response.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ── Fetch menu items when selectedCategory changes ────────────────────────

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        let url = "/menu-items";

        // Append categoryId query param if not "ALL"
        if (selectedCategory !== CATEGORY_ALL) {
          url += `?categoryId=${selectedCategory}`;
        }

        const response = await axiosClient.get<unknown, ApiResponse<MenuItem[]>>(url);
        setMenuItems(response.data || []);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        setMenuItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [selectedCategory]);

  // ── Filter menu items based on search query ────────────────────────────────

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        isLoading={isLoading}
      />

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isLoading={isLoading}
      />

      {/* Menu Grid */}
      <MenuGrid items={filteredItems} isLoading={isLoading} />
    </div>
  );
}

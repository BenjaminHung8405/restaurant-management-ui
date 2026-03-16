"use client";

import axiosClient from "@/lib/axiosClient";
import { AlertCircle, Search, Star, ChefHat, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./menu.css";

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
  is_featured?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: unknown | null;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const CATEGORY_ALL = "ALL";
const MAX_WIDTH = "1280px"; // Updated: Design System — increase from 800px to 1280px for better desktop utilization

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

/**
 * Container wrapper with design system max-width (1280px)
 */
function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      style={{ maxWidth: MAX_WIDTH }}
      className={`mx-auto px-4 sm:px-6 lg:px-8 w-full ${className}`}
    >
      {children}
    </div>
  );
}

// ── Component: Hero Section (Section 1) ────────────────────────────────────────

interface HeroSectionProps {
  categoriesLoading: boolean;
}

function HeroSection({ categoriesLoading }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white pt-10 pb-8 sm:pt-14 sm:pb-12">
      <Container>
        {/* Hero Headline */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <UtensilsCrossed size={32} className="text-amber-500" aria-hidden="true" />
            <h1 className="text-3xl sm:text-4xl font-bold">Thực Đơn Nhà Hàng</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl">
            Khám phá bộ sưu tập các món ăn ngon lành được chuẩn bị tươi mới hàng ngày từ bếp
            của chúng tôi. Mỗi món ăn được chế biến cẩn thận với yêu thương.
          </p>
        </div>

        {/* Benefit Bullets (3 max) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <Star size={20} className="text-amber-500 flex-shrink-0 mt-1" aria-hidden="true" />
            <div>
              <p className="font-semibold text-slate-900">Tươi & Chất Lượng</p>
              <p className="text-sm text-slate-600">Nguyên liệu tốt nhất, chế biến cẩn thận</p>
            </div>
          </div>
          <div className="flex gap-3">
            <ChefHat size={20} className="text-amber-500 flex-shrink-0 mt-1" aria-hidden="true" />
            <div>
              <p className="font-semibold text-slate-900">Bếp Trưởng Gợi Ý</p>
              <p className="text-sm text-slate-600">Những món đặc biệt được bếp chọn lọc</p>
            </div>
          </div>
          <div className="flex gap-3">
            <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-1" aria-hidden="true" />
            <div>
              <p className="font-semibold text-slate-900">Giá Công Khai</p>
              <p className="text-sm text-slate-600">Không ẩn giấu, thông tin rõ ràng</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ── Component: Search Bar ──────────────────────────────────────────────────────

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

function SearchBar({ value, onChange, isLoading }: SearchBarProps) {
  return (
    <div className="sticky top-16 z-30 bg-white shadow-sm border-b border-slate-100">
      <Container className="py-4 sm:py-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading}
            className="input pl-10 w-full"
            aria-label="Tìm kiếm món ăn"
            inputMode="text"
          />
        </div>
      </Container>
    </div>
  );
}

// ── Component: Category Filter (Section 2) ────────────────────────────────────

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
    <section className="bg-white border-b border-slate-100">
      <Container className="py-6">
        <p className="text-sm text-slate-600 mb-4 font-medium">Lọc theo loại món:</p>
        <div className="flex flex-wrap gap-3">
          {/* All Categories Button */}
          <button
            onClick={() => onSelectCategory(CATEGORY_ALL)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer ${
              selectedCategory === CATEGORY_ALL
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            type="button"
          >
            Tất cả
          </button>

          {/* Category Buttons */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer ${
                selectedCategory === category.id
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ── Component: Menu Item Card ──────────────────────────────────────────────────

interface MenuItemCardProps {
  item: MenuItem;
  isFeatured?: boolean;
}

function MenuItemCard({ item, isFeatured = false }: MenuItemCardProps) {
  const imageSrc = item.image_url || "/images/placeholder-dish.svg";

  return (
    <div
      className={`card bg-white overflow-hidden h-full flex flex-col cursor-pointer ${
        !item.is_available ? "opacity-60" : ""
      }`}
    >
      {/* Image Container */}
      <div className="relative w-full h-40 sm:h-48 overflow-hidden bg-slate-100">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder-dish.svg";
          }}
        />
        {!item.is_available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-sm font-medium">
              Hết hàng
            </span>
          </div>
        )}

        {isFeatured && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 shadow-lg">
            <Star size={14} fill="currentColor" aria-hidden="true" />
            <span className="text-xs font-semibold">Đặc biệt</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-4">
        {/* Name */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 line-clamp-2">
          {item.name}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2 flex-1">{item.description}</p>
        )}

        {/* Area Badge */}
        {item.area && (
          <div className="mb-3">
            <span className="inline-block px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-lg">
              {item.area}
            </span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between gap-3">
          <p className="text-lg sm:text-xl font-bold text-amber-600">
            {formatPrice(item.price)}
          </p>
          <button
            disabled={!item.is_available}
            className={`px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
              item.is_available
                ? "btn-primary bg-amber-500 text-white hover:bg-amber-600 cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
            type="button"
          >
            Đặt ngay
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Component: Menu Grid (Section 3: Benefits / Menu List) ─────────────────────

interface MenuGridProps {
  items: MenuItem[];
  featuredItems: MenuItem[];
  isLoading: boolean;
}

function MenuGrid({ items, featuredItems, isLoading }: MenuGridProps) {
  if (isLoading) {
    return (
      <section className="bg-white py-8 sm:py-12">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden bg-slate-200 animate-pulse h-64"
              />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 p-3 bg-slate-100 rounded-full">
              <AlertCircle size={32} className="text-slate-400" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Không tìm thấy món ăn
            </h3>
            <p className="text-slate-600">
              Xin lỗi, không có sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-white py-8 sm:py-12">
      <Container>
        {/* Featured Items Section */}
        {featuredItems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ChefHat size={24} className="text-amber-500" aria-hidden="true" />
              Bếp Trưởng Gợi Ý
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {featuredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} isFeatured={true} />
              ))}
            </div>
          </div>
        )}

        {/* All Menu Items */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Tất Cả Món Ăn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// ── Component: CTA Section (Section 4) ──────────────────────────────────────────

function CTASection() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-12 sm:py-16">
      <Container>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Sẵn Sàng Đặt Hàng?
          </h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Chọn những món yêu thích của bạn từ menu ở trên và thêm vào giỏ hàng.
          </p>
          <button
            className="btn-primary bg-amber-500 text-white px-8 py-3 text-lg font-semibold rounded-lg hover:bg-amber-600 transition-all duration-200"
            type="button"
          >
            Xem Giỏ Hàng
          </button>
        </div>
      </Container>
    </section>
  );
}

// ── Component: Footer (Section 5) ───────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 sm:py-12">
      <Container>
        <div className="text-center text-sm">
          <p className="mb-2">&copy; 2026 Nhà Hàng. Tất cả quyền được bảo lưu.</p>
          <p>Địa chỉ: 123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
        </div>
      </Container>
    </footer>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────────

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORY_ALL);

  // ── Fetch categories on mount ──────────────────────────────────────────────

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
        const response: any = await axiosClient.get("/categories");
        console.log("Categories response:", response);
        // axiosClient response interceptor returns response.data directly
        setCategories(response?.data || []);
      } catch (error: any) {
        console.error("Failed to fetch categories - Error object:", error);
        console.error("Error status:", error?.status);
        console.error("Error message:", error?.message);
        console.error("Error data:", error?.data);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ── Fetch featured items on mount ──────────────────────────────────────────

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response: any = await axiosClient.get("/menu-items?isFeatured=true");
        setFeaturedItems(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch featured items:", error);
        setFeaturedItems([]);
      }
    };

    fetchFeaturedItems();
  }, []);

  // ── Fetch menu items when selectedCategory changes ────────────────────────

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        let url = "/menu-items";

        if (selectedCategory !== CATEGORY_ALL) {
          url += `?categoryId=${selectedCategory}`;
        }

        const response: any = await axiosClient.get(url);
        setMenuItems(response?.data || []);
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

  const filteredFeatured = featuredItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Headline (HeroSection) */}
      <HeroSection categoriesLoading={isLoading} />

      {/* 2. Short Description (SearchBar) */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        isLoading={isLoading}
      />

      {/* 3. Benefit Bullets / Category Filter (CategoryFilter) */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isLoading={isLoading}
      />

      {/* 4. CTA Context / Menu Grid (MenuGrid) */}
      <MenuGrid
        items={filteredItems}
        featuredItems={filteredFeatured}
        isLoading={isLoading}
      />

      {/* 5. CTA Section */}
      <CTASection />

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}

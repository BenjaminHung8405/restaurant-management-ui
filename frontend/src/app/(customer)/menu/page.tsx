"use client";

import FloatingCartBar from "@/components/customer/FloatingCartBar";
import MenuItemCard from "@/components/customer/MenuItemCard";
import axiosClient from "@/lib/axiosClient";
import useCartStore from "@/store/useCartStore";
import {
    AlertCircle,
    ChefHat,
    ChevronLeft,
    ChevronRight,
    Search,
    Star,
    UtensilsCrossed,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "./menu.css";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
}

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

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const CATEGORY_ALL = "ALL";
const MAX_WIDTH = "1280px";

// ── Utility Functions ──────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{ maxWidth: MAX_WIDTH }}
      className={`mx-auto px-4 sm:px-6 lg:px-8 w-full ${className}`}
    >
      {children}
    </div>
  );
}

// ── Component: Hero Section ────────────────────────────────────────────────────

interface HeroSectionProps {
  categoriesLoading: boolean;
}

function HeroSection({ categoriesLoading }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white pt-10 pb-8 sm:pt-14 sm:pb-12">
      <Container>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <UtensilsCrossed
              size={32}
              className="text-amber-500"
              aria-hidden="true"
            />
            {/* h1 automatically uses font-display from globals.css */}
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Thực Đơn Nhà Hàng
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl">
            Khám phá bộ sưu tập các món ăn ngon lành được chuẩn bị tươi mới hàng
            ngày từ bếp của chúng tôi. Mỗi món ăn được chế biến cẩn thận với
            yêu thương.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <Star
              size={20}
              className="text-amber-500 flex-shrink-0 mt-1"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-slate-900">Tươi & Chất Lượng</p>
              <p className="text-sm text-slate-600">
                Nguyên liệu tốt nhất, chế biến cẩn thận
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <ChefHat
              size={20}
              className="text-amber-500 flex-shrink-0 mt-1"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-slate-900">Bếp Trưởng Gợi Ý</p>
              <p className="text-sm text-slate-600">
                Những món ăn được thực khách yêu thích nhất
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <AlertCircle
              size={20}
              className="text-amber-500 flex-shrink-0 mt-1"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-slate-900">Giá Công Khai</p>
              <p className="text-sm text-slate-600">
                Không ẩn giấu, thông tin rõ ràng
              </p>
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
    <section className="bg-white border-b border-slate-100">
      <Container className="py-6">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
          />
        </div>
      </Container>
    </section>
  );
}

// ── Component: Category Filter ─────────────────────────────────────────────────

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  isLoading: boolean;
}

function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading,
}: CategoryFilterProps) {
  return (
    <section className="bg-white border-b border-slate-100 sticky top-16 z-40">
      <Container className="py-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => onSelectCategory(CATEGORY_ALL)}
            disabled={isLoading}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              selectedCategory === CATEGORY_ALL
                ? "bg-amber-500 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            } disabled:opacity-50`}
          >
            Tất Cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              disabled={isLoading}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-amber-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              } disabled:opacity-50`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ── Component: Featured Items Carousel ─────────────────────────────────────────

interface FeaturedCarouselProps {
  items: MenuItem[];
  isLoading: boolean;
}

function FeaturedCarousel({ items, isLoading }: FeaturedCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ChefHat
            size={24}
            className="text-amber-500"
            aria-hidden="true"
          />
          Bếp Trưởng Gợi Ý
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-[85vw] sm:w-[320px] flex-shrink-0 h-80 bg-slate-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ChefHat
            size={24}
            className="text-amber-500"
            aria-hidden="true"
          />
          Bếp Trưởng Gợi Ý
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            aria-label="Cuộn trái"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            aria-label="Cuộn phải"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal scrolling carousel */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 py-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="w-[85vw] sm:w-[320px] flex-shrink-0 snap-start"
          >
            <MenuItemCard item={item} isFeatured={true} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Component: Menu Grid (Grouped or Single) ───────────────────────────────────

interface MenuGridProps {
  items: MenuItem[];
  isLoading: boolean;
  selectedCategory: string;
  categories: Category[];
}

function MenuGrid({
  items,
  isLoading,
  selectedCategory,
  categories,
}: MenuGridProps) {
  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-96 bg-slate-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="py-12 bg-white">
        <Container>
          <div className="text-center">
            <p className="text-lg text-slate-600">Không tìm thấy món ăn nào</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <Container>
        {selectedCategory === CATEGORY_ALL ? (
          /* Grouped view — show categories with headers */
          <div>
            {categories.map((category) => {
              const itemsInCategory = items.filter(
                (item) => item.category_id === category.id
              );

              if (itemsInCategory.length === 0) return null;

              return (
                <div key={category.id} className="mb-12">
                  {/* h2 automatically uses font-display from globals.css */}
                  <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-6 pb-2 border-b-2 border-amber-200">
                    {category.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {itemsInCategory.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Single Category View */
          <div>
            {/* h2 automatically uses font-display from globals.css */}
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {categories.find((c) => c.id === selectedCategory)?.name ||
                "Tất Cả Món Ăn"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

// ── Component: CTA Section ────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="bg-amber-50 py-12 sm:py-16">
      <Container>
        <div className="text-center">
          {/* h2 automatically uses font-display from globals.css */}
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Sẵn sàng đặt hàng?
          </h2>
          <p className="text-lg text-slate-600 mb-6">
            Khám phá toàn bộ thực đơn và đặt món ăn yêu thích của bạn ngay hôm
            nay.
          </p>
        </div>
      </Container>
    </section>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────────

export default function MenuPage() {
  const searchParams = useSearchParams();
  const setTableId = useCartStore((s) => s.setTableId);

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORY_ALL);

  // Capture table_id from URL parameter and persist to store
  useEffect(() => {
    const tableIdFromUrl = searchParams.get("table_id");
    if (tableIdFromUrl) {
      setTableId(tableIdFromUrl);
    }
  }, [searchParams, setTableId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response: any = await axiosClient.get("/categories");
        setCategories(response?.data || []);
      } catch (error: any) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response: any = await axiosClient.get(
          "/menu-items?isFeatured=true"
        );
        setFeaturedItems(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch featured items:", error);
        setFeaturedItems([]);
      }
    };

    fetchFeaturedItems();
  }, []);

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

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeatured = featuredItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === CATEGORY_ALL || item.category_id === selectedCategory)
  );

  return (
    <div className="min-h-screen bg-white">
      <HeroSection categoriesLoading={isLoading} />
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        isLoading={isLoading}
      />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isLoading={isLoading}
      />

      {filteredFeatured.length > 0 && (
        <section className="bg-white py-8 sm:py-12">
          <Container>
            <FeaturedCarousel items={filteredFeatured} isLoading={isLoading} />
          </Container>
        </section>
      )}

      <MenuGrid
        items={filteredItems}
        isLoading={isLoading}
        selectedCategory={selectedCategory}
        categories={categories}
      />

      <CTASection />

      <FloatingCartBar />
    </div>
  );
}

// ── Static data for landing page ──────────────────────────────────────────────
// This file contains all hardcoded content for the customer landing page.
// Data is organized by section for easy maintenance and future API migration.

import type { LucideIcon } from "lucide-react";
import { ChefHat, Leaf, Utensils } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FeatureItem {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface DishPreview {
  id: string | number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
}

// ── Features Section ──────────────────────────────────────────────────────────

export const FEATURES: FeatureItem[] = [
  {
    id: 1,
    icon: Leaf,
    title: "Nguyên liệu tươi sạch",
    description:
      "100% nguyên liệu được tuyển chọn từ các nông trại hữu cơ, đảm bảo tươi mới mỗi ngày.",
  },
  {
    id: 2,
    icon: ChefHat,
    title: "Đầu bếp chuẩn sao",
    description:
      "Đội ngũ đầu bếp 5 sao với hơn 15 năm kinh nghiệm, mang đến hương vị đỉnh cao.",
  },
  {
    id: 3,
    icon: Utensils,
    title: "Không gian sang trọng",
    description:
      "Thiết kế nội thất hiện đại, ấm cúng — lý tưởng cho mọi dịp đặc biệt của bạn.",
  },
];

// ── Hero Section Data ─────────────────────────────────────────────────────────

export const HERO = {
  badge: "Nhà hàng số 1 Long Xuyên",
  headline: {
    part1: "Hương Vị",
    highlight: "Đích Thực",
    part2: ", Trải Nghiệm",
    emphasis: "Tuyệt Vời",
  },
  description:
    "Khám phá không gian ẩm thực đỉnh cao và những món ăn đậm đà bản sắc ngay giữa lòng Long Xuyên.",
  cta: {
    primary: "Xem Thực Đơn",
    secondary: "Đặt Bàn",
  },
  socialProof: {
    rating: 4.9,
    reviewCount: 2400,
    dishCount: 500,
    yearsExperience: 10,
  },
} as const;

// ── Features Section Meta ─────────────────────────────────────────────────────

export const FEATURES_SECTION = {
  label: "Tại sao chọn chúng tôi?",
  heading: "Cam kết chất lượng mỗi ngày",
} as const;

// ── Dishes Section Meta ───────────────────────────────────────────────────────

export const DISHES_SECTION = {
  label: "Thực đơn nổi bật",
  heading: "Món Ngon Nổi Bật",
  description:
    "Những món ăn được thực khách yêu thích nhất, chế biến từ nguyên liệu tươi ngon mỗi ngày.",
  cta: "Xem Toàn Bộ Thực Đơn",
} as const;

// ── Featured Dishes (Fallback Mock Data) ──────────────────────────────────────

export const DISHES: DishPreview[] = [
  {
    id: "1",
    name: "Phở bò tái",
    description:
      "Phở bò truyền thống nước dùng đậm đà, thơm lừng, ăn kèm giá và rau thơm.",
    price: "75000",
    imageUrl:
      "https://images.unsplash.com/photo-1525521999609-27722d3e63e8?w=500&h=400&fit=crop",
    imageAlt: "Phở bò tái",
  },
  {
    id: "2",
    name: "Gỏi cuốn tôm",
    description:
      "Gỏi cuốn tôm tươi với khoai sọ, rau thơm, bánh tráng cuốn vàng ăn kèm nước mắm chua ngọt.",
    price: "42000",
    imageUrl:
      "https://images.unsplash.com/photo-1609501676725-7186f017a4b1?w=500&h=400&fit=crop",
    imageAlt: "Gỏi cuốn tôm",
  },
  {
    id: "3",
    name: "Chè ba màu",
    description:
      "Chè ba màu đặc biệt với đậu đỏ, đậu xanh, sắn dây cơm, nước cốt dừa thơm ngon.",
    price: "35000",
    imageUrl:
      "https://images.unsplash.com/photo-1563805042-7684c019e157?w=500&h=400&fit=crop",
    imageAlt: "Chè ba màu",
  },
];

// ── CTA Banner Section ────────────────────────────────────────────────────────

export const CTA_BANNER = {
  headline: {
    part1: "Sẵn sàng cho một bữa tối",
    highlight: "khó quên?",
  },
  description:
    "Đặt bàn ngay hôm nay và nhận ưu đãi giảm 15% cho lần đầu tiên — chỉ có tại RestoMS Long Xuyên.",
  cta: {
    primary: "Khám Phá Menu",
    secondary: "Gọi Đặt Bàn",
    phone: "tel:+842801234567",
  },
  trust: "Không cần thẻ tín dụng · Đặt bàn miễn phí · Huỷ bất cứ lúc nào",
} as const;

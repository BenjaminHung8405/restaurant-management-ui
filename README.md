# Restaurant Management System - Frontend UI

Một ứng dụng web giao diện người dùng (Frontend) hiện đại và phản hồi nhanh (responsive) dành cho Hệ thống Quản lý Nhà hàng. Dự án này được xây dựng với **Next.js 14+ (App Router)**, **TypeScript**, và **Tailwind CSS**, tuân thủ nguyên tắc Clean Architecture.

Dự án bao gồm hai phân hệ (domains) chính:
1. **Customer-facing Site** (`(customer)`): Giao diện dành cho khách hàng với trải nghiệm UI/UX thân thiện, cho phép xem thực đơn, chọn món và quản lý giỏ hàng.
2. **Admin/Staff Dashboard** (`(admin)`): Giao diện quản trị viên đầy đủ tính năng với thiết kế Data-Dense, giúp quản lý đơn hàng, thực đơn và xem báo cáo.

---

## 🚀 Công nghệ sử dụng (Tech Stack)

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
- **UI/Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Quản lý State:** [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) (Đặc biệt cho Shopping Cart)
- **Data Fetching:** Axios
- **Form & Validation:** React Hook Form + Zod
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 📁 Cấu trúc thư mục (Folder Structure)

Được thiết kế dựa theo nguyên tắc chia nhỏ domain:

```
frontend/
├── src/
│   ├── app/
│   │   ├── (admin)/        # Các trang dành riêng cho Admin/Staff
│   │   ├── (customer)/     # Các trang dành riêng cho Khách hàng
│   │   ├── globals.css     # CSS toàn cục & biến Tailwind
│   │   └── layout.tsx      # Root layout
│   ├── components/
│   │   ├── admin/          # Component riêng cho giao diện Admin
│   │   ├── common/         # Component dùng chung (Button, Input, Modal, ...)
│   │   └── customer/       # Component riêng cho giao diện Khách hàng
│   ├── config/             # Cấu hình hệ thống, env variables
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities, axiosClient, helper functions
│   ├── services/           # Định nghĩa các API calls (Tất cả logic fetch data)
│   └── store/              # Zustand stores (ví dụ: useCartStore.ts)
└── public/                 # Chứa hình ảnh, fonts, svg...
```

---

## 💻 Trạng thái Giỏ hàng (Global Cart State)

Dự án sử dụng **Zustand** kết hợp với **localStorage Persistence** để quản lý giỏ hàng cho khách. 
Các tính năng nổi bật:
- Hỗ trợ lưu trữ riêng biệt các món ăn giống nhau nhưng có **ghi chú tùy chỉnh** khác nhau (ví dụ: "chưa cay" và "nhiều hành").
- Tự động xóa món khi số lượng giảm xuống 0.
- Mã định danh UUID độc lập cho từng mục.

👉 **Chi tiết sử dụng:** Tham khảo [Tài liệu Giỏ hàng](./frontend/QUICK_START_CART.md) & API trong `frontend/src/store/CART_STORE_USAGE.md`.

---

## ⚙️ Hướng dẫn cài đặt & Chạy dự án

### Yêu cầu hệ thống (Prerequisites)
- [Node.js](https://nodejs.org/en/) 18 LTS trở lên
- npm hoặc yarn, pnpm

### Cài đặt
1. Mở terminal và di chuyển vào thư mục `frontend/`:
   ```bash
   cd frontend
   ```
2. Cài đặt các thư viện (Dependencies):
   ```bash
   npm install
   ```

### Biến môi trường (Environment Variables)
Tạo tệp `.env.local` ở thư mục `frontend/` với các biến định tuyến cơ bản:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Chạy ứng dụng (Development)
```bash
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: [http://localhost:3000](http://localhost:3000)

---

## 🎨 Design System & UI Rules

Dự án tuân thủ chặt chẽ tài liệu Design System được định nghĩa tại:
- Thực thi chung: `.github/design-system/restaurant-management-system/MASTER.md`
- Override cho Admin: `.github/design-system/restaurant-management-system/pages/admin.md`
- Override cho Customer: `.github/design-system/restaurant-management-system/pages/customer.md`

### Nguyên tắc Code UI nổi bật:
- Ngôn ngữ: Văn bản giao diện người dùng (UI text) luôn bằng tiếng Việt, trong khi biến, component và bình luận dùng tiếng Anh.
- Server Components (RSC): Mặc định ưu tiên Server Components. Chỉ sử dụng `"use client"` khi thực sự cần (hooks, event listeners, Zustand).
- Trạng thái tải: Tích hợp tích cực tính năng `loading.tsx` với skeleton loader, `error.tsx`, và `not-found.tsx` của Next.js App Router.

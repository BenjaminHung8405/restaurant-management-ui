import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default:  "RestoMS — Nhà Hàng Long Xuyên",
    template: "%s | RestoMS",
  },
  description:
    "Khám phá không gian ẩm thực đỉnh cao và những món ăn đậm đà bản sắc ngay giữa lòng Long Xuyên.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

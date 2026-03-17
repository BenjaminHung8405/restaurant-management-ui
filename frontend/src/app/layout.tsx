import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// ── Load Inter from Google Fonts with CSS variable ────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

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
    <html lang="vi" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

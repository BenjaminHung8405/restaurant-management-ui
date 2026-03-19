import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// ── Font Configuration ─────────────────────────────────────────────────────────
// These are the ONLY fonts loaded in the app. Everything inherits from these.
// CSS variables are injected into <body> for universal availability.

const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "RestoMS — Nhà Hàng Long Xuyên",
    template: "%s | RestoMS",
  },
  description:
    "Khám phá không gian ẩm thực đỉnh cao và những món ăn đậm đà bản sắc ngay giữa lòng Long Xuyên.",
};

/**
 * RootLayout — Global font injection point.
 *
 * CRITICAL: Both fontSans and fontDisplay CSS variables are injected here.
 * All downstream components inherit these fonts via Tailwind's font-sans and font-display.
 * NO other fonts are loaded anywhere in the app.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body className={`${fontSans.variable} ${fontDisplay.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

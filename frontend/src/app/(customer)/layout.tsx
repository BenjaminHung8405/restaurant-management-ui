import Footer from "@/components/customer/Footer";
import FloatingCartBar from "@/components/customer/FloatingCartBar";
import Navbar from "@/components/customer/Navbar";
import CustomerLayoutClient from "./layout-client";

/**
 * CustomerLayout — Next.js App Router layout for the (customer) route group.
 *
 * Structure:
 *   - Sticky <Navbar /> at the top
 *   - <main> flex-grows to fill remaining height
 *   - <Footer /> pinned to bottom
 *   - <FloatingCartBar /> overlays at bottom when cart has items
 *   - <CustomerLayoutClient /> wrapper for client-side logic (cart expiry check)
 *
 * Background follows customer.md: #f8fafc (surface-muted)
 *
 * @param {{ children: React.ReactNode }} props
 */
export default function CustomerLayout({ children }) {
  return (
    <CustomerLayoutClient>
      <div className="min-h-screen flex flex-col bg-neutral-50">
        {/* ── Global navigation ─────────────────────────────────────────── */}
        <Navbar />

        {/* ── Page content ─────────────────────────────────────────────── */}
        <main
          id="main-content"
          className="flex-grow"
          // tabIndex allows the skip-link to focus this element
          tabIndex={-1}
        >
          {children}
        </main>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <Footer />

        {/* ── Floating Cart Bar (renders only if cart > 0) ──────────────── */}
        <FloatingCartBar />
      </div>
    </CustomerLayoutClient>
  );
}
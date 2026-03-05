import Footer from "@/components/customer/Footer";
import Navbar from "@/components/customer/Navbar";

/**
 * CustomerLayout — Next.js App Router layout for the (customer) route group.
 *
 * Structure:
 *   - Sticky <Navbar /> at the top
 *   - <main> flex-grows to fill remaining height
 *   - <Footer /> pinned to bottom
 *
 * Background follows customer.md: #f8fafc (surface-muted)
 *
 * @param {{ children: React.ReactNode }} props
 */
export default function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
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
    </div>
  );
}
"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import { useState } from "react";

/**
 * AdminLayout — Next.js App Router layout for the (admin) route group.
 *
 * Client Component: manages mobile sidebar toggle state (isSidebarOpen).
 *
 * Structure:
 *   ┌──────────┬─────────────────────────────┐
 *   │          │  Header (sticky top h-16)   │
 *   │ Sidebar  ├─────────────────────────────┤
 *   │ (w-64)   │  <main> scrollable content  │
 *   └──────────┴─────────────────────────────┘
 *
 * admin.md: max-width 1400px, high content density, 12-col grid
 *
 * @param {{ children: React.ReactNode }} props
 */
export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* ── Right column: Header + main ─────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Sticky top header */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Scrollable content area */}
        <main
          id="admin-main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6"
          // admin.md: max 1400px, centered
        >
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
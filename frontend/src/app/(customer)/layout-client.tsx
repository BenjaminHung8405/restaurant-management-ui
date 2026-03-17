"use client";

import { useCartExpiry } from "@/hooks/useCartExpiry";
import { ReactNode } from "react";

/**
 * CustomerLayoutClient — Client-side wrapper for customer layout
 * Runs cart expiry check on app startup (24 hours auto-clear)
 */
export default function CustomerLayoutClient({ children }: { children: ReactNode }) {
  // Check and auto-clear cart if older than 24 hours
  useCartExpiry(24);

  return <>{children}</>;
}

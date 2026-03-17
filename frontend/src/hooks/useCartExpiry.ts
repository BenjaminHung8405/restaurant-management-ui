import { useEffect, useRef } from "react";
import useCartStore from "@/store/useCartStore";

/**
 * useCartExpiry — Checks if the cart has expired (older than 24 hours)
 * and automatically clears it on app startup.
 *
 * Usage:
 *  - Call this hook in your main layout or a high-level component
 *  - It will run once on mount and check the timestamp
 *  - If cart is older than 24 hours, it will auto-clear
 *
 * Expiry Duration: 24 hours (86400000 milliseconds)
 */
export const useCartExpiry = (expiryHours: number = 24) => {
  // Use ref to ensure we only run the check once
  const hasChecked = useRef(false);

  useEffect(() => {
    // Don't run on server side
    if (typeof window === "undefined") return;

    // Skip if already checked
    if (hasChecked.current) return;
    hasChecked.current = true;

    // Get the stored state directly from localStorage to avoid Zustand subscription issues
    const storedData = localStorage.getItem("restaurant-cart-storage");
    if (!storedData) return;

    try {
      const parsed = JSON.parse(storedData);
      const state = parsed.state || {};
      const { items = [], updatedAt = Date.now() } = state;

      // Only check if cart has items
      if (items.length === 0) return;

      // Calculate expiry time in milliseconds
      const expiryMilliseconds = expiryHours * 60 * 60 * 1000; // e.g., 24 hours = 86400000ms
      const currentTime = Date.now();
      const cartAge = currentTime - updatedAt;

      // If cart is older than expiry duration, clear it
      if (cartAge > expiryMilliseconds) {
        console.warn(
          `[Cart Expiry] Cart was ${Math.round(cartAge / 1000 / 60 / 60)} hours old. Auto-clearing.`
        );
        // Use Zustand to clear
        useCartStore.getState().clearCart();
      }
    } catch (error) {
      console.error("[Cart Expiry] Failed to parse stored cart:", error);
    }
  }, [expiryHours]); // Only depend on expiryHours
};

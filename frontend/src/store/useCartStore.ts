import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * CartItem — Represents a single line item in the shopping cart.
 *
 * Key distinction: `cartItemId` is the unique identifier for this specific
 * cart line item (allows same menu_item_id with different notes as separate items).
 * `menu_item_id` references the actual menu item from the database.
 */
export interface CartItem {
  cartItemId: string;        // Unique ID for this cart line item
  menu_item_id: string;      // FK to menu_items table
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
  notes: string;
}

/**
 * CartState — Zustand store state and actions.
 */
interface CartState {
  items: CartItem[];

  // ── Actions ────────────────────────────────────────────

  /**
   * Add an item to the cart.
   *
   * Logic:
   *  - If an item with EXACT same menu_item_id AND notes exists, increment quantity.
   *  - Otherwise, generate new cartItemId and push as new line item.
   */
  addItem: (item: Omit<CartItem, "cartItemId">) => void;

  /**
   * Update quantity of an item by its cartItemId.
   *
   * Logic:
   *  - If newQuantity > 0: update the quantity.
   *  - If newQuantity <= 0: automatically remove the item.
   */
  updateQuantity: (cartItemId: string, newQuantity: number) => void;

  /**
   * Remove an item by its unique cartItemId.
   */
  removeItem: (cartItemId: string) => void;

  /**
   * Clear the entire cart.
   */
  clearCart: () => void;

  // ── Derived selectors (computed inline via custom hooks) ────────────────────

  /**
   * Get total number of items (sum of all quantities).
   */
  getTotalItems: () => number;

  /**
   * Get total price (sum of price * quantity for all items).
   */
  getTotalPrice: () => number;
}

/**
 * Generate a unique ID for a cart line item.
 * Uses crypto.randomUUID() if available; falls back to timestamp-based ID.
 */
const generateCartItemId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * useCartStore — Zustand store for the customer shopping cart.
 *
 * Features:
 *  - Persists to localStorage with key 'restaurant-cart-storage'
 *  - Supports custom notes per item (same menu_item different notes = separate line items)
 *  - Automatic removal when quantity reaches 0
 *  - Derived selectors for total items and total price
 */
const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────────────────────
      items: [],

      // ── Actions ────────────────────────────────────────────────────────────

      addItem: (item) => {
        const { items } = get();

        // Check if item with EXACT same menu_item_id AND notes already exists
        const existingIndex = items.findIndex(
          (cartItem) =>
            cartItem.menu_item_id === item.menu_item_id &&
            cartItem.notes === item.notes
        );

        if (existingIndex !== -1) {
          // Item exists: increment quantity
          set((state) => {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += item.quantity;
            return { items: updatedItems };
          });
        } else {
          // New item: generate cartItemId and push
          const newCartItem: CartItem = {
            ...item,
            cartItemId: generateCartItemId(),
          };
          set((state) => ({
            items: [...state.items, newCartItem],
          }));
        }
      },

      updateQuantity: (cartItemId, newQuantity) => {
        if (newQuantity <= 0) {
          // Auto-remove if quantity reaches 0 or below
          get().removeItem(cartItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: newQuantity }
              : item
          ),
        }));
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      // ── Derived selectors ──────────────────────────────────────────────────

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),

    // ── Persistence configuration ──────────────────────────────────────────────
    {
      name: "restaurant-cart-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items, // Only persist items; selectors are recomputed
      }),
    }
  )
);

export default useCartStore;
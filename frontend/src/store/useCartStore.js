import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * useCartStore — Zustand store for the customer shopping cart.
 *
 * State
 *   items: CartItem[]  — array of { id, name, price, quantity, image?, ... }
 *
 * Actions
 *   addItem(item)                   — add new item or increment quantity
 *   removeItem(itemId)              — remove item by id entirely
 *   updateQuantity(itemId, qty)     — set exact quantity (removes if qty <= 0)
 *   clearCart()                     — empty the cart
 *
 * Persisted to localStorage via Zustand `persist` middleware so the cart
 * survives page reloads and tab closures.
 */
const useCartStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────
      items: [],

      // ── Derived (computed inline) ──────────────────────────
      /**
       * Total number of individual units in the cart.
       */
      get totalItems() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      /**
       * Gross total price of all items.
       */
      get totalPrice() {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      // ── Actions ────────────────────────────────────────────

      /**
       * Add an item to the cart.
       * If the item already exists (matched by `id`), increment its quantity
       * by the incoming item's quantity (default 1).
       *
       * @param {object} item - must contain at least { id, name, price }
       */
      addItem: (item) => {
        const incoming = { quantity: 1, ...item };

        set((state) => {
          const existing = state.items.find((i) => i.id === incoming.id);

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === incoming.id
                  ? { ...i, quantity: i.quantity + incoming.quantity }
                  : i
              ),
            };
          }

          return { items: [...state.items, incoming] };
        });
      },

      /**
       * Remove an item from the cart entirely.
       *
       * @param {string|number} itemId
       */
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },

      /**
       * Update the quantity of a specific item.
       * Automatically removes the item if quantity reaches 0 or below.
       *
       * @param {string|number} itemId
       * @param {number}        quantity
       */
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        }));
      },

      /**
       * Clear all items from the cart.
       */
      clearCart: () => set({ items: [] }),
    }),

    // ── Persist config ───────────────────────────────────────
    {
      name: "rms-cart",                          // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist the items array; computed getters are re-derived.
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
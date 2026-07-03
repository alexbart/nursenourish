import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartState, CartItem } from "../types/cart.types";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          const newQty = Math.min(existing.quantity + item.quantity, item.maxQuantity || 99);
          set({
            items: get().items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: newQty } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: Math.min(item.quantity, item.maxQuantity || 99) }] });
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQuantity: (productId: string, quantity: number) => {
        const item = get().items.find((i) => i.productId === productId);
        if (!item) return;

        const maxQty = item.maxQuantity || 99;
        if (quantity <= 0) {
          get().removeItem(productId);
        } else {
          set({
            items: get().items.map((i) =>
              i.productId === productId ? { ...i, quantity: Math.min(quantity, maxQty) } : i
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      subtotal: () => {
        return get().items.reduce((sum, item) => {
          const price = item.salePrice || item.price;
          return sum + price * item.quantity;
        }, 0);
      },

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
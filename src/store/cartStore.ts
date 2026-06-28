"use client";

// ============================================================
// Cart store — Zustand with localStorage persistence
// ============================================================
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product, Coupon } from "@/types";
import { calculateCartSummary } from "@/utils";
import { logger } from "@/lib/logger";

interface CartState {
  items: CartItem[];
  coupon: Coupon | undefined;
  isOpen: boolean;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Selectors
  getItemCount: () => number;
  getSummary: () => ReturnType<typeof calculateCartSummary>;
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: undefined,
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            // Increase quantity of existing item
            const updatedItems = state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
                : item
            );
            logger.info("Cart: quantity updated", { productId: product.id });
            return { items: updatedItems, isOpen: true };
          }

          // Add new item
          logger.info("Cart: item added", { productId: product.id });
          return {
            items: [
              ...state.items,
              {
                product,
                quantity,
                addedAt: new Date().toISOString(),
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
        logger.info("Cart: item removed", { productId });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(quantity, 99) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], coupon: undefined });
        logger.info("Cart: cleared");
      },

      applyCoupon: (coupon) => {
        set({ coupon });
        logger.info("Cart: coupon applied", { code: coupon.code });
      },

      removeCoupon: () => {
        set({ coupon: undefined });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSummary: () => {
        const { items, coupon } = get();
        return calculateCartSummary(items, coupon?.discount ?? 0);
      },

      getItemQuantity: (productId) => {
        const item = get().items.find((i) => i.product.id === productId);
        return item?.quantity ?? 0;
      },
    }),
    {
      name: "luxetan-cart",
      storage: createJSONStorage(() => localStorage),
      // Only persist items and coupon — not UI state
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
    }
  )
);

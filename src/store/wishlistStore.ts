"use client";

// ============================================================
// Wishlist store — Zustand with localStorage persistence
// ============================================================
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistState {
  productIds: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      addItem: (productId) => {
        set((state) => {
          if (state.productIds.includes(productId)) return state;
          return { productIds: [...state.productIds, productId] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        }));
      },

      toggleItem: (productId) => {
        const { isInWishlist, addItem, removeItem } = get();
        if (isInWishlist(productId)) {
          removeItem(productId);
        } else {
          addItem(productId);
        }
      },

      isInWishlist: (productId) => get().productIds.includes(productId),

      clearWishlist: () => set({ productIds: [] }),
    }),
    {
      name: "luxetan-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

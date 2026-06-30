"use client";

// ============================================================
// Wishlist store — Zustand with localStorage persistence
// ============================================================
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getCurrentUser } from "@/services/auth";
import {
  addToWishlist as addToWishlistDb,
  removeFromWishlist as removeFromWishlistDb,
} from "@/services/user";

interface WishlistState {
  productIds: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  setWishlist: (productIds: string[]) => void;
}

const syncAddToFirebase = async (productId: string) => {
  const user = getCurrentUser();
  if (!user || user.isAnonymous) return;

  try {
    await addToWishlistDb(user.uid, productId);
  } catch (error) {
    console.error("Failed to sync wishlist add", error);
  }
};

const syncRemoveFromFirebase = async (productId: string) => {
  const user = getCurrentUser();
  if (!user || user.isAnonymous) return;

  try {
    await removeFromWishlistDb(user.uid, productId);
  } catch (error) {
    console.error("Failed to sync wishlist remove", error);
  }
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      addItem: (productId) => {
        set((state) => {
          if (state.productIds.includes(productId)) return state;
          return { productIds: [...state.productIds, productId] };
        });
        void syncAddToFirebase(productId);
      },

      removeItem: (productId) => {
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        }));
        void syncRemoveFromFirebase(productId);
      },

      setWishlist: (productIds) => {
        set({ productIds });
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
      name: "MarbellaTan-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

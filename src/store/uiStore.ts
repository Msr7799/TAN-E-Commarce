"use client";

// ============================================================
// UI store — global UI state (search, theme, etc.)
// ============================================================
import { create } from "zustand";

interface UIState {
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  searchQuery: string;

  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  setSearchQuery: (query: string) => void;

  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  searchQuery: "",

  openSearch: () => set({ isSearchOpen: true, isMobileMenuOpen: false }),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: "" }),
  toggleSearch: () =>
    set((state) => ({
      isSearchOpen: !state.isSearchOpen,
      searchQuery: state.isSearchOpen ? "" : state.searchQuery,
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));

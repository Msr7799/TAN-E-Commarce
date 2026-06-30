"use client";

// ============================================================
// Search overlay — instant, debounced, keyboard navigable
// ============================================================
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { searchProducts } from "@/services/products";
import { cn, useCurrency } from "@/utils";
import { SEARCH_DEBOUNCE_MS } from "@/constants";
import type { Product } from "@/types";

export function SearchOverlay() {
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useUIStore();
  const [results, setResults] = useState<Product[]>([]);
  const { formatPrice } = useCurrency();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Focus input when overlay opens
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setSelectedIndex(-1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setResults([]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Debounced search
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      clearTimeout(debounceTimer.current);

      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      debounceTimer.current = setTimeout(async () => {
        const found = await searchProducts(query);
        setResults(found.slice(0, 6));
        setIsLoading(false);
      }, SEARCH_DEBOUNCE_MS);
    },
    [setSearchQuery]
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, -1));
        break;
      case "Enter":
        if (selectedIndex >= 0 && results[selectedIndex]) {
          closeSearch();
          window.location.href = `/products/${results[selectedIndex].slug}`;
        }
        break;
      case "Escape":
        closeSearch();
        break;
    }
  };

  function getHighlightedText(text: string, query: string) {
    if (!query.trim()) return <>{text}</>;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-golden/20 font-semibold text-golden not-italic">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  }

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={closeSearch}
            aria-hidden="true"
          />

          {/* Search panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-6 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 px-4"
            role="dialog"
            aria-label="Search products"
            aria-modal="true"
          >
            <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4">
                <Search className="h-5 w-5 shrink-0 text-golden" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="search"
                  placeholder="Search for tanning products…"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="placeholder:text-muted-foreground flex-1 bg-transparent text-base outline-none"
                  aria-label="Search products"
                  aria-autocomplete="list"
                  aria-controls="search-results"
                  aria-activedescendant={selectedIndex >= 0 ? `result-${selectedIndex}` : undefined}
                />
                {isLoading && (
                  <Loader2
                    className="h-4 w-4 shrink-0 animate-spin text-golden"
                    aria-hidden="true"
                  />
                )}
                <button
                  onClick={closeSearch}
                  className="text-muted-foreground hover:text-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Results */}
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      id="search-results"
                      role="listbox"
                      aria-label="Search results"
                      className="border-t border-beige"
                    >
                      {results.length > 0 ? (
                        <>
                          <ul className="divide-y divide-beige">
                            {results.map((product, i) => (
                              <motion.li
                                key={product.id}
                                id={`result-${i}`}
                                role="option"
                                aria-selected={i === selectedIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                              >
                                <Link
                                  href={`/products/${product.slug}`}
                                  onClick={closeSearch}
                                  className={cn(
                                    "flex items-center gap-4 px-5 py-3 transition-colors",
                                    i === selectedIndex ? "bg-cream" : "hover:bg-cream/50"
                                  )}
                                >
                                  {/* Placeholder image */}
                                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-golden/20 to-amber-100">
                                    <span className="text-xs font-bold text-golden">
                                      {product.name.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                      {getHighlightedText(product.name, searchQuery)}
                                    </p>
                                    <p className="text-muted-foreground truncate text-xs">
                                      {product.category.replace("-", " ")}
                                    </p>
                                  </div>
                                  <span className="text-sm font-bold text-golden">
                                    {formatPrice(product.price)}
                                  </span>
                                </Link>
                              </motion.li>
                            ))}
                          </ul>

                          {/* View all */}
                          <div className="p-3">
                            <Link
                              href={`/shop?q=${encodeURIComponent(searchQuery)}`}
                              onClick={closeSearch}
                              className="flex items-center justify-center gap-2 rounded-xl bg-cream px-4 py-2 text-sm font-medium text-golden transition-colors hover:bg-golden hover:text-black"
                            >
                              View all results for &ldquo;{searchQuery}&rdquo;
                              <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                          </div>
                        </>
                      ) : (
                        !isLoading && (
                          <div className="px-5 py-8 text-center">
                            <p className="text-muted-foreground text-sm">
                              No products found for &ldquo;{searchQuery}&rdquo;
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs">
                              Try a different search term
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import { MOCK_PRODUCTS } from "@/lib/mockData";
import type { Product, ProductCategory, StockStatus } from "@/types";

const STORAGE_KEY = "marbella-tan-products";

export function loadStoredProducts(): Product[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Product[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveStoredProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function getPersistedProducts(): Product[] {
  const stored = loadStoredProducts();
  return stored.length > 0 ? stored : MOCK_PRODUCTS;
}

export function generateProductId(products: Product[]) {
  if (products.length === 0) return "1";
  const maxId = Math.max(...products.map((product) => Number(product.id) || 0));
  return String(maxId + 1);
}

export function generateSlug(name: string, existingSlugs: string[] = []) {
  const baseSlug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug || "product";
  }

  let suffix = 1;
  while (existingSlugs.includes(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
}

export function normalizePrice(value: string) {
  return Number(value.replace(/[^0-9.]/g, "")) || 0;
}

export const PRODUCT_CATEGORIES: ReadonlyArray<{ value: ProductCategory; label: string }> = [
  { value: "self-tanner", label: "Self Tanner" },
  { value: "tanning-lotion", label: "Tanning Lotion" },
  { value: "tanning-oil", label: "Tanning Oil" },
  { value: "bronzer", label: "Bronzer" },
  { value: "after-sun", label: "After Sun" },
  { value: "accessories", label: "Accessories" },
  { value: "bundles", label: "Bundles" },
] as const;

export const STOCK_STATUSES: ReadonlyArray<{ value: StockStatus; label: string }> = [
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
] as const;

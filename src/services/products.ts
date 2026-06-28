// ============================================================
// Products service — data access layer
// ============================================================
import type { Product, PaginatedResponse, SearchFilters } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { PRODUCTS_PER_PAGE } from "@/constants";
import { logger, NetworkError } from "@/lib/logger";
import { wait } from "@/utils";

// Simulated network delay for realistic loading states
const SIMULATED_DELAY_MS = 300;

// ——— Get all products (paginated + filtered) —————————————
export async function getProducts(
  page = 1,
  filters?: SearchFilters
): Promise<PaginatedResponse<Product>> {
  try {
    await wait(SIMULATED_DELAY_MS);

    let products = [...MOCK_PRODUCTS];

    // Apply filters
    if (filters?.category) {
      products = products.filter((p) => p.category === filters.category);
    }
    if (filters?.minPrice !== undefined) {
      products = products.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters?.rating !== undefined) {
      products = products.filter((p) => p.rating >= filters.rating!);
    }
    if (filters?.inStock) {
      products = products.filter((p) => p.stockStatus !== "out_of_stock");
    }

    // Apply sort
    switch (filters?.sortBy) {
      case "price_asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        products.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        // Featured first
        products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    const total = products.length;
    const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const data = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

    return { data, total, page, pageSize: PRODUCTS_PER_PAGE, totalPages };
  } catch (error) {
    logger.error("Failed to fetch products", { error: String(error) });
    throw new NetworkError("Failed to load products. Please try again.");
  }
}

// ——— Get a single product by slug ———————————————————
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    await wait(SIMULATED_DELAY_MS);
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  } catch (error) {
    logger.error("Failed to fetch product", { slug, error: String(error) });
    throw new NetworkError("Failed to load product. Please try again.");
  }
}

// ——— Get featured products ——————————————————————————
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  await wait(SIMULATED_DELAY_MS);
  return MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
}

// ——— Get related products ——————————————————————————
export async function getRelatedProducts(
  productId: string,
  category: string,
  limit = 4
): Promise<Product[]> {
  await wait(SIMULATED_DELAY_MS);
  return MOCK_PRODUCTS.filter(
    (p) => p.id !== productId && p.category === category
  ).slice(0, limit);
}

// ——— Search products ————————————————————————————
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    await wait(150); // Fast search response
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.shortDescription.toLowerCase().includes(lowerQuery) ||
        p.tags.some((t) => t.includes(lowerQuery)) ||
        p.category.includes(lowerQuery)
    );
  } catch (error) {
    logger.error("Search failed", { query, error: String(error) });
    return [];
  }
}

// ——— Get all product slugs (for SSG) ————————————————
export async function getAllProductSlugs(): Promise<string[]> {
  return MOCK_PRODUCTS.map((p) => p.slug);
}

// ——— Query keys (for TanStack Query cache) ——————————
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: SearchFilters, page: number) =>
    [...productKeys.lists(), filters, page] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
  featured: (limit: number) => [...productKeys.all, "featured", limit] as const,
  related: (id: string, category: string) =>
    [...productKeys.all, "related", id, category] as const,
  search: (query: string) => [...productKeys.all, "search", query] as const,
};

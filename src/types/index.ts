// ============================================================
// Core TypeScript types and interfaces for the entire application
// ============================================================

// ——— Product ————————————————————————————————
export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: ProductImage[];
  hoverImage?: ProductImage;
  category: ProductCategory;
  tags: string[];
  rating: number;
  reviewCount: number;
  stockStatus: StockStatus;
  stockCount: number;
  sku: string;
  specifications: ProductSpecification[];
  isFeatured: boolean;
  isNew: boolean;
  discount?: number; // percentage
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  isPrimary: boolean;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type ProductCategory =
  | "self-tanner"
  | "tanning-lotion"
  | "tanning-oil"
  | "bronzer"
  | "after-sun"
  | "accessories"
  | "bundles";

// ——— Cart ————————————————————————————————————
export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  coupon?: Coupon;
}

export interface Coupon {
  code: string;
  discount: number; // percentage
  type: "percentage" | "fixed";
  isValid: boolean;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}

// ——— Search ————————————————————————————————
export interface SearchResult {
  products: Product[];
  total: number;
  query: string;
}

export interface SearchFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sortBy?: SortOption;
}

export type SortOption = "featured" | "price_asc" | "price_desc" | "rating" | "newest";

// ——— FAQ ————————————————————————————————————
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

// ——— Navigation ——————————————————————————————
export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

// ——— Contact Form ——————————————————————————
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ——— AI / Personalization ———————————————————
export interface AIPersonalizationConfig {
  enabled: boolean;
  hasUserConsent: boolean;
  sessionData?: SessionData;
}

export interface SessionData {
  viewedProducts: string[]; // product IDs only — no personal data
  searchQueries: string[];
  categoryInterests: ProductCategory[];
}

export interface AIRecommendation {
  productId: string;
  reason: string;
  confidence: number;
}

// ——— API Responses ———————————————————————
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ——— Error Types ——————————————————————————
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

// ——— Theme ———————————————————————————————
export type Theme = "light" | "dark" | "system";

// ——— Wishlist ———————————————————————————
export interface WishlistItem {
  productId: string;
  addedAt: string;
}

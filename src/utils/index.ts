// ============================================================
// Utility functions
// ============================================================
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CURRENCY_SYMBOL, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/constants";
import type { CartItem, CartSummary } from "@/types";

// ——— Tailwind class merge helper ————————————
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CurrencyConfig {
  code: string;
  symbolEn: string;
  symbolAr: string;
  rate: number;
  decimals: number;
}

const CURRENCIES: Record<string, CurrencyConfig> = {
  BHD: { code: "BHD", symbolEn: "BD", symbolAr: "د.ب", rate: 1.0, decimals: 3 },
  SAR: { code: "SAR", symbolEn: "SR", symbolAr: "ر.س", rate: 9.97, decimals: 2 },
  AED: { code: "AED", symbolEn: "AED", symbolAr: "د.إ", rate: 9.75, decimals: 2 },
  KWD: { code: "KWD", symbolEn: "KD", symbolAr: "د.ك", rate: 0.81, decimals: 3 },
  OMR: { code: "OMR", symbolEn: "OMR", symbolAr: "ر.ع", rate: 1.02, decimals: 3 },
  QAR: { code: "QAR", symbolEn: "QR", symbolAr: "ر.ق", rate: 9.66, decimals: 2 },
  USD: { code: "USD", symbolEn: "$", symbolAr: "$", rate: 2.65, decimals: 2 },
};

export function getDetectedCurrency(): CurrencyConfig {
  if (typeof window === "undefined") {
    return CURRENCIES.BHD;
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes("Riyadh") || tz.includes("Jeddah") || tz.includes("Asia/Riyadh")) return CURRENCIES.SAR;
    if (tz.includes("Dubai") || tz.includes("Abu_Dhabi") || tz.includes("Asia/Dubai")) return CURRENCIES.AED;
    if (tz.includes("Kuwait") || tz.includes("Asia/Kuwait")) return CURRENCIES.KWD;
    if (tz.includes("Muscat") || tz.includes("Asia/Muscat")) return CURRENCIES.OMR;
    if (tz.includes("Qatar") || tz.includes("Doha") || tz.includes("Asia/Qatar")) return CURRENCIES.QAR;
    if (tz.includes("Bahrain") || tz.includes("Asia/Bahrain")) return CURRENCIES.BHD;
    
    // Check navigator languages as secondary hint
    const lang = navigator.language.toLowerCase();
    if (lang.endsWith("-sa")) return CURRENCIES.SAR;
    if (lang.endsWith("-ae")) return CURRENCIES.AED;
    if (lang.endsWith("-kw")) return CURRENCIES.KWD;
    if (lang.endsWith("-om")) return CURRENCIES.OMR;
    if (lang.endsWith("-qa")) return CURRENCIES.QAR;
    if (lang.endsWith("-bh")) return CURRENCIES.BHD;

    return CURRENCIES.BHD;
  } catch {
    return CURRENCIES.BHD;
  }
}

// ——— Currency formatting ———————————————————
export function formatPrice(amount: number, currency?: string): string {
  const config = getDetectedCurrency();
  const activeCurrency = currency || config.code;
  const activeConfig = CURRENCIES[activeCurrency] || CURRENCIES.BHD;
  const convertedAmount = amount * activeConfig.rate;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: activeConfig.code,
    minimumFractionDigits: activeConfig.decimals,
    maximumFractionDigits: activeConfig.decimals,
  }).format(convertedAmount);
}

// ——— Price with symbol only ———————————————
export function formatPriceSimple(amount: number): string {
  const isClient = typeof window !== "undefined";
  const isArabic = isClient && document.documentElement.lang === "ar";
  
  const config = getDetectedCurrency();
  const convertedAmount = amount * config.rate;
  const formattedAmount = convertedAmount.toLocaleString("en-US", {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  });

  const symbol = isArabic ? config.symbolAr : config.symbolEn;
  if (config.code === "USD") {
    return isArabic ? `${formattedAmount} دولار` : `$${formattedAmount}`;
  }
  return isArabic ? `${formattedAmount} ${symbol}` : `${symbol} ${formattedAmount}`;
}

// ——— Discount percentage display ——————————
export function formatDiscount(original: number, sale: number): string {
  const pct = Math.round(((original - sale) / original) * 100);
  return `-${pct}%`;
}

// ——— Cart summary calculation ——————————————
export function calculateCartSummary(items: CartItem[], couponDiscount = 0): CartSummary {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : SHIPPING_COST;
  const discount = subtotal * (couponDiscount / 100);
  const total = Math.max(0, subtotal - discount + shipping);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, shipping, discount, total, itemCount };
}

// ——— Slug generation ——————————————————————
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ——— Truncate text ———————————————————————
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

// ——— Debounce ————————————————————————————
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ——— Pluralise ——————————————————————————
export function pluralise(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

// ——— Rating star display ————————————————
export function getRatingStars(rating: number): {
  full: number;
  half: boolean;
  empty: number;
} {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
}

// ——— Safe JSON parse ————————————————————
export function safeJsonParse<T>(str: string | null, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

// ——— Stock status label ———————————————
export function getStockLabel(
  status: string,
  count: number
): { label: string; color: string } {
  if (status === "out_of_stock") return { label: "Out of Stock", color: "text-red-500" };
  if (status === "low_stock" || count <= 5)
    return { label: `Only ${count} left!`, color: "text-amber-500" };
  return { label: "In Stock", color: "text-emerald-500" };
}

// ——— Wait / delay ————————————————————
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ——— URL builder ——————————————————————
export function buildUrl(base: string, params: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(base, "http://localhost");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return `${url.pathname}${url.search}`;
}

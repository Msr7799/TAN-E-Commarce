// ============================================================
// الدوال المساعدة العامة (Utility Functions)
// ============================================================
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CartItem, CartSummary } from "@/types";
import {
  formatCurrency,
  formatPriceSimple,
  getCurrentCurrencyCode,
  getSavedCurrencyCode,
  saveCurrencyCode,
  type CurrencyCode,
  type ExchangeRates,
} from "./currency";
import { useCurrency } from "./currency-provider";

/**
 * دالة مساعدة لدمج كلاسات Tailwind CSS بشكل آمن وتجنب التكرار والتعارض.
 * تستخدم clsx لتجميع الكلاسات و twMerge لحل التعارضات.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export {
  formatCurrency,
  formatPriceSimple,
  getCurrentCurrencyCode,
  getSavedCurrencyCode,
  saveCurrencyCode,
  useCurrency,
};
export type { CurrencyCode, ExchangeRates } from "./currency";

/**
 * دالة لحساب وعرض نسبة الخصم بين السعر الأصلي وسعر البيع.
 */
export function formatDiscount(original: number, sale: number): string {
  const pct = Math.round(((original - sale) / original) * 100);
  return `-${pct}%`;
}

/**
 * حساب ملخص السلة بما يشمل المجموع الفرعي، تكلفة الشحن، قيمة الخصم والمجموع الكلي.
 */
export function calculateCartSummary(items: CartItem[], couponDiscount = 0): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  // الشحن مجاني دائماً
  const shipping = 0;
  const discount = subtotal * (couponDiscount / 100);
  const total = Math.max(0, subtotal - discount + shipping);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, shipping, discount, total, itemCount };
}

/**
 * توليد اسم لطيف (Slug) للروابط (URL) من اسم المنتج.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * قص النصوص الطويلة وعرض علامة (...) في نهايتها.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

/**
 * دالة التحكم بمعدل التنفيذ (Debounce) لمنع تنفيذ العمليات المتكررة بكثرة (مثل البحث أثناء الكتابة).
 */
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

/**
 * دالة تحديد صيغة الجمع للكلمات باللغة الإنجليزية بناءً على العدد.
 */
export function pluralise(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

/**
 * حساب عدد النجوم الكاملة والنصف فارغة والنجوم الفارغة لتقييم المنتج.
 */
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

/**
 * تحليل نصوص الـ JSON بشكل آمن وتجنب توقف التطبيق في حال وجود أخطاء في الصياغة.
 */
export function safeJsonParse<T>(str: string | null, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

/**
 * تحديد مسمى وحالة توفر المخزن للمنتج وتحديد كود اللون المناسب (أخضر للمتوفر، برتقالي للقرب النفاد، أحمر للنافد).
 */
export function getStockLabel(status: string, count: number): { label: string; color: string } {
  if (status === "out_of_stock") return { label: "Out of Stock", color: "text-red-500" };
  if (status === "low_stock" || count <= 5)
    return { label: `Only ${count} left!`, color: "text-amber-500" };
  return { label: "In Stock", color: "text-emerald-500" };
}

/**
 * دالة مساعدة لعمل تأخير زمني (Wait / Sleep) باستخدام الـ Promises.
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * بناء روابط الـ URL مع معاملات البحث (Query Parameters) بشكل آمن وتجاهل المعاملات الفارغة.
 */
export function buildUrl(
  base: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(base, "http://localhost");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return `${url.pathname}${url.search}`;
}
